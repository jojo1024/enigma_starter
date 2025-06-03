// ReservationsPage.tsx - Composant principal amélioré
import React, { useRef, useState } from 'react';
import Lucide from '../../base-components/Lucide';
import { useReservations } from './hooks/useReservations';
import { useReservationActions } from './hooks/useReservationActions';
import ReservationCard from './components/ReservationCard';
import CancelReservationModal from './components/CancelReservationModal';
import ConfirmReservationModal from './components/ConfirmReservationModal';
import ReservationDetailsModal from './components/ReservationDetailsModal';
import ReservationFilters from './components/ReservationFilters';
import { Tab } from '../../base-components/Headless';
import { formatCurrency } from '../../utils/functions';
import { IReservation } from '../../services/reservation.service';
import CustomDataTable, { TableColumn } from '../../components/CustomDataTable';
import { NotificationElement } from '../../base-components/Notification';
import { CustomNotification, INotification } from '../../components/Notification';
import { Pagination } from '../../components/Pagination';

const Reservations: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const notificationRef = useRef<NotificationElement>();
  const [notification, setNotification] = useState<INotification | undefined>();

  // Initialisation des états pour les filtres
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
    selectedReservationForCancel,
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

  const showNotification = () => notificationRef.current?.showToast();

  const displayNotification = (notification: INotification) => {
    setNotification(notification);
    setTimeout(() => {
      showNotification();
    }, 30);
  };

  const {
    loadingReservationId,
    showConfirmModal,
    showDetailsModal,
    selectedReservation,
    setShowConfirmModal,
    setShowDetailsModal,
    handleConfirm,
    handleConfirmSubmit,
    handleCancel,
    handleViewDetails
  } = useReservationActions({
    onConfirmReservation: handleConfirmReservation,
    onCancelReservation: async (reservation) => {
      await openCancelModal(reservation);
    },
    onShowNotification: displayNotification
  });

  const handleExport = () => {
    const headers = ['ID', 'Client', 'Email', 'Téléphone', 'Résidence', 'Statut', 'Date arrivée', 'Date départ', 'Nuits', 'Prix total'];
    const csvData = paginatedReservations.map(res => [
      res.reservationId,
      res.clientNom,
      res.clientEmail,
      res.clientTelephone,
      res.residenceNom,
      res.reservationStatut,
      new Date(res.reservationDateArrivee).toLocaleDateString(),
      new Date(res.reservationDateDepart).toLocaleDateString(),
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
    link.download = `reservations_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

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

      <ConfirmReservationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        reservation={selectedReservation}
        isLoading={isLoading}
      />

      <ReservationDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        reservation={selectedReservation}
      />

      <CustomNotification
        message={notification?.content}
        notificationRef={notificationRef}
        title="Info"
        type={notification?.type}
      />

      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelReservation}
        reservation={selectedReservationForCancel}
        isLoading={isLoading}
      />
    </>
  );
};

export default Reservations;