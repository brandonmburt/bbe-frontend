import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../redux/hooks'
import { selectDraftedPlayers,selectNumDrafts, selectTournaments, selectDraftedTeams, selectDraftedPlayersMap, selectRookieKeysSet, selectSophomoreKeysSet } from '../../redux/slices/exposure.slice';
import { Adp } from '../../models/adp.model';
import { selectAdpMap, selectAdditionalKeysMap, selectResurrectionAdpMap, selectResurrectionAdditionalKeysMap } from '../../redux/slices/adps.slice';
import { DraftedPlayer, Tournament, DraftedTeam, ExposureSnapshot, PlayerStack, PlayoffMatchupInfo } from '../../models/exposure.model';
import { Stack, Typography, Box, TextField, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CardComp } from '../../components/CardComp.comp';
import PlayerExposure from './Player.comp';
import useLoginRedirect from '../../hooks/useLoginRedirect';
import PlayerExposureGrid from './PlayerExposureGrid.comp';
import {
    generateInputOptions,
    getPlayerExposureRows,
    addResurrectionData,
    addExperienceData,
    getPlayerExposureByTournamentId,
    generateExposureSnapshot,
    getSelectedPlayerData,
    getPlayoffMatchupInfoMap,
    generatePlayerStacks,
} from '../../utils/player.utils';
import { PlayerInputOption, ExposureData, SelectedPlayer } from '../../models/player.model';
import { selectExposureType } from '../../redux/slices/exposure.slice';
import { UniquePlayers } from './UniquePlayersTable.comp';
import { PositionButtons } from './PositionButtons.comp';
import { PlayerStacks } from './PlayerStacks.comp';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import { FilterOptions } from './FilterOptions.comp';


