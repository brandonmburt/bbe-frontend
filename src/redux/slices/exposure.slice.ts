import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { Exposure, EntryBreakdown, DraftedTeam } from '../../models/exposure.model';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import { deserializeMap, serializeMap } from '../utils/serialize.utils';
import ApiService from '../api/api.service';

export interface ExposureState {
    uploadInProgress: boolean,
    uploadError: string,
    uploadMessage: string,
    deleteInProgress: boolean,
    deleteError: string,
    loadingExposureData: boolean,
    exposureDataError: string,
    exposureMap: [string, Exposure][]; // serializion required for redux-persist
    totals: {
        drafts: number,
        entryFees: number,
        entryBreakdown: EntryBreakdown,
    }
    exposureTypes: {
        userUploadedTypes: [string, string][], // [exposureId, draftQuantityStr]
        selectedType: string,
    }
    uploadTimestamps: string[][], // [exposureType, exposureDisplay, timestamp][]
    shouldRefreshData: boolean,
}

const initialState: ExposureState = {
    uploadInProgress: false,
    uploadError: null,
    uploadMessage: null,
    deleteInProgress: false,
    deleteError: null,
    loadingExposureData: false,
    exposureDataError: null,
    exposureMap: null,
    totals: {
        drafts: 0,
        entryFees: 0,
        entryBreakdown: null,
    },
    exposureTypes: {
        userUploadedTypes: [],
        selectedType: null,
    },
    uploadTimestamps: [],
    shouldRefreshData: false,
}

// first argument is the action type, second argument is the async function which returns a promise
export const uploadExposure = createAsyncThunk('user/uploadFile', async (obj: any) => { // TODO: Define type
    const { uid, accessToken, csvFile, exposureType } = obj;
    return await ApiService.uploadExposure(uid, accessToken, csvFile, exposureType);
});

export const deleteExposure = createAsyncThunk('user/deleteExposure', async (obj: any, { getState }) => { // TODO: define type
    const { exposureType } = obj;
    let state: any = getState();
    let token = state.user.accessToken;
    return await ApiService.deleteExposure(token, exposureType);
});

export const fetchExposureData = createAsyncThunk('user/fetchExposureData', async (obj: any) => { // TODO: define type
    return await ApiService.getExposureData(obj.uid);
});

