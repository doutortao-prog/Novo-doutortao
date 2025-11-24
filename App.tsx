import React, { useState, useEffect } from 'react';
import { ViewState, AdminTab, Lead, FormModel } from './types';
import { ADMIN_CREDENTIALS } from './constants';
import * as storage from './services/storage';

// Components
import LeadCapture from './components/Public/LeadCapture';
import AdminSidebar from './components/Admin/AdminSidebar';
import ModelManager from './components/Admin/ModelManager';
import FormEditor from './components/Admin/FormEditor';
import LeadsTable from './components/Admin/LeadsTable';

const App: React.FC = () => {
  // State: Routing
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.PUBLIC_LANDING);
  
  // State: Admin
  const [adminTab, setAdminTab] = useState<AdminTab>(AdminTab.MODELS);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [modelToEdit, setModelToEdit] = useState<FormModel | null>(null);

  // State: Data
  const [activeModel, setActiveModel] = useState<FormModel | undefined>(undefined);
  const [allModels, setAllModels] = useState<FormModel[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);

  // Initialize
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const models = storage.getModels();
    setAllModels(models);
    setActiveModel(storage.getActiveModel() || models[0]);
    setAllLeads(storage.getLeads());
  };

  // --- Handlers: Public ---

  const handleLeadSubmit = async (name: string, email: string, whatsapp: string) => {
    if (!activeModel) return;

    // 1. Save Lead
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      formId: activeModel.id,
      name,
      email,
      whatsapp,
      capturedAt: new Date().toISOString(),
    };
    storage.saveLead(newLead);
    refreshData(); // Update local state if admin is watching somewhere else

    // 2. Simulate Background Email
    console.log(`[Background Service] Sending email with file ${activeModel.fileName} to ${email}...`);
    alert(`File sent to ${email} successfully! Redirecting...`);

    // 3. Redirect
    window.location.href = activeModel.redirectUrl;
  };

  // --- Handlers: Admin Auth ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === ADMIN_CREDENTIALS.username && adminPassword === ADMIN_CREDENTIALS.password) {
      setCurrentView(ViewState.ADMIN_DASHBOARD);
      setAuthError('');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentView(ViewState.PUBLIC_LANDING);
  };

  // --- Handlers: Model Management ---

  const handleActivateModel = (id: string) => {
    storage.setModelActive(id);
    refreshData();
  };

  const handleDeleteModel = (id: string) => {
    storage.deleteModel(id);
    refreshData();
  };

  const handleSaveModel = (model: FormModel) => {
    storage.saveModel(model);
    refreshData();
    setAdminTab(AdminTab.MODELS);
    setModelToEdit(null);
  };

  const startEdit = (model: FormModel) => {
    setModelToEdit(model);
    setAdminTab(AdminTab.EDITOR);
  };

  const startCreate = () => {
    setModelToEdit(null);
    setAdminTab(AdminTab.EDITOR);
  };

  // --- Render ---

  // 1. Public View
  if (currentView === ViewState.PUBLIC_LANDING) {
    if (!activeModel) return <div className="p-10 text-center">No active form configured. Please login as admin.</div>;
    return (
      <LeadCapture 
        model={activeModel} 
        onAdminLoginClick={() => setCurrentView(ViewState.ADMIN_LOGIN)}
        onSubmit={handleLeadSubmit}
      />
    );
  }

  // 2. Admin Login
  if (currentView === ViewState.ADMIN_LOGIN) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Admin Access</h2>
            <p className="text-slate-500 text-sm mt-2">Enter credentials to manage settings</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                    type="text" 
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                    type="password" 
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                Enter Dashboard
            </button>
            <button 
                type="button" 
                onClick={() => setCurrentView(ViewState.PUBLIC_LANDING)}
                className="w-full text-slate-500 text-sm py-2 hover:text-slate-700"
            >
                Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar 
        activeTab={adminTab} 
        onTabChange={setAdminTab} 
        onLogout={handleLogout}
        onViewPublic={() => setCurrentView(ViewState.PUBLIC_LANDING)}
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {adminTab === AdminTab.MODELS && (
          <ModelManager 
            models={allModels} 
            onActivate={handleActivateModel}
            onEdit={startEdit}
            onDelete={handleDeleteModel}
            onCreateNew={startCreate}
          />
        )}

        {adminTab === AdminTab.EDITOR && (
          <FormEditor 
            modelToEdit={modelToEdit} 
            onSave={handleSaveModel}
            onCancel={() => setAdminTab(AdminTab.MODELS)}
          />
        )}

        {adminTab === AdminTab.LEADS && (
          <LeadsTable leads={allLeads} models={allModels} />
        )}
      </main>
    </div>
  );
};

export default App;