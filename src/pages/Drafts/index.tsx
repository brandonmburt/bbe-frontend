import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks'
import { selectDraftedTeams, selectExposureType, selectTournaments, selectDraftedPlayersMap } from '../../redux/slices/exposure.slice';
import { DraftedPlayer, DraftedTeam, Tournament } from '../../models/exposure.model';
import { Adp } from '../../models/adp.model';
import { selectAdpMap, selectAdditionalKeysMap } from '../../redux/slices/adps.slice';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { formatAsMoney } from '../../utils/format.utils';
import { CardComp } from '../../components/CardComp.comp';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DraftBadge } from '../../components/badges/DraftBadge.comp';
import useLoginRedirect from '../../hooks/useLoginRedirect';
import { RosterTable } from './RosterTable.comp';
import { GameStacksTable } from './GameStacksTable.comp';
import { DraftedTeamRowData, PlayoffStack } from '../../models/roster.model';
import { getDraftedRosters, getPlayoffStacks } from '../../utils/roster.utils';

export function Drafts() {
    useLoginRedirect();

    const rosterRef = useRef(null);

    const tournaments: Tournament[] = useAppSelector(selectTournaments);
    const draftedPlayersMap: Map<string, DraftedPlayer> = useAppSelector(selectDraftedPlayersMap);
    const adpMap: Map<string, Adp> = useAppSelector(selectAdpMap);
    const playerKeysMap: Map<string, string> = useAppSelector(selectAdditionalKeysMap);
    const draftedTeams: DraftedTeam[] = useAppSelector(selectDraftedTeams);
    const exposureType: string = useAppSelector(selectExposureType);
    const adpDateString: string = exposureType === '2023resurrection' ? '10/12/2023' : '9/07/2023';

    const [draftedTeamsData, setDraftedTeamsData] = useState<DraftedTeamRowData[]>(null);
    const [selectedTeamData, setSelectedTeamData] = useState<DraftedTeamRowData>(null);
    const [playoffStacks, setPlayoffStacks] = useState<Map<number, PlayoffStack[]>>(null);

    useEffect(() => {
        setSelectedTeamData(null);
        setPlayoffStacks(null);
    }, [exposureType]);

    const handleViewTeam = (id: string) => {
        let teamData: DraftedTeamRowData = draftedTeamsData.find(team => team.id === id);
        setSelectedTeamData(teamData);
        let playoffStackMap: Map<number, PlayoffStack[]> = getPlayoffStacks(teamData);
        setPlayoffStacks(playoffStackMap);
        setTimeout(() => rosterRef.current?.scrollIntoView({behavior: 'smooth'}), 50);
    };

    // TODO: create component for grid
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '',
            minWidth: 100,
            align: 'center',
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true,
            renderCell({row}) {
                return (<Button onClick={() => handleViewTeam(row.id)} variant="contained" color="primary">View</Button>);
            }
        },
        {
            field: 'entryType',
            headerName: 'Badges',
            minWidth: 125,
            type: 'string',
            headerAlign: 'left',
            align: 'left',
            sortable: false,
            renderCell(params) {
                return (<DraftBadge type={params.row.entryType} draftType={params.row.draftType} />);
            }
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 140,
            type: 'string',
            headerAlign: 'center',
            align: 'center',
            hideSortIcons: true,
        },
        {
            field: 'draftType',
            headerName: 'Type',
            minWidth: 75,
            type: 'string',
            headerAlign: 'center',
            align: 'center',
            hideSortIcons: true,
        },
        {
            field: 'entryFee',
            headerName: 'Fee',
            minWidth: 75,
            type: 'number',
            valueFormatter: ({ value }) => !value ? null : formatAsMoney(value),
            headerAlign: 'center',
            align: 'center',
            hideSortIcons: true,
        },
        {
            field: 'totalCLV',
            headerName: 'Total CLV',
            minWidth: 110,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            description: 'Total Closing Line Value for Drafted Team. Closing Line Value for each player is calculated as follows: Pick Number - Average Draft Position (as of ' + adpDateString + ')',
            hideSortIcons: true,
        },
        {
            field: 'draftSize',
            headerName: 'Draft Size',
            minWidth: 110,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            hideSortIcons: true,
        },
        {
            field: 'startDate',
            headerName: 'Draft Date',
            minWidth: 110,
            type: 'string',
            valueFormatter: ({ value }) => value.split(' ')[0],
            align: 'center',
            headerAlign: 'center',
            hideSortIcons: true,
        },
        {
            field: 'tournamentSize',
            headerName: 'Field Size',
            minWidth: 125,
            type: 'number',
            align: 'center',
            headerAlign: 'center',
            hideSortIcons: true,
        },
        {
            field: 'tournamentPrizes',
            headerName: 'Prize Pool',
            minWidth: 110,
            type: 'number',
            align: 'center',
            valueFormatter: ({ value }) => !value ? null : formatAsMoney(value),
            headerAlign: 'center',
            hideSortIcons: true,
        },
    ];

    useEffect(() => {
        if (!draftedTeams || !adpMap || !playerKeysMap || !draftedPlayersMap) return;
        let arr: DraftedTeamRowData[] = getDraftedRosters(draftedTeams, adpMap, playerKeysMap, draftedPlayersMap, tournaments);
        setDraftedTeamsData(arr);
    }, [draftedTeams, adpMap, draftedPlayersMap, playerKeysMap, tournaments]);

    const selectedRosterTable = !selectedTeamData ? null : <RosterTable selectedTeamData={selectedTeamData} adpDateString={adpDateString} />;
    const playoffStacksTable = !playoffStacks ? null : <GameStacksTable playoffStacks={playoffStacks} />;

    return (
        <>
            {draftedTeamsData &&
                <Box sx={{ padding: { xs: '10px', sm: '20px 40px' }, width: '100%' }}>
                    <Grid container spacing={{ xs: 2, sm: 4 }} >
                        <Grid xs={12} >
                            <CardComp title='Drafted Teams' body={
                                <div style={{ height: '500px', width: '100%'}}>
                                    <DataGrid
                                        rowSelection={false}
                                        rows={draftedTeamsData}
                                        columns={columns}
                                        disableDensitySelector={true}
                                        density="compact"
                                        slots={{ toolbar: GridToolbar }}
                                        slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}/>
                                </div>
                            } />
                        </Grid>
                    </Grid>
                </Box>
            }

            <Box ref={rosterRef} >
                {selectedTeamData &&
                    <Box sx={{ padding: { xs: '10px', sm: '20px 40px' } }}>
                        <Grid container spacing={{ xs: 2, sm: 4 }} >
                            <Grid xs={12} lg={6} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                                    <CardComp title={
                                            <>
                                                {selectedTeamData.title} <DraftBadge type={selectedTeamData.entryType} draftType={selectedTeamData.draftType} />
                                                <span style={{color: 'grey', fontWeight: 'normal', fontSize: '16px', whiteSpace: 'nowrap'}}>{selectedTeamData.startDate.split(' ')[0]}</span>
                                            </>
                                        } body={selectedRosterTable} />
                                </Box>
                            </Grid>
                            <Grid xs={12} lg={6} >
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }} >
                                    <CardComp title='Playoff Game Stacks' body={playoffStacksTable} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                }
            </Box>
        </>
    )

}