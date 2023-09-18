import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PlayerBadge } from '../badges/PlayerBadge.comp';
import { TeamBadge } from '../badges/TeamBadge.comp';

export default function PlayerExposureGrid({ handleViewPlayer, rows }) {

     // TODO: What's the best way to store these column definitions
     const columns: GridColDef[] = [
        { field: 'team', headerName: 'Team', minWidth: 125, type: 'string', align: 'center', headerAlign: 'center', renderCell(params) {
            return (<TeamBadge inGrid={true} team={params.row.team} />)
        }},
        { field: 'name', headerName: 'Player', minWidth: 150, type: 'string', },
        { field: 'pos', headerName: 'Position Rank', minWidth: 125, type: 'string', sortable: false, renderCell(params) {
            return (<PlayerBadge pos={params.row.pos} posRank={params.row.posRank} />);
        }, align: 'center', headerAlign: 'center' },
        { field: 'fees', headerName: 'Entry Fees', minWidth: 75, type: 'number', valueFormatter: ({ value }) => `$${value}`, align: 'center', headerAlign: 'center' },
        { field: 'avgPick', headerName: 'Avg Pick', minWidth: 50, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'adp', headerName: 'ADP', minWidth: 50, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'clv', headerName: 'CLV', minWidth: 50, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'percentDrafted', headerName: 'Exposure', minWidth: 75, type: 'number', valueFormatter: ({ value }) => `${value}%`, align: 'center', headerAlign: 'center' },
        { field: 'id', headerName: '', minWidth: 100, align: 'center', sortable: false, filterable: false, hideable: false, disableColumnMenu: true,
                renderCell({row}) {
                    return (<Button
                                disabled={row.timesDrafted < 2}
                                onClick={() => handleViewPlayer(row.id)}
                                variant="contained"
                                color="primary">
                                    View
                            </Button>
                    );
                }
            },
    ];

    return (
        <DataGrid rows={rows} columns={columns} />
    );
}