export const exposureSlice = createSlice({
    name: 'exposure',
    initialState,
    reducers: {
        setExposureType: (state, action: PayloadAction<string>) => {
            const type = action.payload, { userUploadedTypes } = state.exposureTypes;
            if (type === '') state.exposureTypes.selectedType = null;
            if (EXPOSURE_TYPES.map(t => t[0]).includes(type) && userUploadedTypes.find(t => t[0] === type)) {
                state.exposureTypes.selectedType = action.payload;
            }
        },
        setShouldRefreshData: (state, action: PayloadAction<boolean>) => {
            state.shouldRefreshData = action.payload;
        }
    },
    extraReducers: (builder) => {
        // uploadExposure
        builder.addCase(uploadExposure.pending, (state) => {
            state.uploadInProgress = true;
            state.uploadMessage = null;
        })
        builder.addCase(uploadExposure.fulfilled, (state, action) => {
            state.uploadInProgress = false;
            state.uploadError = null;
            state.uploadMessage = action.payload;
            state.shouldRefreshData = true;
        })
        builder.addCase(uploadExposure.rejected, (state, action) => {
            state.uploadInProgress = false;
            state.uploadError = action.error.message;
            state.uploadMessage = null;
        })
        // fetchExposureData
        builder.addCase(fetchExposureData.pending, (state) => {
            state.loadingExposureData = true;
        })
        builder.addCase(fetchExposureData.fulfilled, (state, action) => {
            state.loadingExposureData = false;
            state.exposureDataError = null;

            const exposureMap = new Map<string, Exposure>();
            const exposureResponse = action.payload, responseExposureTypes = [];
            let timestampInfo = [];
            EXPOSURE_TYPES.forEach(exposureType => {
                if (exposureResponse.hasOwnProperty(exposureType[0])) {
                    const exposureObj = { ...exposureResponse[exposureType[0]] }
                    const numTeams: number = exposureObj.draftSpots.totalNumDrafts;
                    const numTeamsStr: string = numTeams.toString() + (numTeams === 1 ? ' Draft' : ' Drafts');
                    responseExposureTypes.push([exposureType[0], numTeamsStr]);
                    exposureMap.set(exposureType[0], exposureObj);
                    timestampInfo.push([exposureType[0], exposureType[1], exposureObj.uploadTime]);
                }
            });
            state.exposureMap = serializeMap(exposureMap);
            state.uploadTimestamps = timestampInfo;

            let totalDrafts = 0;
            let totalEntryFees = 0;
            let breakdown: EntryBreakdown = {
                sitAndGos: { quantity: 0, fees: 0, fastDrafts: 0, slowDrafts: 0 },
                tournaments: { quantity: 0, fees: 0, fastDrafts: 0, slowDrafts: 0 },
                weeklyWinners: { quantity: 0, fees: 0, fastDrafts: 0, slowDrafts: 0 },
            };
            exposureMap.forEach((exposure: Exposure) => {
                totalDrafts += exposure.draftSpots.totalNumDrafts;
                totalEntryFees += exposure.draftSpots.totalDollarSum;
                exposure.draftedTeams.forEach((team: DraftedTeam) => {
                    const { weeklyWinnerId, tournamentId, draftEntryFee, draftType } = team;
                    if (tournamentId != '') {
                        breakdown.tournaments.quantity++;
                        breakdown.tournaments.fees += draftEntryFee;
                        breakdown.tournaments.fastDrafts += draftType === 'fast' ? 1 : 0;
                        breakdown.tournaments.slowDrafts += draftType === 'slow' ? 1 : 0;
                    } else if (weeklyWinnerId != '') {
                        breakdown.weeklyWinners.quantity++;
                        breakdown.weeklyWinners.fees += draftEntryFee;
                        breakdown.weeklyWinners.fastDrafts += draftType === 'fast' ? 1 : 0;
                        breakdown.weeklyWinners.slowDrafts += draftType === 'slow' ? 1 : 0;
                    } else {
                        breakdown.sitAndGos.quantity++;
                        breakdown.sitAndGos.fees += draftEntryFee;
                        breakdown.sitAndGos.fastDrafts += draftType === 'fast' ? 1 : 0;
                        breakdown.sitAndGos.slowDrafts += draftType === 'slow' ? 1 : 0;
                    }
                });
            });
            state.totals.drafts = totalDrafts;
            state.totals.entryFees = totalEntryFees;
            state.totals.entryBreakdown = breakdown;
            if (responseExposureTypes.length > 0) {
                state.exposureTypes.userUploadedTypes = responseExposureTypes;
                state.exposureTypes.selectedType = responseExposureTypes[0][0];
            }
        })
        builder.addCase(fetchExposureData.rejected, (state, action) => {
            state.loadingExposureData = false;
            state.exposureDataError = action.error.message;
        })
        // deleteExposure
        builder.addCase(deleteExposure.pending, (state) => {
            state.deleteInProgress = true;
            state.shouldRefreshData = false;
        })
        builder.addCase(deleteExposure.fulfilled, (state, action) => {
            state.deleteInProgress = false;
            state.deleteError = null;
            state.shouldRefreshData = true;
        })
        builder.addCase(deleteExposure.rejected, (state, action) => {
            state.deleteInProgress = false;
            state.deleteError = action.error.message;
            state.shouldRefreshData = false;
        })
    }
})

export const { setExposureType, setShouldRefreshData } = exposureSlice.actions

const selectExposure = createSelector([state => state.exposure], exposure => exposure);
export const selectTotalDraftsEntered = createSelector([selectExposure], exposure => exposure.totals.drafts);
export const selectTotalEntryFees = createSelector([selectExposure], exposure => exposure.totals.entryFees);
export const selectEntryBreakdown = createSelector([selectExposure], exposure => exposure?.totals?.entryBreakdown ?? null);
export const selectExposureType = createSelector([selectExposure], exposure => exposure.exposureTypes.selectedType);
export const selectUserUploadedTypes = createSelector([selectExposure], exposure => exposure.exposureTypes.userUploadedTypes);
export const selectUploadTimestamps = createSelector([selectExposure], exposure => exposure.uploadTimestamps);
export const selectShouldRefreshData = createSelector([selectExposure], exposure => exposure.shouldRefreshData);
export const selectUploadMessage = createSelector([selectExposure], exposure => exposure.uploadMessage);

export const selectExposureMap = createSelector([state => state.exposure.exposureMap], exposureMap => deserializeMap(exposureMap));
export const selectExposureByType = createSelector([selectExposureMap, selectExposureType], (exposureMap, type) => {
    return exposureMap.get(type) ?? null;
});
export const selectDraftedTeams = createSelector([selectExposureByType], (exposure) => exposure?.draftedTeams ?? null);
export const selectDraftSpots = createSelector([selectExposureByType], (exposure) => exposure?.draftSpots ?? null);
export const selectNumDrafts = createSelector([selectExposureByType], (exposure) => exposure?.draftSpots?.totalNumDrafts ?? null);
export const selectPosPicksByRound = createSelector([selectExposureByType], (exposure) => exposure?.posPicksByRound ?? null);
export const selectRunningTotals = createSelector([selectExposureByType], (exposure) => exposure?.draftEntriesRunningTotals ?? null);
export const selectDraftedPlayers = createSelector([selectExposureByType], (exposure) => exposure?.draftedPlayers ?? null);
export const selectTournaments = createSelector([selectExposureByType], (exposure) => exposure?.tournaments ?? null);

export default exposureSlice.reducer