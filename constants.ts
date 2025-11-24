import { FormModel } from './types';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export const DEFAULT_FORM_MODEL: FormModel = {
  id: 'default-1',
  name: 'Default Capture Page',
  headline: 'Unlock Your Exclusive Guide Now',
  subheadline: 'Join thousands of professionals who have leveled up their skills. Enter your details below to receive the file instantly.',
  ctaText: 'RECEIVE FILE NOW',
  ctaColor: '#3b82f6', // blue-500
  backgroundColor: '#f3f4f6', // gray-100
  textColor: '#1f2937', // gray-800
  redirectUrl: 'https://example.com/sales-page',
  fileName: 'exclusive-guide.pdf',
  isActive: true,
  createdArt: new Date().toISOString(),
};

export const STORAGE_KEYS = {
  LEADS: 'leadflow_leads',
  MODELS: 'leadflow_models',
};