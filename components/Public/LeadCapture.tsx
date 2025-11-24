import React, { useState } from 'react';
import { FormModel } from '../../types';
import { Lock, Mail, User, Phone, CheckCircle, ArrowRight } from 'lucide-react';

interface LeadCaptureProps {
  model: FormModel;
  onAdminLoginClick: () => void;
  onSubmit: (name: string, email: string, whatsapp: string) => Promise<void>;
}

const LeadCapture: React.FC<LeadCaptureProps> = ({ model, onAdminLoginClick, onSubmit }) => {
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
      {/* Discreet Admin Login */}
      <button 
        onClick={onAdminLoginClick} 
        className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
        aria-label="Admin Login"
      >
        <Lock size={16} />
      </button>

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