import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../redux/hooks'
import { selectDraftedTeams, selectExposureType, selectTournaments } from '../redux/slices/exposure.slice';
import { DraftedTeam, Tournament } from '../models/exposure.model';
import { deserializeMap } from '../redux/utils/serialize.utils'; 
import { Player } from '../models/player.model';
import { Adp } from '../models/adp.model';
import { selectAdpMapByType } from '../redux/slices/adps.slice';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { selectPlayersMap } from '../redux/slices/players.slice';
import { formatAsMoney } from '../utils/format.utils';
import { CardComp } from './CardComp.comp';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DraftBadge } from './badges/DraftBadge.comp';
import useLoginRedirect from '../hooks/useLoginRedirect';
import { RosterTable } from './tables/RosterTable.comp';
import { GameStacksTable } from './tables/GameStacksTable.comp';
import { DraftedTeamRowData, PlayoffStack } from '../models/roster.model';
import { getDraftedRosters, getPlayoffStacks } from '../utils/roster.utils';

export function DraftedRoster() {
    useLoginRedirect();

    const rosterRef = useRef(null);

    const tournaments: Tournament[] = useAppSelector(selectTournaments);
    const playersMap: Map<string, Player> = deserializeMap(useAppSelector(selectPlayersMap));
    const adpMap: Map<string, Adp> = useAppSelector(selectAdpMapByType);
    const draftedTeams: DraftedTeam[] = useAppSelector(selectDraftedTeams);
    const exposureType: string = useAppSelector(selectExposureType);

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
        { field: 'entryType', headerName: 'Badges', minWidth: 125, type: 'string', headerAlign: 'center', align: 'center',
            renderCell(params) {
                return (<DraftBadge type={params.row.entryType}  />);
            }
        },
        { field: 'title', headerName: 'Title', minWidth: 150, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'draftType', headerName: 'Draft Type', minWidth: 75, type: 'string', headerAlign: 'center', align: 'center' },
        { field: 'entryFee', headerName: 'Entry Fee', minWidth: 100, type: 'number', valueFormatter: ({ value }) => !value ? null : formatAsMoney(value), headerAlign: 'center', align: 'center' },
        { field: 'totalCLV', headerName: 'Total CLV', minWidth: 100, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'draftSize', headerName: 'Draft Size', minWidth: 100, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'startDate', headerName: 'Draft Date', minWidth: 100, type: 'string', valueFormatter: ({ value }) => value.split(' ')[0], align: 'center', headerAlign: 'center' },
        { field: 'tournamentSize', headerName: 'Tournament Size', minWidth: 150, type: 'number', align: 'center', headerAlign: 'center' },
        { field: 'tournamentPrizes', headerName: 'Prize Pool', minWidth: 100, type: 'number', align: 'center', valueFormatter: ({ value }) => !value ? null : formatAsMoney(value), headerAlign: 'center' },
        { field: 'id', headerName: '', minWidth: 100, type: 'number', align: 'center', sortable: false, filterable: false, hideable: false, disableColumnMenu: true,
            renderCell({row}) {
                return (<Button onClick={() => handleViewTeam(row.id)} variant="contained" color="primary">View</Button>);
            }
        },
    ];

    useEffect(() => {
        if (!draftedTeams || !adpMap) return;
        let arr: DraftedTeamRowData[] = getDraftedRosters(draftedTeams, adpMap, playersMap, tournaments);
        setDraftedTeamsData(arr);
    }, [draftedTeams, adpMap]);

    const selectedRosterTable = !selectedTeamData ? null : <RosterTable selectedTeamData={selectedTeamData} />;
    const playoffStacksTable = !playoffStacks ? null : <GameStacksTable playoffStacks={playoffStacks} />;

    return (
        <>
            {draftedTeamsData &&
                <Box sx={{ padding: { xs: '10px', sm: '20px 40px' }, width: '100%' }}>
                    <Grid container spacing={{ xs: 2, sm: 4 }} >
                        <Grid xs={12} >
                            <CardComp title='Drafted Teams' body={<div style={{ height: '500px', width: '100%'}}><DataGrid rowSelection={false} rows={draftedTeamsData} columns={columns} /></div>} />
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
                                                {selectedTeamData.title} <DraftBadge type={selectedTeamData.entryType} /><span style={{color: 'grey', fontWeight: 'normal', fontSize: '16px'}}>{selectedTeamData.startDate.split(' ')[0]}</span>
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