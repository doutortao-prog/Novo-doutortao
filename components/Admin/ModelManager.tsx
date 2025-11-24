import React from 'react';
import { FormModel } from '../../types';
import { CheckCircle2, Circle, Trash2, Edit } from 'lucide-react';

interface ModelManagerProps {
  models: FormModel[];
  onActivate: (id: string) => void;
  onEdit: (model: FormModel) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const ModelManager: React.FC<ModelManagerProps> = ({ models, onActivate, onEdit, onDelete, onCreateNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">My Capture Models</h2>
            <p className="text-slate-500 text-sm">Manage your saved templates and active campaigns.</p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-md shadow-blue-500/20"
        >
          + Create New Model
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div
            key={model.id}
            className={`group relative bg-white rounded-xl p-6 border-2 transition-all duration-200 ${
              model.isActive
                ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            {/* Active Badge */}
            <div className="flex justify-between items-start mb-4">
                <button
                    onClick={() => onActivate(model.id)}
                    className={`flex items-center gap-2 text-sm font-medium ${
                        model.isActive ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'
                    }`}
                >
                    {model.isActive ? (
                        <><CheckCircle2 size={20} fill="#EFF6FF" /> Active</>
                    ) : (
                        <><Circle size={20} /> Set Active</>
                    )}
                </button>
                <span className="text-xs text-slate-400 font-mono">
                    {new Date(model.createdArt).toLocaleDateString()}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 truncate">{model.name}</h3>
            
            <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-500 line-clamp-2">{model.headline}</p>
                 <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-2 rounded">
                    <span className="font-semibold uppercase">File:</span>
                    <span className="truncate">{model.fileName || "None"}</span>
                 </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-auto">
                <button
                    onClick={() => onEdit(model)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
                >
                    <Edit size={16} /> Edit
                </button>
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this model?')) {
                            onDelete(model.id);
                        }
                    }}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelManager;