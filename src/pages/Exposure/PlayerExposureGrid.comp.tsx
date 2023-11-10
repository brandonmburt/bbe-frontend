import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridColumnGroupingModel, GridToolbar } from '@mui/x-data-grid';
import { PlayerBadge } from '../../components/badges/PlayerBadge.comp';
import { TeamBadge } from '../../components/badges/TeamBadge.comp';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../../components/ToolTip.comp';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import { ExposureType } from '../../models/exposure.model';
import { ExperienceAvatar } from '../../components/badges/ExperienceAvatar.comp';

export default function PlayerExposureGrid({ handleViewPlayer, rows, showResurrectionColumns, exposureType }) {

    const renderError = () => {
        return (
            <ToolTip title={TOOLTIPS.GRID_ERROR} content={
                <span style={{ color: 'red' }}>ERROR</span>
            }/>
        )
    }

    const exposureInfo: ExposureType = EXPOSURE_TYPES.find(x => x.id === exposureType);
    const cutoffDate: string = exposureInfo.cutoffDate;
    const resurrectionCutoffDate: string = EXPOSURE_TYPES.find(x => x.id === '2023resurrection').cutoffDate;

    // TODO: What's the best way to store these column definitions
    const columns: GridColDef[] = [
        {
            field: 'team',
            headerName: 'Team',
            minWidth: 75,
            type: 'string',
            align: 'center',
            headerAlign: 'center',
            hideSortIcons: true,
            renderCell(params) {
                return (<TeamBadge inGrid={true} team={params.row.team} />)
            }
        },
        {
            field: 'name',
            headerName: 'Player',
            minWidth: 175,
            type: 'string',
            hideSortIcons: true,
            renderCell(params) {
                return (<>
                    {params.row.name}
                    {params.row?.experience && <ExperienceAvatar experience={params.row.experience} /> }
                </>)
            }
        },
        {
            field: 'posRank',
            headerName: 'Pos Rank',
            minWidth: 120,
            type: 'string',
            sortable: false,
            renderCell(params) {
                return params.row.adp === -1 ? renderError() : (
                    <PlayerBadge pos={params.row.pos} posRank={params.row.posRank} />
                );
            },
            align: 'center',
            headerAlign: 'center',
            description: 'ADP Positional Rank on ' + cutoffDate,
        },
        {
            field: 'fees',
            headerName: 'Fees',
            minWidth: 100,
            type: 'number',
            valueFormatter: ({ value }) => `$${value}`,
            align: 'center',
            headerAlign: 'center',
            hideSortIcons: true,
        },
        {
            field: 'avgPick',
            headerName: 'Avg Pick',
            minWidth: 75,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            description: 'Average Pick Number',
            hideSortIcons: true,
        },
        {
            field: 'adp',
            headerName: 'ADP',
            minWidth: 75,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            renderCell(params) { return params.row.adp !== -1 ? params.row.adp : renderError() },
            description: 'Average Draft Position on ' + cutoffDate,
            hideSortIcons: true,
        },
        {
            field: 'clv',
            headerName: 'CLV',
            minWidth: 75,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            renderCell(params) { return params.row.adp !== -1 ? params.row.clv : renderError() },
            description: 'Closing Line Value: Average Pick - ADP',
            hideSortIcons: true,
        },
        {
            field: 'percentDrafted',
            headerName: 'Exposure',
            minWidth: 125,
            type: 'number',
            valueFormatter: ({ value }) => `${value}%`,
            align: 'center',
            headerAlign: 'center',
            hideSortIcons: true,
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
                headerName: 'Pos Rank',
                minWidth: 120,
                type: 'string',
                align: 'center',
                headerAlign: 'center',
                hideSortIcons: true,
                renderCell(params) {
                    return params.row.resurrectionAdp === -1 ? renderError() : (
                        <PlayerBadge pos={params.row.pos} posRank={params.row.resurrectionPosRank} />
                    );
                },
                description: 'Resurrection ADP Position Rank on ' + resurrectionCutoffDate,
            },
            {
                field: 'resurrectionAdp',
                headerName: 'ADP',
                minWidth: 75,
                type: 'number',
                align: 'center',
                headerAlign: 'center',
                hideSortIcons: true,
                renderCell(params) { return params.row.resurrectionAdp !== -1 ? params.row.resurrectionAdp : renderError() },
                description: 'Resurrection Average Draft Position on ' + resurrectionCutoffDate,
            },
            {
                field: 'resurrectionClv',
                headerName: 'CLV',
                minWidth: 75,
                type: 'number',
                align: 'center',
                headerAlign: 'center',
                hideSortIcons: true,
                renderCell(params) { return params.row.resurrectionAdp !== -1 ? params.row.resurrectionClv : renderError() },
                description: 'Closing Line Value: Average Pick - Resurrection ADP',
            }
        );
    } else {
        columns.push({
            field: 'id', headerName: '', minWidth: 100, align: 'center', sortable: false, filterable: false, hideable: false, disableColumnMenu: true,
            renderCell({row}) {
                return (
                    <Button
                        disabled={row.timesDrafted < 1}
                        onClick={() => handleViewPlayer(row.id)}
                        variant="contained"
                        color="primary">
                            View
                    </Button>
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
            disableDensitySelector={true}
            slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
            density="compact"
        />
    );
}