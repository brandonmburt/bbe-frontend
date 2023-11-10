import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks'
import { selectDraftedTeams, selectExposureType, selectTournaments, selectDraftedPlayersMap } from '../../redux/slices/exposure.slice';
import { DraftedPlayer, DraftedTeam, Tournament } from '../../models/exposure.model';
import { Adp } from '../../models/adp.model';
import { selectAdpMap, selectAdditionalKeysMap } from '../../redux/slices/adps.slice';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { formatAsMoney } from '../../utils/format.utils';
import { CardComp } from '../../components/CardComp.comp';
import { Autocomplete, Box, Button, TextField, Chip } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DraftBadge } from '../../components/badges/DraftBadge.comp';
import useLoginRedirect from '../../hooks/useLoginRedirect';
import { RosterTable } from './RosterTable.comp';
import { GameStacksTable } from './GameStacksTable.comp';
import { DraftedTeamRowData, PlayerFilterOption, PlayoffStack } from '../../models/roster.model';
import { getDraftedRosters, generateRosterFilterOptions, getPlayoffStacks } from '../../utils/roster.utils';
import { POS_COLORS } from '../../constants/colors.constants';
import { EXPOSURE_TYPES } from '../../constants/types.constants';

export function Drafts() {
    useLoginRedirect();

    const rosterRef = useRef(null);

    const tournaments: Tournament[] = useAppSelector(selectTournaments);
    const draftedPlayersMap: Map<string, DraftedPlayer> = useAppSelector(selectDraftedPlayersMap);
    const adpMap: Map<string, Adp> = useAppSelector(selectAdpMap);
    const playerKeysMap: Map<string, string> = useAppSelector(selectAdditionalKeysMap);
    const draftedTeams: DraftedTeam[] = useAppSelector(selectDraftedTeams);
    const exposureType: string = useAppSelector(selectExposureType);
    const adpDateString: string = EXPOSURE_TYPES.find(({ id }) => id === exposureType)?.cutoffDate ?? '';

    const [draftedTeamsData, setDraftedTeamsData] = useState<DraftedTeamRowData[]>(null);
    const [autocompleteOptions, setAutocompleteOptions] = useState<PlayerFilterOption[]>(null);
    const [selectedOptions, setSelectedOptions] = useState<PlayerFilterOption[]>([]);
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
            disableExport: true,
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
        let options: PlayerFilterOption[] = generateRosterFilterOptions(arr, draftedPlayersMap);
        setAutocompleteOptions(options);
    }, [draftedTeams, adpMap, draftedPlayersMap, playerKeysMap, tournaments]);

    const handleOptionChange = (e, newValue) => {
        if (newValue.length > 5) return;
        setSelectedOptions(newValue);
    };

    const selectedRosterTable = !selectedTeamData ? null : <RosterTable selectedTeamData={selectedTeamData} adpDateString={adpDateString} />;
    const playoffStacksTable = !playoffStacks ? null : <GameStacksTable playoffStacks={playoffStacks} />;

    return (
        <>
            {draftedTeamsData &&
                <Box sx={{ padding: { xs: '10px', sm: '20px 40px' }, width: '100%' }}>
                    <Grid container spacing={{ xs: 2, sm: 4 }} >
                        <Grid xs={12} >
                            <CardComp title='Drafted Teams' body={<>
                                {autocompleteOptions &&
                                    <Box sx={{ mb: 2 }}>
                                        <Autocomplete
                                            multiple
                                            value={selectedOptions}
                                            onChange={handleOptionChange}
                                            options={autocompleteOptions}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Players"
                                                    placeholder={selectedOptions.length === 0 ? 'Filter by Players' : ''}
                                                />
                                            )}
                                            renderTags={(selectedOptions: PlayerFilterOption[], getTagProps) =>
                                                selectedOptions.map((obj: PlayerFilterOption, index: number) => (
                                                  <Chip sx={{bgcolor: POS_COLORS[obj.position] ?? 'grey', color: 'white' }} variant='filled' label={obj.label} {...getTagProps({ index })} />
                                                ))
                                              }
                                        />
                                    </Box>
                                }
                                <div style={{ height: '500px', width: '100%'}}>
                                    <DataGrid
                                        rowSelection={false}
                                        rows={
                                            selectedOptions.length === 0 ? draftedTeamsData :
                                            draftedTeamsData.filter(({ selections }) => {
                                                return selectedOptions.every(({ value }) => selections.find(s => s.id === value));
                                            })
                                        }
                                        columns={columns}
                                        disableDensitySelector={true}
                                        density="compact"
                                        slots={{ toolbar: GridToolbar }}
                                        slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}/>
                                </div>
                            </>} />
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