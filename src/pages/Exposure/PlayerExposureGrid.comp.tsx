import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridColumnGroupingModel, GridToolbar } from '@mui/x-data-grid';
import { PlayerBadge } from '../../components/badges/PlayerBadge.comp';
import { TeamBadge } from '../../components/badges/TeamBadge.comp';
import Tooltip from '@mui/material/Tooltip';

export default function PlayerExposureGrid({ handleViewPlayer, rows, showResurrectionColumns }) {

     // TODO: What's the best way to store these column definitions
     const columns: GridColDef[] = [
        {
            field: 'team',
            headerName: 'Team',
            minWidth: 125,
            type: 'string',
            align: 'center',
            headerAlign: 'center',
            renderCell(params) {
                return (<TeamBadge inGrid={true} team={params.row.team} />)
            }
        },
        {
            field: 'name',
            headerName: 'Player',
            minWidth: 150,
            type: 'string'
        },
        {
            field: 'posRank',
            headerName: 'Position Rank',
            minWidth: 125,
            type: 'string',
            sortable: false,
            renderCell(params) {
                return (<PlayerBadge pos={params.row.pos} posRank={params.row.posRank} />);
            },
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fees',
            headerName: 'Entry Fees',
            minWidth: 75,
            type: 'number',
            valueFormatter: ({ value }) => `$${value}`,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'avgPick',
            headerName: 'Avg Pick',
            minWidth: 50,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            description: 'Average Pick Number',
        },
        {
            field: 'adp',
            headerName: 'ADP',
            minWidth: 50,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            description: 'Average Draft Position on 9/07/2023',
        },
        {
            field: 'clv',
            headerName: 'CLV',
            minWidth: 50,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            description: 'Closing Line Value: Avg Pick - ADP',
        },
        {
            field: 'percentDrafted',
            headerName: 'Exposure',
            minWidth: 75,
            type: 'number',
            valueFormatter: ({ value }) => `${value}%`,
            align: 'center',
            headerAlign: 'center'
        },  
    ];

    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: 'resurrectionData',
            headerName: 'Resurrection Data',
            headerAlign: 'center',
            description: '',
            children: [
                { field: 'resurrectionPosRank' },
                { field: 'resurrectionAdp' },
                { field: 'resurrectionClv' }
            ],
        },  
    ];

    if (showResurrectionColumns) {
        columns.push(
            {
                field: 'resurrectionPosRank',
                headerName: 'Position Rank',
                minWidth: 125,
                type: 'string',
                align: 'center',
                headerAlign: 'center',
                renderCell(params) {
                    return (<PlayerBadge pos={params.row.pos} posRank={params.row.resurrectionPosRank} />)
                },
                description: 'Resurrection Position Rank',
            },
            {
                field: 'resurrectionAdp',
                headerName: 'ADP',
                minWidth: 50,
                type: 'number',
                align: 'center',
                headerAlign: 'center',
                description: 'Resurrection Average Draft Position on 10/12/2023',
            },
            {
                field: 'resurrectionClv',
                headerName: 'CLV',
                minWidth: 50,
                type: 'number',
                align: 'center',
                headerAlign: 'center',
                description: 'Closing Line Value: Avg Pick - Resurrection ADP',
            }
        );
    } else {
        columns.push({
            field: 'id', headerName: '', minWidth: 100, align: 'center', sortable: false, filterable: false, hideable: false, disableColumnMenu: true,
            renderCell({row}) {
                return (
                    <Tooltip arrow placement='top' title={row.timesDrafted < 2 ? 'Available for players drafted two or more times' : ''}>
                        <span>
                            <Button
                            disabled={row.timesDrafted < 2}
                            onClick={() => handleViewPlayer(row.id)}
                            variant="contained"
                            color="primary">
                                View
                            </Button>
                        </span>
                    </Tooltip>
                );
            }
        })
    }

    return (
        <DataGrid
            experimentalFeatures={{ columnGrouping: true }}
            rows={rows}
            columns={columns}
            columnGroupingModel={columnGroupingModel}
            slots={{ toolbar: GridToolbar }}
            rowSelection={false}
            slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
        />
    );
}