import React, { useState } from 'react'
import Lucide from '../../base-components/Lucide';
import CustomDataTable from '../../components/CustomDataTable';

const listeClients = [
    {
        idClient: 1,
        nomClient: 'Jean Kouassi',
        emailClient: 'jean.kouassi@example.com',
        telephoneClient: '+2250700112233',
    },
    {
        idClient: 2,
        nomClient: 'Aminata Diabaté',
        emailClient: 'aminata.diabate@example.com',
        telephoneClient: '+2250500998877',
    },
    {
        idClient: 3,
        nomClient: 'Serge N\'Guessan',
        emailClient: 'serge.ng@example.com',
        telephoneClient: '+2250100223344',
    },
    {
        idClient: 4,
        nomClient: 'Fatou Traoré',
        emailClient: 'fatou.t@example.com',
        telephoneClient: '+2250700667788',
    },
    {
        idClient: 5,
        nomClient: 'Eric Yao',
        emailClient: 'eric.yao@example.com',
        telephoneClient: '+2250700554433',
    }
];

const Clients = () => {

    const [loading, setLoading] = useState(false)

    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 10;
    const pageCount = Math.ceil(listeClients.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, listeClients.length);
    const paginatedChambres = listeClients.slice(startIndex, endIndex);

    const columns: any = [
        { header: 'Nom', accessor: 'nomClient', visible: true, className: '' },
        { header: 'Email', accessor: 'emailClient', visible: true, className: 'hidden md:table-cell' },
        { header: 'Téléphone', accessor: 'telephoneClient', visible: true, className: 'hidden lg:table-cell' },
        {
            header: "Actions",
            renderCell: (value: any, row: any) => (
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={() => null}
                        className="text-primary transition-colors"
                    >
                        <Lucide icon="Edit" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => null}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                        <Lucide icon="Trash" className="w-5 h-4" />
                    </button>
                </div>
            ),
            visible: true,
            className: ''
        }
    ];

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Clients</h2>
            </div>
            {/* BEGIN: Page Layout */}
            <div className={`w-full overflow-x-auto hide-scrollbar mt-4 intro-x box`}>
                {loading ? (
                    <div className="p-10 text-center">
                        <div className="w-10 h-10 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
                        <div className="mt-2">Chargement des données...</div>
                    </div>
                ) : (
                    <CustomDataTable
                        data={paginatedChambres}
                        columns={columns}
                        dataInitial={[]}
                        rowKey={(row) => String(row.idClient)}
                        selectedRows={[]}
                        onSelectRow={() => null}
                        onSelectAllRows={() => null}
                        onRowDoubleClick={(row) => null}
                        onDeleteSelectRows={() => null}
                        endIndex={endIndex}
                        startIndex={startIndex}
                        pageIndex={pageIndex}
                        setPageIndex={setPageIndex}
                        pageCount={pageCount}
                    />
                )}
            </div>
            {/* END: Page Layout */}
        </>)
}

export default Clients