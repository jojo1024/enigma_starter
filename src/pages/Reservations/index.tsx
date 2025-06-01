// ReservationsPage.tsx - Composant principal amélioré
import React, { useState, useRef, useEffect } from 'react';
import Lucide from '../../base-components/Lucide';
import { useReservations } from './hooks/useReservations';
import ReservationCard from './components/ReservationCard';
import CancelReservationModal from './components/CancelReservationModal';
import ReservationPagination from './components/ReservationPagination';
import ReservationFilters from './components/ReservationFilters';
import { Dialog, Tab } from '../../base-components/Headless';
import { formatCurrency, formatDate } from '../../utils/functions';
import { IReservation } from '../../services/reservation.service';
import CustomDataTable, { TableColumn } from '../../components/CustomDataTable';
import { NotificationElement } from '../../base-components/Notification';
import { CustomNotification, INotification } from '../../components/Notification';
import { Pagination } from '../../components/Pagination';

const Reservations: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservationForDetails, setSelectedReservationForDetails] = useState<IReservation | null>(null);
  const [loadingReservationId, setLoadingReservationId] = useState<number | null>(null);
  const notificationRef = useRef<NotificationElement>();
  const [notification, setNotification] = useState<INotification | undefined>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialisation des états pour les filtres avec des valeurs par défaut qui n'affectent pas le filtrage
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [nightsRange, setNightsRange] = useState({ min: 0, max: 0 });
  const [guestsRange, setGuestsRange] = useState({ min: 0, max: 0 });

  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    residenceFilter,
    setResidenceFilter,
    currentPage,
    setCurrentPage,
    selectedReservation,
    showCancelModal,
    setShowCancelModal,
    paginatedReservations,
    totalPages,
    canCancelReservation,
    handleConfirmReservation,
    handleCancelReservation,
    openCancelModal,
    residences,
    tabsData,
    pageIndex,
    setPageIndex,
    pageCount,
    itemsPerPage,
    filteredReservations,
    endIndex,
    startIndex,
    getEtatReservationLabel,
    getEtatReservationClass
  } = useReservations({
    dateRange,
    priceRange,
    nightsRange,
    guestsRange,
  });
  console.log("🚀 ~kkkkkk filteredReservations:", filteredReservations.length)

  const showNotification = () => notificationRef.current?.showToast();

  const displayNotification = (notification: INotification) => {
    setNotification(notification);
    setTimeout(() => {
      showNotification();
    }, 30);
  };

  // Calcul des statistiques
  const stats = {
    totalReservations: paginatedReservations.length,
    totalRevenue: paginatedReservations.reduce((sum, res) => sum + parseFloat(res.reservationPrixTotal), 0),
    occupancyRate: Math.round((paginatedReservations.filter(r => r.reservationStatut === 'confirmee').length / paginatedReservations.length) * 100) || 0,
    averageStay: Math.round(paginatedReservations.reduce((sum, res) => sum + res.reservationNuit, 0) / paginatedReservations.length) || 0,
    confirmedReservations: paginatedReservations.filter(r => r.reservationStatut === 'confirmee').length,
    pendingReservations: paginatedReservations.filter(r => r.reservationStatut === 'en_attente').length,
    cancelledReservations: paginatedReservations.filter(r => r.reservationStatut === 'annulee').length,
  };

  const handleExport = () => {
    // Créer un fichier CSV avec les données des réservations
    const headers = ['ID', 'Client', 'Email', 'Téléphone', 'Résidence', 'Statut', 'Date arrivée', 'Date départ', 'Nuits', 'Prix total'];
    const csvData = paginatedReservations.map(res => [
      res.reservationId,
      res.clientNom,
      res.clientEmail,
      res.clientTelephone,
      res.residenceNom,
      res.reservationStatut,
      formatDate(new Date(res.reservationDateArrivee)),
      formatDate(new Date(res.reservationDateDepart)),
      res.reservationNuit,
      res.reservationPrixTotal
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservations_${formatDate(new Date())}.csv`;
    link.click();
  };

  const handleViewDetails = (reservation: IReservation) => {
    setSelectedReservationForDetails(reservation);
    setShowDetailsModal(true);
  };

  const handleConfirm = async (reservation: IReservation) => {
    setSelectedReservationForDetails(reservation);
    setShowConfirmModal(true);
  };

  const handleConfirmReservationSubmit = async () => {
    if (!selectedReservationForDetails) return;

    setLoadingReservationId(selectedReservationForDetails.reservationId);
    try {
      await handleConfirmReservation(selectedReservationForDetails);
      displayNotification({
        type: "success",
        content: "La réservation a été confirmée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      displayNotification({
        type: "error",
        content: "Une erreur est survenue lors de la confirmation"
      });
    } finally {
      setLoadingReservationId(null);
      setShowConfirmModal(false);
      setSelectedReservationForDetails(null);
    }
  };

  const handleCancel = async (reservation: IReservation) => {
    setLoadingReservationId(reservation.reservationId);
    try {
      await openCancelModal(reservation);
      // Si on arrive ici, c'est que l'ouverture de la modal a réussi
      // La notification de succès sera gérée dans handleCancelReservation
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      displayNotification({
        type: "error",
        content: "Une erreur est survenue lors de l'ouverture de la modal d'annulation"
      });
    } finally {
      setLoadingReservationId(null);
    }
  };

  // Ajout d'un useEffect pour gérer les notifications d'annulation
  // useEffect(() => {
  //   if (showCancelModal === false && selectedReservation === null) {
  //     // La modal a été fermée après une annulation réussie
  //     displayNotification({
  //       type: "success",
  //       content: "La réservation a été annulée avec succès"
  //     });
  //   }
  // }, [showCancelModal, selectedReservation]);

  const columns: TableColumn<IReservation>[] = [
    { header: 'Client', accessor: 'clientNom', visible: true },
    { header: 'Résidence', accessor: 'residenceNom', visible: true },
    {
      header: 'Date d\'arrivée',
      accessor: 'reservationDateArrivee',
      renderCell: (value: string) => new Date(value).toLocaleDateString(),
      width: '150px',
      tableTextPosition: 'text-center'
    },
    {
      header: 'Date de départ',
      accessor: 'reservationDateDepart',
      renderCell: (value: string) => new Date(value).toLocaleDateString(),
      width: '150px',
      tableTextPosition: 'text-center'
    },
    {
      header: 'Statut',
      accessor: 'reservationStatut',
      renderCell: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getEtatReservationClass(value)}`}>
          {getEtatReservationLabel(value)}
        </span>
      ),
      width: '120px',
      tableTextPosition: 'text-center'
    },
    {
      header: 'Prix total',
      accessor: 'reservationPrixTotal',
      visible: true,
      renderCell: (value: any) => formatCurrency(parseFloat(value))
    },
    {
      header: 'Actions',
      visible: true,
      renderCell: (value: any, row: IReservation) => (
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => handleConfirm(row)}
            className="text-primary transition-colors"
            disabled={!canCancelReservation(row) || loadingReservationId === row.reservationId}
          >
            {loadingReservationId === row.reservationId ? (
              <div className="w-4 h-4 border-2 border-t-primary rounded-full animate-spin"></div>
            ) : (
              <Lucide icon="CheckSquare" className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleCancel(row)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            disabled={!canCancelReservation(row) || loadingReservationId === row.reservationId}
          >
            {loadingReservationId === row.reservationId ? (
              <div className="w-4 h-4 border-2 border-t-red-600 rounded-full animate-spin"></div>
            ) : (
              <Lucide icon="X" className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleViewDetails(row)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <Lucide icon="Eye" className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Statistiques */}
      {/* <ReservationStats {...stats} /> */}

      {/* Filtres */}
      <ReservationFilters
        residences={residences}
        residenceFilter={residenceFilter}
        setResidenceFilter={setResidenceFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tabsData={tabsData}
        dateRange={dateRange}
        setDateRange={setDateRange}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        nightsRange={nightsRange}
        setNightsRange={setNightsRange}
        guestsRange={guestsRange}
        setGuestsRange={setGuestsRange}
        onExport={handleExport}
      />

      {/* Contrôles et pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="flex items-center gap-4">

          {viewMode === 'card' && (
            <div className="flex items-center gap-2">
              <div>Total: {filteredReservations.length}</div>
              {setPageIndex && pageCount > 1 && (
                <div className='flex mr-2 justify-end items-center mt-3'>
                  <Pagination
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageCount={pageCount}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toggle de vue */}
        <Tab.Group>
          <div className="pr-1 intro-y">
            <div className="p-1 box">
              <Tab.List variant="pills">
                <Tab>
                  <Tab.Button
                    className={`w-full flex py-2 text-xs sm:text-sm truncate ${viewMode === 'card' ? 'bg-primary text-white' : ''}`}
                    as="button"
                    onClick={() => setViewMode('card')}
                  >
                    <Lucide icon="LayoutGrid" className="w-4 h-4 mr-1" />
                    Carte
                  </Tab.Button>
                </Tab>
                <Tab>
                  <Tab.Button
                    className={`w-full flex py-2 text-xs sm:text-sm truncate ${viewMode === 'table' ? 'bg-primary text-white' : ''}`}
                    as="button"
                    onClick={() => setViewMode('table')}
                  >
                    <Lucide icon="List" className="w-4 h-4 mr-1" />
                    Liste
                  </Tab.Button>
                </Tab>
              </Tab.List>
            </div>
          </div>
        </Tab.Group>
      </div>

      {/* Liste des réservations */}
      <div className="mt-5 intro-y">
        {isLoading ? (
          <div className="col-span-12 py-8 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="mt-2 text-lg font-medium">Chargement des réservations...</h3>
            <p className="mt-1 text-slate-500">Veuillez patienter pendant que nous récupérons les données</p>
          </div>
        ) : paginatedReservations.length === 0 ? (
          <div className="col-span-12 py-8 text-center">
            <Lucide icon="Search" className="w-16 h-16 mx-auto text-slate-300" />
            <h3 className="mt-2 text-lg font-medium">Aucune réservation trouvée</h3>
            <p className="mt-1 text-slate-500">
              {residenceFilter !== "all"
                ? `Aucune réservation trouvée pour ${residences.find(r => r.residenceId.toString() === residenceFilter)?.residenceNom || "Résidence inconnue"}`
                : "Essayez d'ajuster vos critères de recherche"}
            </p>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-12 gap-6">
            {filteredReservations.slice(startIndex, endIndex).map((reservation) => (
              <div key={reservation.reservationId} className="col-span-12 sm:col-span-6 lg:col-span-4 2xl:col-span-3">
                <div className="h-full flex flex-col">
                  <ReservationCard
                    reservation={reservation}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onPrint={() => { }}
                    isLoading={loadingReservationId === reservation.reservationId}
                    canCancelReservation={canCancelReservation}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`w-full overflow-x-auto hide-scrollbar mt-4 intro-x box`}>
            <CustomDataTable
              data={filteredReservations}
              columns={columns}
              rowKey={(row) => String(row.reservationId)}
              selectedRows={[]}
              onSelectRow={() => null}
              onSelectAllRows={() => null}
              onRowDoubleClick={handleViewDetails}
              onDeleteSelectRows={() => null}
              endIndex={endIndex}
              startIndex={startIndex}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              pageCount={pageCount}
              loading={isLoading}
              noDataMessage="Aucune réservation trouvée"
              search={searchTerm}
              setSearch={setSearchTerm}
              showSearchBar={true}
            />
          </div>
        )}
      </div>

      {/* Modal de confirmation */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        className="relative z-50"
      >
        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Confirmer la réservation</h3>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="text-slate-400 hover:text-slate-500"
                  >
                    <Lucide icon="X" className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-slate-600">
                    Êtes-vous sûr de vouloir confirmer cette réservation ?
                  </p>
                  {selectedReservationForDetails && (
                    <div className="mt-4 space-y-2">
                      <p><span className="font-medium">Client:</span> {selectedReservationForDetails.clientNom}</p>
                      <p><span className="font-medium">Résidence:</span> {selectedReservationForDetails.residenceNom}</p>
                      <p><span className="font-medium">Dates:</span> {formatDate(new Date(selectedReservationForDetails.reservationDateArrivee))} - {formatDate(new Date(selectedReservationForDetails.reservationDateDepart))}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmReservationSubmit}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-t-white rounded-full animate-spin mr-2"></div>
                        Confirmation...
                      </div>
                    ) : (
                      'Confirmer'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Modal de détails */}
      <Dialog
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        className="relative z-50"
      >
        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
              {selectedReservationForDetails && (
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Détails de la réservation</h3>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-slate-400 hover:text-slate-500"
                    >
                      <Lucide icon="X" className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Informations client</h4>
                      <div className="space-y-2">
                        <p><span className="text-slate-500">Nom:</span> {selectedReservationForDetails.clientNom}</p>
                        <p><span className="text-slate-500">Email:</span> {selectedReservationForDetails.clientEmail}</p>
                        <p><span className="text-slate-500">Téléphone:</span> {selectedReservationForDetails.clientTelephone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Informations réservation</h4>
                      <div className="space-y-2">
                        <p><span className="text-slate-500">Résidence:</span> {selectedReservationForDetails.residenceNom}</p>
                        <p><span className="text-slate-500">Statut:</span> {selectedReservationForDetails.reservationStatut}</p>
                        <p><span className="text-slate-500">Date de création:</span> {formatDate(new Date(selectedReservationForDetails.reservationDateCreation))}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Dates</h4>
                      <div className="space-y-2">
                        <p><span className="text-slate-500">Arrivée:</span> {formatDate(new Date(selectedReservationForDetails.reservationDateArrivee))}</p>
                        <p><span className="text-slate-500">Départ:</span> {formatDate(new Date(selectedReservationForDetails.reservationDateDepart))}</p>
                        <p><span className="text-slate-500">Nuits:</span> {selectedReservationForDetails.reservationNuit}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Invités</h4>
                      <div className="space-y-2">
                        <p><span className="text-slate-500">Adultes:</span> {selectedReservationForDetails.reservationAdultes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Chambres sélectionnées</h4>
                    <div className="space-y-2">
                      {selectedReservationForDetails.chambres.map((chambre, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{chambre.chambreNom} x{chambre.nombreChambres}</span>
                          <span>{formatCurrency(parseFloat(chambre.rcPrixTotal))}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(parseFloat(selectedReservationForDetails.reservationPrixTotal))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Notification */}
      <CustomNotification
        message={notification?.content}
        notificationRef={notificationRef}
        title="Info"
        type={notification?.type}
      />

      {/* Modal d'annulation */}
      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelReservation}
        reservation={selectedReservation}
        isLoading={isLoading}
      />
    </>
  );
};

export default Reservations;