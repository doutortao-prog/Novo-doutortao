export interface Lead {
  id: string;
  formId: string;
  name: string;
  email: string;
  whatsapp: string;
  capturedAt: string; // ISO Date string
}

export interface FormModel {
  id: string;
  name: string; // Internal admin name
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaColor: string;
  backgroundColor: string; // Hex or Tailwind class
  textColor: string;
  redirectUrl: string;
  fileName: string | null; // Simulated file attachment
  isActive: boolean;
  createdArt: string;
}

export enum ViewState {
  PUBLIC_LANDING = 'PUBLIC_LANDING',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export enum AdminTab {
  MODELS = 'MODELS',
  EDITOR = 'EDITOR',
  LEADS = 'LEADS',
}

export interface UserSession {
  isAuthenticated: boolean;
}