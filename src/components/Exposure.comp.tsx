import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../redux/hooks'
import { selectDraftedPlayers, selectNumDrafts, selectTournaments, selectDraftedTeams, selectDraftedPlayersMap } from '../redux/slices/exposure.slice';
import Box from '@mui/material/Box';
import { Adp } from '../models/adp.model';
import { selectAdpMap, selectAdditionalKeysMap } from '../redux/slices/adps.slice';
import { DraftedPlayer, Tournament, DraftedTeam } from '../models/exposure.model';
import { FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CardComp } from './CardComp.comp';
import PlayerExposure from './Player.comp';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useLoginRedirect from '../hooks/useLoginRedirect';
import PlayerExposureGrid from './grids/PlayerExposureGrid.comp';
import { generateInputOptions, getPlayerExposureRows, getPlayerExposureByTournamentId } from '../utils/player.utils';
import { PlayerInputOption, ExposureData, SelectedPlayer } from '../models/player.model';
import { selectExposureType } from '../redux/slices/exposure.slice';
import { UniquePlayers } from './tables/UniquePlayersTable.comp';
import { selectResurrectionAdpMap } from '../redux/slices/adps.slice';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { getAdpObj } from '../utils/adp.utils';

interface ExposureSnapshot {
    totalDrafts: number,
    uniquePlayers: {
        qbs: number,
        rbs: number,
        wrs: number,
        tes: number
    }
}

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
    const [filteredNumDrafts, setFilteredNumDrafts] = useState<number>(null); // contains the number of drafts for the selected tournament

    const draftedPlayersMap: Map<string, DraftedPlayer> = useAppSelector(selectDraftedPlayersMap);
    const [resurrectionMap] = useState<Map<string, Adp>>(useAppSelector(selectResurrectionAdpMap));

    const [resurrectionToggle, setResurrectionToggle] = useState<boolean>(false);
    
    // Autocomplete data
    const [playerId, setPlayerId] = useState<string>(null);
    const [inputOptions, setInputOptions] = useState<PlayerInputOption[]>(null);
    const [tournamentId, setTournamentId] = useState<string>(null);

    // Selected player exposure data
    const [playerData, setPlayerData] = useState<SelectedPlayer>(null);

    // Data grid rows
    const [rows, setRows] = useState<ExposureData[]>(null);
    const [exposureSnapshot, setExposureSnapshot] = useState<ExposureSnapshot>(null);

    useEffect(() => {
        setTournamentId(null);
        setPlayerId(null);
        setPlayerData(null);
        setRows(null);
        setExposureSnapshot(null);
        setInputOptions(null);
        setResurrectionToggle(false);
    }, [exposureType]);

    useEffect(() => {
        const tournament = tournaments.find(({ id }) => id === tournamentId);
        if (!tournament) {
            setFilteredDraftedPlayers(null);
            setFilteredNumDrafts(null);
            return;
        };
        const { entryFee } = tournament;
        const [filteredPlayers, filteredNumDrafts] = getPlayerExposureByTournamentId(tournamentId, entryFee, draftedTeams, draftedPlayersMap);
        setFilteredDraftedPlayers(filteredPlayers);
        setFilteredNumDrafts(filteredNumDrafts);
    }, [tournamentId]);

    useEffect(() => {
        if (!playerId || !adpMap || !inputOptions.find(({ playerId: pId }) => pId === playerId)) return;
        let draftedPlayer = draftedPlayersMap.get(playerId);
        let { adp, posRank } = getAdpObj(draftedPlayer, adpMap, playerKeysMap) ?? { adp: null, posRank: null };

        let { position, team } = draftedPlayersMap.get(playerId) ?? { position: null, team: null };
        // Retreive relevant data depending on whether a tournament is selected
        const playerInfo = (tournamentId !== null && filteredDraftedPlayers !== null) ?
            filteredDraftedPlayers.find(({ playerId: pId }) => pId === playerId) :
            draftedPlayers.find(({ playerId: pId }) => pId === playerId);
        const tournamentInfo = tournaments.find(({ id }) => id === tournamentId);
        setPlayerData({
            playerInfo,
            playerAdp: Number(adp) ?? 216, // TODO: handle case when ADP isn't a number
            posRank,
            team,
            pos: position,
            tournamentTitle: tournamentInfo === undefined ? null : tournamentInfo.title,
        });
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

            const gridRows = resurrectionToggle && exposureType === '2023season' ?
                getPlayerExposureRows(adpMap, playerKeysMap, exposurePlayers, draftQuantity, resurrectionMap) : 
                getPlayerExposureRows(adpMap, playerKeysMap, exposurePlayers, draftQuantity);
            const snapshot: ExposureSnapshot = {
                totalDrafts: draftQuantity,
                uniquePlayers: { qbs: 0, rbs: 0, wrs: 0, tes: 0 }
            }
            gridRows.forEach(({ pos }) => {
                if (pos === 'QB') snapshot.uniquePlayers.qbs++;
                else if (pos === 'RB') snapshot.uniquePlayers.rbs++;
                else if (pos === 'WR') snapshot.uniquePlayers.wrs++;
                else if (pos === 'TE') snapshot.uniquePlayers.tes++;
            });
            setExposureSnapshot(snapshot);
            setRows(gridRows);
        }
    }, [adpMap, draftedPlayers, numDrafts, filteredDraftedPlayers, filteredNumDrafts, resurrectionToggle]);

    useEffect(() => {
        setPlayerId(null);
        setPlayerData(null);
        if (filteredDraftedPlayers && filteredDraftedPlayers.length > 0) {
            setInputOptions(generateInputOptions(filteredDraftedPlayers));
        } else if (draftedPlayers && draftedPlayers.length > 0) {
            setInputOptions(generateInputOptions(draftedPlayers));
        }
    }, [draftedPlayers, filteredDraftedPlayers]);

    return numDrafts && adpMap && draftedPlayers && rows && inputOptions ? (
        <Box sx={{ padding: { xs: '10px', sm: '20px 40px' } }}>
            <Grid container spacing={{ xs: 2, sm: 4 }} >

                <Grid xs={12} >
                    <Box>
                        <CardComp body={<>
                            <Grid container spacing={{ xs: 2, sm: 4 }} >
                                <Grid xs={12} md={5} sx={{ pb: 0, pt: 1 }}>
                                    <Stack>
                                        <Autocomplete
                                            style={{textAlign: "center"}}
                                            value={tournamentId}
                                            onChange={(e, newVal) => setTournamentId(newVal) }
                                            options={tournaments.map((option) => option.id)}
                                            getOptionLabel={(option) => tournaments.find(t => t.id === option)?.title ?? ''}
                                            sx={{ width: { xs: '100%', md: 225, lg: 300 } }}
                                            renderInput={(params) => <TextField {...params} label="Tournament" />}
                                        />
                                        <Typography sx={{ ml: 1, my: 0 }} variant='caption'>
                                            {numDrafts && tournamentId === null ? numDrafts : filteredNumDrafts} Drafts
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid xs={12} md={7} sx={{ pb: 0, pt: 1 }}>
                                    <Box sx= {{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                                        {exposureSnapshot && <UniquePlayers snapshot={exposureSnapshot} /> }
                                    </Box>
                                </Grid>
                                {exposureType === '2023season' &&
                                    <Grid xs={12} sx={{ py: 0, my: 0 }}>
                                        <Box sx={{ width: 1, flexDirection: 'row', display: 'flex', justifyContent: 'right', fontSize: '12px' }}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    label={<span style={{ fontSize: '14px' }}>Show Resurrection Data</span>}
                                                    labelPlacement='start'
                                                    control={
                                                        <Switch checked={resurrectionToggle} onChange={() => setResurrectionToggle(!resurrectionToggle)} />
                                                    } />
                                            </FormGroup>
                                            <Tooltip title={'Resurrection is a best ball tournament which began on week 6 of the 2023 NFL season. The Resurrection ADPs reflect a player\'s perceived value through the first five weeks of the season.'} placement="top" arrow>
                                                <InfoIcon sx={{ ml: '5px', mt: '7px', color: 'lightgrey' }} />
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                }
                            </Grid>
                            <Box sx={{ mb: 1, mt: 3, w: 1, height: 500 }}>
                                <PlayerExposureGrid handleViewPlayer={handleViewPlayer} rows={rows} showResurrectionColumns={resurrectionToggle}/>
                            </Box>
                        </>}/>
                    </Box>
                </Grid>

                {/* Hide the View Player feature when resurrection switch is enabled */}
                {!resurrectionToggle &&
                    <Grid xs={12} >
                        <Box>
                            <CardComp title={'Player Exposure'} tooltip={'Available for players drafted two or more times'} body={<>
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
                                            <Typography sx={{ ml: 1 }} variant='caption'>
                                                Showing data for {playerData.tournamentTitle ?? 'all drafts'}
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ ml: 1 }} variant='caption'>
                                                Select a player to view more exposure data
                                            </Typography>
                                        )}
                                    </Stack>
                                </div>
                                <div style={{width: '100%'}}>
                                    {playerId && playerData &&
                                        <PlayerExposure data={playerData} />
                                    }
                                </div>
                            </>}/>
                        </Box>
                    </Grid>
                }
            </Grid>
        </Box>
    ) : null;
}