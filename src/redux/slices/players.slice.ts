import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Player } from '../../models/player.model';
import { serializeMap, deserializeMap } from '../utils/serialize.utils';
import ApiService from '../api/api.service';

export interface PlayersState {
    loading: boolean;
    error: string;
    players: Player[];
    playerMap: [string, Player][]; // serializion required for redux-persist
}

const initialState: PlayersState = {
    loading: false,
    error: '',
    players: null,
    playerMap: null,
}

export const fetchPlayers = createAsyncThunk('players/fetchPlayers', async (props: { accessToken: string }) => {
    return await ApiService.getPlayers(props.accessToken);
});

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPlayers.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchPlayers.fulfilled, (state, action) => {
            state.loading = false;
            const playersArr: Player[] = action.payload.map(x => {
                return {
                    id: x.id,
                    name: x.name,
                    firstName: x.first_name,
                    lastName: x.last_name,
                    pos: x.pos,
                    team: x.team,
                }
            });
            const playersMap = new Map<string, Player>();
            playersArr.forEach((player: Player) => playersMap.set(player.id, player));
            state.players = playersArr;
            state.playerMap = serializeMap(playersMap);
        })
        builder.addCase(fetchPlayers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const selectPlayersMap = createSelector([(state: RootState) => state.players.playerMap], playerMap => playerMap ? deserializeMap(playerMap) : null);

export default playersSlice.reducer