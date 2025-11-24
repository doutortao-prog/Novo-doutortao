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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      setIsAuthenticated(true);
      setCurrentView(ViewState.ADMIN_DASHBOARD);
      setAuthError('');
      setAdminUsername('');
      setAdminPassword('');
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
        isAdminLoggedIn={isAuthenticated}
        onBackToAdmin={() => setCurrentView(ViewState.ADMIN_DASHBOARD)}
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
import React, { useState, useEffect } from 'react';
import { ViewState, AdminTab, Lead, FormModel } from './types';
import { ADMIN_CREDENTIALS } from './constants';
import * as storage from './services/storage';

// Components
import LeadCapture from './components/Public/LeadCapture';
import React, { useState } from 'react';
import { FormModel } from '../../types';
import { Lock, Mail, User, Phone, CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

interface LeadCaptureProps {
  model: FormModel;
  onAdminLoginClick: () => void;
  onSubmit: (name: string, email: string, whatsapp: string) => Promise<void>;
  isAdminLoggedIn?: boolean;
  onBackToAdmin?: () => void;
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ 
  model, 
  onAdminLoginClick, 
  onSubmit, 
  isAdminLoggedIn = false, 
  onBackToAdmin 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate slight network delay
    setTimeout(async () => {
        await onSubmit(name, email, whatsapp);
        setIsSubmitting(false);
    }, 1500);
  };

  // Convert hex color to rgba for shadow
  const getShadowColor = (hex: string) => {
    // Simple mock logic for dynamic shadow color
    return `${hex}40`; // 25% opacity
  };

  return (
    <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{ backgroundColor: model.backgroundColor }}
    >
      {/* Admin Navigation */}
      {isAdminLoggedIn ? (
        <button
          onClick={onBackToAdmin}
          className="absolute top-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium hover:bg-slate-800 transition-all z-50 flex items-center gap-2"
        >
          <LayoutDashboard size={16} />
          Back to Dashboard
        </button>
      ) : (
        <button 
          onClick={onAdminLoginClick} 
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
          aria-label="Admin Login"
        >
          <Lock size={16} />
        </button>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Copy Section */}
        <div className="space-y-6 text-center lg:text-left">
            <h1 
                className="text-4xl lg:text-5xl font-extrabold leading-tight"
                style={{ color: model.textColor }}
            >
                {model.headline}
            </h1>
            <p 
                className="text-lg opacity-80"
                style={{ color: model.textColor }}
            >
                {model.subheadline}
            </p>
            
            <div className="hidden lg:flex items-center gap-4 text-sm font-medium opacity-60" style={{ color: model.textColor }}>
                <div className="flex items-center gap-1"><CheckCircle size={16}/> Instant Access</div>
                <div className="flex items-center gap-1"><CheckCircle size={16}/> Secure Download</div>
                <div className="flex items-center gap-1"><CheckCircle size={16}/> {model.fileName || 'Exclusive File'}</div>
            </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: model.ctaColor }}></div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Enter your details to receive the file</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                 <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="tel"
                        required
                        placeholder="WhatsApp (with area code)"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg font-bold text-white text-lg shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
                    style={{ 
                        backgroundColor: model.ctaColor,
                        boxShadow: `0 10px 15px -3px ${getShadowColor(model.ctaColor)}`
                    }}
                >
                   {isSubmitting ? 'Sending...' : (
                       <>
                         {model.ctaText} <ArrowRight size={20} />
                       </>
                   )}
                </button>
            </form>
            
            <p className="text-xs text-center text-slate-400 mt-4">
                We respect your privacy. Your data is safe with us.
            </p>
        </div>

      </div>
    </div>
  );
};

export default LeadCapture;
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
