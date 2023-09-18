import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Adp } from '../../models/adp.model';
import { serializeMap, deserializeMap } from '../utils/serialize.utils';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import ApiService from '../api/api.service';
import { selectExposureType } from './exposure.slice';

export interface AdpState {
    loading: boolean;
    error: string,
    uploadInProgress: boolean,
    uploadError: string,
    adpMap: [string, [string, Adp][]][]; // serializion required for redux-persist
}

const initialState: AdpState = {
    loading: false,
    error: '',
    uploadInProgress: false,
    uploadError: '',
    adpMap: null,
}

// NEEDS TO BE ADMIN ONLY
export const uploadADPs = createAsyncThunk('admin/uploadADPs', async (obj: any) => { // TODO: Define type
    const { uid, accessToken, csvFile, exposureType } = obj;
    return await ApiService.uploadAdps(uid, accessToken, csvFile, exposureType);
});

export const fetchADPs = createAsyncThunk('adp/getADPs', async () => {
    return await ApiService.getAdps();
});

export const adpsSlice = createSlice({
    name: 'adps',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // uploadADPs
        builder.addCase(uploadADPs.pending, (state) => {
            state.uploadInProgress = true;
        })
        builder.addCase(uploadADPs.fulfilled, (state, action) => {
            console.log(action.payload)
            state.uploadInProgress = false;
            state.uploadError = '';
        })
        builder.addCase(uploadADPs.rejected, (state, action) => {
            state.uploadInProgress = false;
            state.uploadError = action.error.message;
        })
        // fetchADPs
        builder.addCase(fetchADPs.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchADPs.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';

            const adpResponse = action.payload;
            const adpTypeMap: Map<string, [string, Adp][]> = new Map();

            EXPOSURE_TYPES.forEach(([type, ]) => {
                if (adpResponse.hasOwnProperty(type)) {
                    let currAdpMap: Map<string, Adp> = new Map();
                    let currAdpArr = adpResponse[type];
                    currAdpArr.forEach((item: Adp) => currAdpMap.set(item.player_id, { ...item, adp: item.adp === null ? 216 : item.adp })); // TODO: can't blindly apply 216
                    let currSerializedMap: [string, Adp][] = serializeMap(currAdpMap);
                    adpTypeMap.set(type, currSerializedMap);
                }
            });

            state.adpMap = serializeMap(adpTypeMap);            
        })
        builder.addCase(fetchADPs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const selectAdpState = (state: RootState) => state.adps.adpMap
export const selectAdpMap = createSelector([state => state.adps.adpMap], adpMap => deserializeMap(adpMap));

export const selectAdpMapByType = createSelector([selectAdpMap, selectExposureType], (adpMap, type) => {
    return adpMap.has(type) ? deserializeMap(adpMap.get(type)) : null;
});

export default adpsSlice.reducer