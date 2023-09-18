import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../redux/hooks'
import { selectDraftedPlayers, selectNumDrafts } from '../redux/slices/exposure.slice';
import Box from '@mui/material/Box';
import { Player } from '../models/player.model';
import {selectPlayersMap} from '../redux/slices/players.slice';
import { deserializeMap } from '../redux/utils/serialize.utils';
import { Adp } from '../models/adp.model';
import { selectAdpMapByType } from '../redux/slices/adps.slice';
import { DraftedPlayer } from '../models/exposure.model';
import { Grid } from '@mui/material';
import { CardComp } from './CardComp.comp';
import PlayerExposure from './Player.comp';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useLoginRedirect from '../hooks/useLoginRedirect';
import PlayerExposureGrid from './grids/PlayerExposureGrid.comp';
import { generateInputOptions, getPlayerExposureRows } from '../utils/player.utils';
import { PlayerInputOption, ExposureData, SelectedPlayer } from '../models/player.model';
import { selectExposureType } from '../redux/slices/exposure.slice';

export default function Exposure() {
    useLoginRedirect();

    const playerRef = useRef(null);

    const numDrafts: number = useAppSelector(selectNumDrafts); // Quantity of drafts for current exposure type
    const adpMap: Map<string, Adp> = useAppSelector(selectAdpMapByType);
    const draftedPlayers: DraftedPlayer[] = useAppSelector(selectDraftedPlayers);
    const [playersMap] = useState<Map<string, Player>>(deserializeMap(useAppSelector(selectPlayersMap)));
    
    // Autocomplete data
    const [playerId, setPlayerId] = useState<string>(null);
    const [inputOptions, setInputOptions] = useState<PlayerInputOption[]>(null);

    // Player exposure data
    const [playerData, setPlayerData] = useState<SelectedPlayer>(null);

    // Data grid rows
    const [rows, setRows] = useState<ExposureData[]>(null);

    useEffect(() => {
        if (!playerId || !playersMap || !adpMap || !inputOptions.find(({ playerId: pId }) => pId === playerId)) return;
        let { adp, posRank } = adpMap.get(playerId) ?? { adp: null, posRank: null };
        let { pos, team } = playersMap.get(playerId) ?? { pos: null, team: null };
        setPlayerData({
            playerInfo: draftedPlayers.find(({ playerId: pId }) => pId === playerId),
            playerAdp: Number(adp) ?? 216, // TODO: handle case when ADP isn't a number
            posRank,
            team,
            pos
        });
    }, [playerId]);

    function handleViewPlayer (id: string) {
        if (!inputOptions.find(({playerId: pId}) => pId === id)) return;
        setPlayerId(id);
        setTimeout(() => playerRef.current?.scrollIntoView({behavior: 'smooth'}), 50);
    }

    useEffect(() => {
        if (playersMap && adpMap && draftedPlayers && numDrafts) {
            setRows(getPlayerExposureRows(playersMap, adpMap, draftedPlayers, numDrafts));
        }
    }, [playersMap, adpMap, draftedPlayers, numDrafts]);

    useEffect(() => {
        if (draftedPlayers && draftedPlayers.length > 0) {
            setPlayerId(null);
            setPlayerData(null);
            setInputOptions(generateInputOptions(draftedPlayers));
        }
    }, [draftedPlayers]);

    return numDrafts && adpMap && draftedPlayers && rows && inputOptions && playersMap ? (
        <Box sx={{ padding: '20px 40px' }}>
            <Grid container spacing={4} >
                <Grid item xs={12} >
                    <Box>
                        <CardComp title={`Exposure`} body={<div style={{ height: 500, width: '100%' }}>
                            <PlayerExposureGrid handleViewPlayer={handleViewPlayer} rows={rows} />
                        </div>}/>
                    </Box>
                </Grid>

                <Grid item xs={12} >
                    <Box>
                        <CardComp title={''} body={<>
                            <div ref={playerRef} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <Autocomplete
                                    style={{textAlign: "center"}}
                                    value={playerId}
                                    onChange={(e, newVal) => setPlayerId(newVal) }
                                    options={inputOptions.map((option) => option.playerId)}
                                    getOptionLabel={(option) => playersMap.get(option)?.name ?? ''}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Player" />}
                                />
                            </div>
                            <div style={{width: '100%'}}>
                                {playerId && playerData &&
                                    <PlayerExposure data={playerData} />
                                }
                            </div>
                        </>}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    ) : null;
}