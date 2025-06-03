import { AppState } from "../stores/slices/appSlice";
import { store } from "../stores/store";

/**
 * Retourne les classes CSS en fonction du statut de la chambre
 * @param status Statut de la chambre (Disponible, Occupée, Réservée, Maintenance)
 * @returns Chaîne de caractères contenant les classes CSS
 */
export const getStatusClass = (status: string): string => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Occupée':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Réservée':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  /**
   * Formatte un nombre en devise
   * @param amount Montant à formater
   * @param currency Devise (par défaut XOF)
   * @returns Chaîne de caractères formatée
   */
  export const formatCurrency = (amount: number, currency: string = 'XOF'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Formate une date au format local
   * @param date Date à formater
   * @returns Chaîne de caractères formatée
   */
  export const formatDate = (date: string | Date): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };
  
  /**
   * Tronque un texte à une longueur maximale
   * @param text Texte à tronquer
   * @param maxLength Longueur maximale
   * @returns Texte tronqué
   */
  export const truncateText = (text: string, maxLength: number = 30): string => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Génère une couleur aléatoire au format hexadécimal
   * @returns Couleur au format hexadécimal
   */
  export const getRandomColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };
  
  /**
   * Convertit un booléen en texte lisible
   * @param value Valeur booléenne
   * @returns Texte correspondant
   */
  export const booleanToText = (value: boolean): string => {
    return value ?  'Oui' : 'Non';
  };

  export const convertDateToLocaleStringDateTime = (date: any) => {
    return new Date(date).toLocaleString("fr-FR", {
        timeZone: "UTC",
        month: "numeric",
        day: "numeric",
        year: "numeric",
        minute: "numeric",
        hour: "numeric",
        second: "2-digit",
    })
}

  // Déterminer la couleur du badge de statut
  export const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmee':
        return 'text-success bg-success/20 border-success';
      case 'en_attente':
        return 'text-warning bg-warning/20 border-warning';
      case 'annulee':
        return 'text-danger bg-danger/20 border-danger';
      case 'terminee':
        return 'text-slate-500 bg-slate-200 border-slate-500';
      default:
        return 'text-slate-500 bg-slate-200 border-slate-500';
    }
  };

  // Traduire le statut en français
  export const translateStatus = (status: string) => {
    switch (status) {
      case 'confirmee':
        return 'Confirmée';
      case 'en_attente':
        return 'En attente';
      case 'annulee':
        return 'Annulée';
      case 'terminee':
        return 'Terminée';
      default:
        return status;
    }
  };

    // Convert file to base64
   export  const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (reader.result) {
            // The result includes the MIME type prefix (e.g., "data:image/jpeg;base64,")
            resolve(reader.result.toString());
          } else {
            reject(new Error("Failed to convert file to base64"));
          }
        };
        reader.onerror = error => reject(error);
      });
    };

    export const userHasRight = (right: string) => {
      console.log("🚀 ~ userHasRight ~ right:", right)
      const appState = store?.getState()?.app as AppState;
      const connectionInfo = appState?.connectionInfo;
      if (connectionInfo?.roleUtilisateurNom === "ADMIN") return true
      return connectionInfo?.roleUtilisateurNom === right ? true : false;
  };