export default function Exposure() {
    useLoginRedirect();

    const playerRef = useRef(null);

    const numDrafts: number = useAppSelector(selectNumDrafts); // Quantity of drafts for current exposure type
    const adpMap: Map<string, Adp> = useAppSelector(selectAdpMap);
    const playerKeysMap: Map<string, string> = useAppSelector(selectAdditionalKeysMap);
    const draftedPlayers: DraftedPlayer[] = useAppSelector(selectDraftedPlayers);
    const tournaments: Tournament[] = useAppSelector(selectTournaments);
    const draftedTeams: DraftedTeam[] = useAppSelector(selectDraftedTeams);
    const exposureType: string = useAppSelector(selectExposureType);
    const [filteredDraftedPlayers, setFilteredDraftedPlayers] = useState<DraftedPlayer[]>(null); // contains teams for the selected tournament
    const [filteredDraftedTeams, setFilteredDraftedTeams] = useState<DraftedTeam[]>(null); // contains teams for the selected tournament
    const [filteredNumDrafts, setFilteredNumDrafts] = useState<number>(null); // contains the number of drafts for the selected tournament

    const draftedPlayersMap: Map<string, DraftedPlayer> = useAppSelector(selectDraftedPlayersMap);
    const [resurrectionMap] = useState<Map<string, Adp>>(useAppSelector(selectResurrectionAdpMap));
    const [resurrectionKeysMap] = useState<Map<string, string>>(useAppSelector(selectResurrectionAdditionalKeysMap));

    const [resurrectionToggle, setResurrectionToggle] = useState<boolean>(false);
    const [filteredPositions, setFilteredPositions] = useState<Set<string>>(new Set(['QB', 'RB', 'WR', 'TE']));
    const [playerFilter, setPlayerFilter] = useState<string>('');
    
    // Autocomplete data
    const [playerId, setPlayerId] = useState<string>(null);
    const [inputOptions, setInputOptions] = useState<PlayerInputOption[]>(null);
    const [tournamentId, setTournamentId] = useState<string>(null);

    // Selected player exposure data
    const [playerData, setPlayerData] = useState<SelectedPlayer>(null);

    // Data grid rows
    const [rows, setRows] = useState<ExposureData[]>(null);
    const [exposureSnapshot, setExposureSnapshot] = useState<ExposureSnapshot>(null);

    // Player stacks
    const [stacks, setStacks] = useState<PlayerStack[]>(null);
    const [playoffMatchupsMap, setPlayoffMatchupsMap] = useState<Map<string, PlayoffMatchupInfo>>(null);

    // Filter Options
    const isResurrectionEnabled: boolean = EXPOSURE_TYPES.find(({ id }) => id === exposureType)?.enableResurrection;
    const [showRookies, setShowRookies] = useState<boolean>(false);
    const [showSophomores, setShowSophomores] = useState<boolean>(false);
    const rookieKeysSet: Set<string> = useAppSelector(selectRookieKeysSet);
    const sophomoreKeysSet: Set<string> = useAppSelector(selectSophomoreKeysSet);

    useEffect(() => {
        setTournamentId(null);
        setPlayerId(null);
        setPlayerData(null);
        setInputOptions(null);
        setFilteredDraftedPlayers(null);
        setFilteredDraftedTeams(null);
        setFilteredNumDrafts(null);
        setStacks(null);
        setPlayoffMatchupsMap(null);
        setRows(null);
        setExposureSnapshot(null);
        setResurrectionToggle(false);
    }, [exposureType]);

    useEffect(() => {
        if (!tournaments) return;
        const tournament: Tournament = tournaments.find(({ id }) => id === tournamentId);
        if (!tournament) {
            setFilteredDraftedPlayers(null);
            setFilteredDraftedTeams(null);
            setFilteredNumDrafts(null);
        } else {
            const [ filteredPlayers, filteredNumDrafts ] = getPlayerExposureByTournamentId(tournament, draftedTeams, draftedPlayersMap);
            setFilteredDraftedPlayers(filteredPlayers);
            setFilteredDraftedTeams(draftedTeams.filter(t => t.tournamentId === tournamentId || t.weeklyWinnerId === tournamentId));
            setFilteredNumDrafts(filteredNumDrafts);
        }
    }, [tournamentId]);

    useEffect(() => {
        if (!playerId || !adpMap || !inputOptions.find(({ playerId: pId }) => pId === playerId)) return;        
        let draftedPlayer: DraftedPlayer = draftedPlayersMap.get(playerId);
        const tournament: Tournament = tournaments.find(({ id }) => id === tournamentId);
        const players: DraftedPlayer[] = filteredDraftedPlayers !== null ? filteredDraftedPlayers : draftedPlayers;
        const playerData: SelectedPlayer = getSelectedPlayerData(draftedPlayer, adpMap, playerKeysMap, players, tournament);
        setPlayerData(playerData);
        if (draftedPlayer.team !== null && draftedPlayer.team !== '') {
            const teams: DraftedTeam[] = filteredDraftedTeams !== null ? filteredDraftedTeams : draftedTeams;
            const playoffMap = getPlayoffMatchupInfoMap(draftedPlayer.team);
            const stacks = generatePlayerStacks(draftedPlayer, players, teams, playoffMap);
            setPlayoffMatchupsMap(playoffMap);
            setStacks(stacks);
        }
    }, [playerId]);

    function handleViewPlayer (id: string) {
        if (!inputOptions.find(({playerId: pId}) => pId === id)) return;
        setPlayerId(id);
        setTimeout(() => playerRef.current?.scrollIntoView({behavior: 'smooth'}), 50);
    }

    useEffect(() => {
        if (adpMap && draftedPlayers && numDrafts && draftedPlayersMap) {
            setPlayerId(null);
            let exposurePlayers: DraftedPlayer[] = tournamentId === null ? draftedPlayers : filteredDraftedPlayers;
            let draftQuantity: number = tournamentId === null ? numDrafts : filteredNumDrafts;
            const gridRows: ExposureData[] = getPlayerExposureRows(adpMap, playerKeysMap, exposurePlayers, draftQuantity);
            if (resurrectionToggle && isResurrectionEnabled) addResurrectionData(gridRows, resurrectionMap, resurrectionKeysMap);
            if (rookieKeysSet && sophomoreKeysSet) addExperienceData(gridRows, rookieKeysSet, sophomoreKeysSet);
            const snapshot: ExposureSnapshot = generateExposureSnapshot(gridRows, draftQuantity);
            setExposureSnapshot(snapshot);
            setRows(gridRows);
        }
    }, [adpMap, draftedPlayers, numDrafts, filteredDraftedPlayers, filteredNumDrafts, resurrectionToggle, rookieKeysSet, sophomoreKeysSet]);

    useEffect(() => {
        setPlayerId(null);
        setPlayerData(null);
        if (filteredDraftedPlayers && filteredDraftedPlayers.length > 0) setInputOptions(generateInputOptions(filteredDraftedPlayers));
        else if (draftedPlayers && draftedPlayers.length > 0) setInputOptions(generateInputOptions(draftedPlayers));
    }, [draftedPlayers, filteredDraftedPlayers]);

    const handlePositionsFilterChange = (positions: string[]) => setFilteredPositions(new Set(positions));
    const handlePlayerFilterChange = (str: string) => setPlayerFilter(str);

    const filterRows = (rows: ExposureData[]): ExposureData[] => {
        if (playerFilter !== '') return rows.filter(({ name }) => name.toLowerCase().includes(playerFilter.toLowerCase()));
        else if (showRookies) return rows.filter(row => row?.experience === 'R' && filteredPositions.has(row.pos));
        else if (showSophomores) return rows.filter(row => row?.experience === 'S' && filteredPositions.has(row.pos));
        else return rows.filter(({ pos }) => filteredPositions.has(pos))
    }

    return numDrafts && adpMap && draftedPlayers && rows && inputOptions ? (
        <Box sx={{ padding: { xs: '10px', sm: '20px 40px' } }}>
            <Grid container spacing={{ xs: 2, sm: 4 }} >

                <Grid xs={12} >
                    <Box>
                        <CardComp body={<>
                            <Grid container spacing={{ xs: 2, sm: 4 }} >
                                <Grid xs={12} lg={5} sx={{ pb: 0, pt: 1 }}>
                                    <PositionButtons
                                        handlePositionsFilterChange={handlePositionsFilterChange}
                                        handlePlayerFilterChange={handlePlayerFilterChange}
                                    />
                                </Grid>
                                <Grid xs={12} md={6} lg={3} sx={{ pb: 0, pt: 1 }}>
                                    <Stack>
                                        {/* Ensures rendering only occurs once required data is retrieved from store */}
                                        {(tournamentId === null || tournaments.find(t => t.id === tournamentId))  &&
                                            <Autocomplete
                                                style={{textAlign: "center"}}
                                                value={tournamentId}
                                                size='small'
                                                onChange={(e, newVal) => setTournamentId(newVal) }
                                                options={tournaments.map((option) => option.id)}
                                                getOptionLabel={(option) => tournaments.find(t => t.id === option)?.title ?? ''}
                                                sx={{ width: 1 }}
                                                renderInput={(params) => <TextField {...params} label="Tournament" />}
                                            />
                                        }
                                        <Typography sx={{ ml: 1, my: 0 }} variant='caption'>
                                            {numDrafts && tournamentId === null ? numDrafts : filteredNumDrafts} Drafts
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={6} lg={4} sx={{ pb: 0, pt: 0 }}>
                                    <Box sx= {{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                                        {exposureSnapshot && <UniquePlayers snapshot={exposureSnapshot} /> }
                                    </Box>
                                </Grid>
                                <Grid xs={12} sx={{ py: 0, my: 0 }}>
                                    <FilterOptions
                                        setShowRookies={setShowRookies}
                                        setShowSophomores={setShowSophomores}
                                        isResurrectionEnabled={isResurrectionEnabled}
                                        resurrectionToggle={resurrectionToggle}
                                        setResurrectionToggle={setResurrectionToggle}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mb: 1, mt: 3, w: 1, height: 500 }}>
                                <PlayerExposureGrid
                                    handleViewPlayer={handleViewPlayer}
                                    rows={filterRows(rows)}
                                    showResurrectionColumns={resurrectionToggle} 
                                    exposureType={exposureType} />
                            </Box>
                        </>}/>
                    </Box>
                </Grid>

                {/* Hide the View Player feature when resurrection switch is enabled */}
                {!resurrectionToggle &&
                    <Grid xs={12} >
                        <Box>
                            <CardComp title={'Player Exposure'} body={<>
                                <div ref={playerRef} style={{width: '100%', display: 'block', justifyContent: 'center'}}>
                                    <Stack>
                                        <Autocomplete
                                            style={{textAlign: "center"}}
                                            value={playerId}
                                            onChange={(e, newVal) => setPlayerId(newVal) }
                                            options={inputOptions.map((option) => option.playerId)}
                                            getOptionLabel={(option) => draftedPlayersMap.get(option)?.name ?? ''}
                                            sx={{ width: { xs: '100%', md: 300 } }}
                                            renderInput={(params) => <TextField {...params} label="Player" />}
                                        />
                                        
                                        {playerId && playerData ? (
                                            <Typography sx={{ ml: 1 }} variant='caption'>Showing data for {playerData.tournamentTitle ?? 'all drafts'}</Typography>
                                        ) : (
                                            <Typography sx={{ ml: 1 }} variant='caption'>Select a player to view more exposure data</Typography>
                                        )}
                                    </Stack>
                                </div>
                                {playerId && playerData && <PlayerExposure data={playerData} /> }
                                {playerId && playerData && playoffMatchupsMap && stacks &&
                                    <PlayerStacks team={playerData.playerInfo.team} stacks={stacks} playoffMatchupsMap={playoffMatchupsMap} />
                                }
                            </>}/>
                        </Box>
                    </Grid>
                }
            </Grid>
        </Box>
    ) : null;
}