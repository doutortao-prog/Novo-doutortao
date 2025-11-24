import React, { useState, useMemo } from 'react';
import { Lead, FormModel } from '../../types';
import { FileDown, Search, Filter } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  models: FormModel[];
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, models }) => {
  const [filterModelId, setFilterModelId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesModel = filterModelId === 'ALL' || lead.formId === filterModelId;
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.whatsapp.includes(searchTerm);
      return matchesModel && matchesSearch;
    });
  }, [leads, filterModelId, searchTerm]);

  const getModelName = (id: string) => {
    return models.find(m => m.id === id)?.name || 'Unknown Model';
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'Form Model', 'Captured At'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.whatsapp}"`,
        `"${getModelName(lead.formId)}"`,
        `"${new Date(lead.capturedAt).toLocaleString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'leads_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between gap-4 items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Filter size={20} className="text-blue-600"/>
            Leads Management
        </h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search leads..."
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <select
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={filterModelId}
                onChange={(e) => setFilterModelId(e.target.value)}
            >
                <option value="ALL">All Models</option>
                {models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>

            <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
                <FileDown size={16} />
                Export CSV
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">WhatsApp</th>
                    <th className="px-6 py-4">Model</th>
                    <th className="px-6 py-4">Date</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
                {filteredLeads.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            No leads found matching your criteria.
                        </td>
                    </tr>
                ) : (
                    filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                            <td className="px-6 py-4 text-slate-600">{lead.email}</td>
                            <td className="px-6 py-4 text-slate-600">{lead.whatsapp}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    {getModelName(lead.formId)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm">
                                {new Date(lead.capturedAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;