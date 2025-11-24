import { Lead, FormModel } from '../types';
import { STORAGE_KEYS, DEFAULT_FORM_MODEL } from '../constants';

// --- Leads Operations ---

export const getLeads = (): Lead[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
  return stored ? JSON.parse(stored) : [];
};

export const saveLead = (lead: Lead): void => {
  const leads = getLeads();
  const newLeads = [lead, ...leads];
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(newLeads));
};

// --- Models Operations ---

export const getModels = (): FormModel[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.MODELS);
  if (!stored) {
    // Initialize with default if empty
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify([DEFAULT_FORM_MODEL]));
    return [DEFAULT_FORM_MODEL];
  }
  return JSON.parse(stored);
};

export const saveModel = (model: FormModel): void => {
  const models = getModels();
  const existingIndex = models.findIndex((m) => m.id === model.id);
  
  if (existingIndex >= 0) {
    models[existingIndex] = model;
  } else {
    models.push(model);
  }
  
  localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
};

export const deleteModel = (id: string): void => {
  const models = getModels();
  const filtered = models.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(filtered));
};

export const getActiveModel = (): FormModel | undefined => {
  const models = getModels();
  return models.find((m) => m.isActive);
};

export const setModelActive = (id: string): void => {
  const models = getModels();
  const updated = models.map((m) => ({
    ...m,
    isActive: m.id === id, // Only the selected one is active
  }));
  localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(updated));
};