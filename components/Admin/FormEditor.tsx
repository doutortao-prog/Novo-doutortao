import React, { useState, useEffect } from 'react';
import { FormModel } from '../../types';
import { generateLandingCopy } from '../../services/geminiService';
import { Save, Sparkles, Loader2, Upload } from 'lucide-react';

interface FormEditorProps {
  modelToEdit?: FormModel | null;
  onSave: (model: FormModel) => void;
  onCancel: () => void;
}

const FormEditor: React.FC<FormEditorProps> = ({ modelToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormModel>({
    id: `model-${Date.now()}`,
    name: '',
    headline: '',
    subheadline: '',
    ctaText: 'RECEIVE FILE',
    ctaColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    redirectUrl: '',
    fileName: null,
    isActive: false,
    createdArt: new Date().toISOString(),
  });

  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (modelToEdit) {
      setFormData(modelToEdit);
    }
  }, [modelToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate file upload by just storing the name
      setFormData((prev) => ({ ...prev, fileName: e.target.files![0].name }));
    }
  };

  const handleGenerateCopy = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const copy = await generateLandingCopy(aiTopic);
      setFormData((prev) => ({
        ...prev,
        headline: copy.headline,
        subheadline: copy.subheadline,
        ctaText: copy.ctaText
      }));
    } catch (error) {
      alert("Failed to generate content. Please check API Key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.headline || !formData.redirectUrl) {
      alert("Please fill in all required fields (Internal Name, Headline, Redirect URL)");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {modelToEdit ? 'Edit Form Model' : 'Create New Model'}
        </h2>
        <div className="flex gap-3">
            <input
                type="text"
                placeholder="Product topic for AI..."
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-purple-500 outline-none"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
            />
            <button
                onClick={handleGenerateCopy}
                disabled={isGenerating || !aiTopic}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Magic Copy
            </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Internal Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Model Name (Internal)</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Ebook Campaign 2024"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Redirect URL (After Submit)</label>
                <input
                    type="url"
                    name="redirectUrl"
                    value={formData.redirectUrl}
                    onChange={handleChange}
                    placeholder="https://your-sales-page.com"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Upload File (Simulator)</label>
                 <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer flex items-center justify-center border border-dashed border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors">
                        <Upload size={16} className="text-slate-400 mr-2"/>
                        <span className="text-sm text-slate-600 truncate">{formData.fileName || "Choose File..."}</span>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                 </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Visual Editor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Subheadline</label>
                <textarea
                    name="subheadline"
                    value={formData.subheadline}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CTA Button Text</label>
                <input
                    type="text"
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

             <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Btn Color</label>
                    <input
                        type="color"
                        name="ctaColor"
                        value={formData.ctaColor}
                        onChange={handleChange}
                        className="w-full h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                    />
                 </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bg Color</label>
                    <input
                        type="color"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleChange}
                        className="w-full h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                    />
                 </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                    <input
                        type="color"
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleChange}
                        className="w-full h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                    />
                 </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
            >
                <Save size={18} />
                Save Model
            </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditor;