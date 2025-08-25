// services/devisConstants.js
export const DEVIS_STATUS = {
  EN_COURS: 0,    // Statut par défaut
  ACCEPTE: 1,     // Statut accepté
  REJETE: 2,      // Statut rejeté
  
  getLabel: (status) => {
    switch (status) {
      case DEVIS_STATUS.EN_COURS: return "En Cours";
      case DEVIS_STATUS.ACCEPTE: return "Accepté";
      case DEVIS_STATUS.REJETE: return "Rejeté";
      default: return "Inconnu";
    }
  },
  
  getColor: (status) => {
    switch (status) {
      case DEVIS_STATUS.EN_COURS: return "warning";
      case DEVIS_STATUS.ACCEPTE: return "success";
      case DEVIS_STATUS.REJETE: return "error";
      default: return "default";
    }
  }
};