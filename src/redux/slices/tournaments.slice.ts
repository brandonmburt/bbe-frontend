import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Tournament } from '../../models/tournament.model';
import { serializeMap, deserializeMap } from '../utils/serialize.utils';
import ApiService from '../api/api.service';

export interface TournamentsState {
    loading: boolean;
    error: string;
    tournaments: Tournament[];
    tournamentMap: [string, Tournament][]; // serializion required for redux-persist
}

const initialState: TournamentsState = {
    loading: false,
    error: '',
    tournaments: null,
    tournamentMap: null,
}

// first argument is the action type, second argument is the async function which returns a promise
export const fetchTournaments = createAsyncThunk('tournaments/fetchTournaments', async () => {
    return await ApiService.getTournaments();
});

export const tournamentsSlice = createSlice({
    name: 'tournaments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTournaments.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchTournaments.fulfilled, (state, action) => {
            // console.log(action.payload)
            state.loading = false;
            const tournamentsArr: Tournament[] = action.payload.map(x => {
                return {
                    id: x.id,
                    title: x.title,
                    entryFee: +x.entry_fee,
                    tournamentSize: +x.tournament_size,
                    totalPrizes: +x.total_prizes,
                }
            });
            const tournamentsMap = new Map<string, Tournament>();
            tournamentsArr.forEach((tournament: Tournament) => tournamentsMap.set(tournament.id, tournament));
            state.tournaments = tournamentsArr;
            state.tournamentMap = serializeMap(tournamentsMap);
        })
        builder.addCase(fetchTournaments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const selectTournaments = (state: RootState) => state.tournaments.tournaments;
export const selectTournamentsMap = createSelector([state => state.tournaments.tournamentMap], tournamentMap => deserializeMap(tournamentMap));

export default tournamentsSlice.reducer