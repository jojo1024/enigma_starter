import React, { useState } from 'react';
import { ConfigurationChambre, FormReservation, Residence, Service } from '../../utils/types';
import { Slideover, Tab } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { FormInput, FormLabel, FormSelect, FormTextarea } from '../../base-components/Form';
import Litepicker from '../../base-components/Litepicker';
import Button from '../../base-components/Button';

interface ReservationFormProps {
    isOpen: boolean;
    formData: FormReservation;
    formErrors: Record<string, string>;
    residences: Residence[];
    configurations: ConfigurationChambre[];
    services: Service[];
    detailMode: boolean;
    onClose: () => void;
    onSave: () => void;
    onFormChange?: (field: string, value: any) => void;
    onServiceChange?: (serviceId: number, quantity: number) => void;
  }
  
  const ReservationForm: React.FC<ReservationFormProps> = ({
    isOpen,
    formData,
    formErrors,
    residences,
    configurations,
    services,
    detailMode,
    onClose,
    onSave,
    onFormChange = () => {},
    onServiceChange = () => {},
  }) => {
    const [activeTab, setActiveTab] = useState(0);
  
    // Filtres selon la résidence sélectionnée
    const filteredConfigurations = configurations.filter(
      config => config.configResidenceId === formData.reservationResidenceId
    );
  
    // Calcul du montant total
    const calculateTotalAmount = (): number => {
      if (!formData.reservationConfigId || !formData.reservationDateDebut || !formData.reservationDateFin) {
        return 0;
      }
  
      const config = configurations.find(c => c.configId === formData.reservationConfigId);
      if (!config) return 0;
  
      const start = new Date(formData.reservationDateDebut);
      const end = new Date(formData.reservationDateFin);
      const nights = calculateDuration(formData.reservationDateDebut, formData.reservationDateFin);
      
      // Calcul du prix de l'hébergement
      let totalAmount = 0;
      for (let i = 0; i < nights; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        // Vérifie si c'est un weekend (vendredi, samedi)
        const isWeekend = currentDate.getDay() === 5 || currentDate.getDay() === 6;
        
        totalAmount += isWeekend ? config.configPrixWeekend : config.configPrixSemaine;
      }
      
      // Ajout des services
      formData.reservationServices.forEach(service => {
        const servicePrice = getServicePrice(service.serviceId);
        totalAmount += servicePrice * service.quantite;
      });
      
      return totalAmount;
    };
  
    // Fonctions utilitaires
    const calculateDuration = (dateDebut: string, dateFin: string): number => {
      const start = new Date(dateDebut);
      const end = new Date(dateFin);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
  
    const getServicePrice = (serviceId: number): number => {
      const service = services.find(s => s.serviceId === serviceId);
      return service ? service.servicePrix : 0;
    };
  
    const getServiceName = (serviceId: number): string => {
      const service = services.find(s => s.serviceId === serviceId);
      return service ? service.serviceNom : 'Service inconnu';
    };
  
    return (
      <Slideover
        size="lg"
        open={isOpen}
        onClose={onClose}
      >
        <Slideover.Panel>
          <button
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              onClose();
            }}
            className="absolute top-0 left-0 right-auto mt-4 -ml-12"
          >
            <Lucide icon="X" className="w-8 h-8 text-slate-400" />
          </button>
          <Slideover.Title className="p-5">
            <h2 className="mr-auto text-base font-medium">
              {detailMode ? 
                `Détails de la réservation #${formData.reservationId}` : 
                formData.reservationId ? 
                  `Modifier la réservation #${formData.reservationId}` : 
                  'Nouvelle réservation'
              }
            </h2>
          </Slideover.Title>
          <Slideover.Description className="px-5 py-3 overflow-y-auto max-h-[calc(100vh-200px)]">
            <Tab.Group>
              <Tab.List className="w-full border-b border-slate-200 dark:border-darkmode-400">
                <Tab>
                  <Tab.Button
                    // active={activeTab === 0}
                    onClick={() => setActiveTab(0)}
                    className="w-full py-2"
                  >
                    Réservation
                  </Tab.Button>
                </Tab>
                <Tab>
                  <Tab.Button
                    // active={activeTab === 1}
                    onClick={() => setActiveTab(1)}
                    className="w-full py-2"
                  >
                    Client
                  </Tab.Button>
                </Tab>
                <Tab>
                  <Tab.Button
                    // active={activeTab === 2}
                    onClick={() => setActiveTab(2)}
                    className="w-full py-2"
                  >
                    Services
                  </Tab.Button>
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-5">
                {/* Onglet Réservation */}
                <Tab.Panel>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-6">
                      <FormLabel htmlFor="reservation-residence">Résidence *</FormLabel>
                      <FormSelect
                        id="reservation-residence"
                        value={formData.reservationResidenceId}
                        onChange={(e) => onFormChange('reservationResidenceId', parseInt(e.target.value, 10))}
                        disabled={detailMode}
                        className={formErrors.residence ? 'border-danger' : ''}
                      >
                        {residences.map((residence) => (
                          <option key={residence.residenceId} value={residence.residenceId}>
                            {residence.residenceNom}
                          </option>
                        ))}
                      </FormSelect>
                      {formErrors.residence && (
                        <div className="mt-1 text-xs text-danger">{formErrors.residence}</div>
                      )}
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <FormLabel htmlFor="reservation-config">Configuration de chambre *</FormLabel>
                      <FormSelect
                        id="reservation-config"
                        value={formData.reservationConfigId || ''}
                        onChange={(e) => onFormChange('reservationConfigId', parseInt(e.target.value, 10))}
                        disabled={detailMode}
                        className={formErrors.configuration ? 'border-danger' : ''}
                      >
                        <option value="">Sélectionnez une configuration</option>
                        {filteredConfigurations.map((config) => (
                          <option key={config.configId} value={config.configId}>
                            {config.configNom} ({config.configTotalChambres} dispo.)
                          </option>
                        ))}
                      </FormSelect>
                      {formErrors.configuration && (
                        <div className="mt-1 text-xs text-danger">{formErrors.configuration}</div>
                      )}
                    </div>
  
                    <div className="col-span-12 lg:col-span-6">
                      <FormLabel htmlFor="reservation-date-debut">Date d'arrivée *</FormLabel>
                      <Litepicker
                        value={formData.reservationDateDebut}
                        onChange={(date) => onFormChange('reservationDateDebut', date)}
                        options={{
                          autoApply: true,
                          singleMode: true,
                          numberOfColumns: 1,
                          numberOfMonths: 1,
                          format: "YYYY-MM-DD",
                          dropdowns: {
                            minYear: 2023,
                            maxYear: 2026,
                            months: true,
                            years: true,
                          },
                          minDate: new Date().toISOString().split('T')[0],
                        }}
                        className={`block w-full border rounded-md ${formErrors.dateDebut ? 'border-danger' : ''}`}
                        disabled={detailMode}
                      />
                      {formErrors.dateDebut && (
                        <div className="mt-1 text-xs text-danger">{formErrors.dateDebut}</div>
                      )}
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <FormLabel htmlFor="reservation-date-fin">Date de départ *</FormLabel>
                      <Litepicker
                        value={formData.reservationDateFin}
                        onChange={(date) => onFormChange('reservationDateFin', date)}
                        options={{
                          autoApply: true,
                          singleMode: true,
                          numberOfColumns: 1,
                          numberOfMonths: 1,
                          format: "YYYY-MM-DD",
                          dropdowns: {
                            minYear: 2023,
                            maxYear: 2026,
                            months: true,
                            years: true,
                          },
                          minDate: formData.reservationDateDebut || new Date().toISOString().split('T')[0],
                        }}
                        className={`block w-full border rounded-md ${formErrors.dateFin ? 'border-danger' : ''}`}
                        disabled={detailMode}
                      />
                      {formErrors.dateFin && (
                        <div className="mt-1 text-xs text-danger">{formErrors.dateFin}</div>
                      )}
                      {formErrors.dateRange && (
                        <div className="mt-1 text-xs text-danger">{formErrors.dateRange}</div>
                      )}
                    </div>
  
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="reservation-adultes">Nombre d'adultes *</FormLabel>
                      <FormInput
                        id="reservation-adultes"
                        type="number"
                        min={1}
                        value={formData.reservationNbAdultes}
                        onChange={(e) => onFormChange('reservationNbAdultes', parseInt(e.target.value, 10))}
                        disabled={detailMode}
                        className={formErrors.nbAdultes || formErrors.capaciteAdultes ? 'border-danger' : ''}
                      />
                      {formErrors.nbAdultes && (
                        <div className="mt-1 text-xs text-danger">{formErrors.nbAdultes}</div>
                      )}
                      {formErrors.capaciteAdultes && (
                        <div className="mt-1 text-xs text-danger">{formErrors.capaciteAdultes}</div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="reservation-enfants">Nombre d'enfants</FormLabel>
                      <FormInput
                        id="reservation-enfants"
                        type="number"
                        min={0}
                        value={formData.reservationNbEnfants}
                        onChange={(e) => onFormChange('reservationNbEnfants', parseInt(e.target.value, 10))}
                        disabled={detailMode}
                        className={formErrors.nbEnfants || formErrors.capaciteEnfants ? 'border-danger' : ''}
                      />
                      {formErrors.nbEnfants && (
                        <div className="mt-1 text-xs text-danger">{formErrors.nbEnfants}</div>
                      )}
                      {formErrors.capaciteEnfants && (
                        <div className="mt-1 text-xs text-danger">{formErrors.capaciteEnfants}</div>
                      )}
                    </div>
  
                    <div className="col-span-12">
                      <FormLabel htmlFor="reservation-commentaire">Commentaires</FormLabel>
                      <FormTextarea
                        id="reservation-commentaire"
                        value={formData.reservationCommentaire || ''}
                        onChange={(e) => onFormChange('reservationCommentaire', e.target.value)}
                        disabled={detailMode}
                        rows={3}
                        placeholder="Notes spéciales, demandes particulières..."
                      />
                    </div>
                  </div>
                </Tab.Panel>
  
                {/* Onglet Client */}
                <Tab.Panel>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="client-nom">Nom *</FormLabel>
                      <FormInput
                        id="client-nom"
                        type="text"
                        placeholder="Nom de famille"
                        value={formData.client.clientNom}
                        onChange={(e) => onFormChange('client.clientNom', e.target.value)}
                        disabled={detailMode}
                        className={formErrors.clientNom ? 'border-danger' : ''}
                      />
                      {formErrors.clientNom && (
                        <div className="mt-1 text-xs text-danger">{formErrors.clientNom}</div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="client-prenom">Prénom *</FormLabel>
                      <FormInput
                        id="client-prenom"
                        type="text"
                        placeholder="Prénom"
                        value={formData.client.clientPrenom}
                        onChange={(e) => onFormChange('client.clientPrenom', e.target.value)}
                        disabled={detailMode}
                        className={formErrors.clientPrenom ? 'border-danger' : ''}
                      />
                      {formErrors.clientPrenom && (
                        <div className="mt-1 text-xs text-danger">{formErrors.clientPrenom}</div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="client-email">Email *</FormLabel>
                      <FormInput
                        id="client-email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={formData.client.clientEmail}
                        onChange={(e) => onFormChange('client.clientEmail', e.target.value)}
                        disabled={detailMode}
                        className={formErrors.clientEmail ? 'border-danger' : ''}
                      />
                      {formErrors.clientEmail && (
                        <div className="mt-1 text-xs text-danger">{formErrors.clientEmail}</div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="client-telephone">Téléphone *</FormLabel>
                      <FormInput
                        id="client-telephone"
                        type="text"
                        placeholder="+225 XX XX XX XX"
                        value={formData.client.clientTelephone}
                        onChange={(e) => onFormChange('client.clientTelephone', e.target.value)}
                        disabled={detailMode}
                        className={formErrors.clientTelephone ? 'border-danger' : ''}
                      />
                      {formErrors.clientTelephone && (
                        <div className="mt-1 text-xs text-danger">{formErrors.clientTelephone}</div>
                      )}
                    </div>
                    <div className="col-span-12">
                      <FormLabel htmlFor="client-adresse">Adresse</FormLabel>
                      <FormTextarea
                        id="client-adresse"
                        placeholder="Adresse complète"
                        value={formData.client.clientAdresse || ''}
                        onChange={(e) => onFormChange('client.clientAdresse', e.target.value)}
                        disabled={detailMode}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="client-pays">Pays</FormLabel>
                      <FormInput
                        id="client-pays"
                        type="text"
                        placeholder="Pays d'origine"
                        value={formData.client.clientPays}
                        onChange={(e) => onFormChange('client.clientPays', e.target.value)}
                        disabled={detailMode}
                      />
                    </div>
                  </div>
                </Tab.Panel>
  
                {/* Onglet Services */}
                <Tab.Panel>
                  <div className="mb-5">
                    <h3 className="text-base font-medium mb-3">Services additionnels</h3>
                    {services.map((service) => (
                      <div key={service.serviceId} className="flex items-center justify-between p-3 border rounded-md mb-2">
                        <div>
                          <div className="font-medium">{service.serviceNom}</div>
                          <div className="text-slate-500 text-xs">{service.serviceDescription}</div>
                          <div className="text-primary font-semibold mt-1">{service.servicePrix.toLocaleString()} F CFA</div>
                        </div>
                        {detailMode ? (
                          <div className="font-medium">
                            {formData.reservationServices.find(s => s.serviceId === service.serviceId)?.quantite || 0} unité(s)
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => {
                                const currentService = formData.reservationServices.find(s => s.serviceId === service.serviceId);
                                const currentQty = currentService ? currentService.quantite : 0;
                                if (currentQty > 0) {
                                  onServiceChange(service.serviceId, currentQty - 1);
                                }
                              }}
                            >
                              <Lucide icon="Minus" className="w-4 h-4" />
                            </Button>
                            <span className="mx-2 min-w-[30px] text-center">
                              {formData.reservationServices.find(s => s.serviceId === service.serviceId)?.quantite || 0}
                            </span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => {
                                const currentService = formData.reservationServices.find(s => s.serviceId === service.serviceId);
                                const currentQty = currentService ? currentService.quantite : 0;
                                onServiceChange(service.serviceId, currentQty + 1);
                              }}
                            >
                              <Lucide icon="Plus" className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
  
            {/* Résumé du prix */}
            {(formData.reservationConfigId && formData.reservationDateDebut && formData.reservationDateFin) && (
              <div className="mt-5 p-4 bg-slate-100 rounded-md">
                <h3 className="text-base font-medium mb-2">Résumé de la réservation</h3>
                
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-8">
                    <p className="text-sm">Durée du séjour:</p>
                  </div>
                  <div className="col-span-4 text-right">
                    <p className="text-sm font-medium">
                      {calculateDuration(formData.reservationDateDebut, formData.reservationDateFin)} nuit(s)
                    </p>
                  </div>
                </div>
                
                {/* Services additionnels */}
                {formData.reservationServices.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Services additionnels:</p>
                    {formData.reservationServices.map((service) => (
                      <div className="grid grid-cols-12 gap-2" key={service.serviceId}>
                        <div className="col-span-8">
                          <p className="text-xs text-slate-600">
                            {getServiceName(service.serviceId)} x{service.quantite}
                          </p>
                        </div>
                        <div className="col-span-4 text-right">
                          <p className="text-xs text-slate-600">
                            {(getServicePrice(service.serviceId) * service.quantite).toLocaleString()} F CFA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Total */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-8">
                      <p className="text-base font-bold">Total:</p>
                    </div>
                    <div className="col-span-4 text-right">
                      <p className="text-base font-bold text-primary">
                        {calculateTotalAmount().toLocaleString()} F CFA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Slideover.Description>
          <Slideover.Footer className="absolute bottom-0 px-5 py-3 bg-white border-t w-full">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={onClose}
                className="w-24"
              >
                {detailMode ? 'Fermer' : 'Annuler'}
              </Button>
              {!detailMode && (
                <Button
                  variant="primary"
                  type="button"
                  className="w-24"
                  onClick={onSave}
                >
                  Enregistrer
                </Button>
              )}
            </div>
          </Slideover.Footer>
        </Slideover.Panel>
      </Slideover>
    );
  };
  
  export default ReservationForm;