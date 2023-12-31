import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import ApiService from '../api/api.service';
import { RookieDefinition } from '../../models/player.model';
import { RookieProps, ReplacementRule, ReplacementRuleProps, RegisteredUser } from '../../models/admin.model';

export interface AdminState {
    rookieDefinitions?: RookieDefinition[];
    replacementRules?: ReplacementRule[];
    users?: RegisteredUser[];
}

const initialState: AdminState = {};

export const addReplacementRule = createAsyncThunk('admin/addReplacementRule', async (props: ReplacementRuleProps, { getState }) => {
    const { fName, lName, fNameReplacement, lNameReplacement } = props;
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') console.error('Unauthorized to upload ADPs');
    return await ApiService.addReplacementRule(token, fName, lName, fNameReplacement, lNameReplacement);
});

export const deleteReplacementRule = createAsyncThunk('admin/deleteReplacementRule', async (props: { id: string }, { getState }) => {
    const { id } = props;
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') console.error('Unauthorized to upload ADPs');
    return await ApiService.deleteReplacementRule(token, id);
});

export const fetchReplacementRules = createAsyncThunk('admin/fetchReplacementRules', async (obj: any, { getState }) => {
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') return { rules: null };
    else return await ApiService.getReplacementRules(token);
});

export const addRookieDefinition = createAsyncThunk('admin/addRookieDefinitions', async (props: RookieProps, { getState }) => {
    const { firstName, lastName, team, position, season } = props;
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') console.error('Unauthorized to add rookie definitions');
    return await ApiService.addRookieDefinition(token, firstName, lastName, team, position, season);
});

export const deleteRookieDefinition = createAsyncThunk('admin/deleteRookieDefinitions', async (props: { id: string }, { getState }) => {
    const { id } = props;
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') console.error('Unauthorized to delete rookie definitions');
    return await ApiService.deleteRookieDefinition(token, id);
});

export const fetchRookieDefinitions = createAsyncThunk('admin/fetchRookieDefinitions', async (obj: any, { getState }) => {
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') return { rookieDefinitions: null };
    else return await ApiService.fetchRookieDefinitions(token);
});

export const fetchUserInfo = createAsyncThunk('admin/fetchUserInfo', async (obj: any, { getState }) => {
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') return { users: null };
    else return await ApiService.fetchUserInfo(token);
});

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // addReplacementRule
        builder.addCase(addReplacementRule.pending, (state) => {})
        builder.addCase(addReplacementRule.fulfilled, (state, action) => {})
        builder.addCase(addReplacementRule.rejected, (state, action) => {})
        // deleteReplacementRule
        builder.addCase(deleteReplacementRule.pending, (state) => {})
        builder.addCase(deleteReplacementRule.fulfilled, (state, action) => {})
        builder.addCase(deleteReplacementRule.rejected, (state, action) => {})
        // fetchReplacementRules
        builder.addCase(fetchReplacementRules.pending, (state) => {})
        builder.addCase(fetchReplacementRules.fulfilled, (state, action) => {
            const rules: ReplacementRule[] = action.payload.rules;
            state.replacementRules = rules;
        })
        builder.addCase(fetchReplacementRules.rejected, (state, action) => {})
        // addRookieDefinition
        builder.addCase(addRookieDefinition.pending, (state) => {})
        builder.addCase(addRookieDefinition.fulfilled, (state, action) => {})
        builder.addCase(addRookieDefinition.rejected, (state, action) => {})
        // deleteRookieDefinition
        builder.addCase(deleteRookieDefinition.pending, (state) => {})
        builder.addCase(deleteRookieDefinition.fulfilled, (state, action) => {})
        builder.addCase(deleteRookieDefinition.rejected, (state, action) => {})
        // fetchRookieDefinitions
        builder.addCase(fetchRookieDefinitions.pending, (state) => {})
        builder.addCase(fetchRookieDefinitions.fulfilled, (state, action) => {
            const rookieDefinitions: RookieDefinition[] = action.payload.rookieDefinitions;
            state.rookieDefinitions = rookieDefinitions;
        })
        builder.addCase(fetchRookieDefinitions.rejected, (state, action) => {})
        // fetchUserInfo
        builder.addCase(fetchUserInfo.pending, (state) => {})
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            const users: RegisteredUser[] = action.payload.users;
            state.users = users;
        })
        builder.addCase(fetchUserInfo.rejected, (state, action) => {})
    }
})

export const selectAdminState = (state: RootState) => state.admin;
export const selectReplacementRules = createSelector([selectAdminState], adminState => adminState.replacementRules);
export const selectRookieDefinitions = createSelector([selectAdminState], adminState => adminState.rookieDefinitions);
export const selectUsers = createSelector([selectAdminState], adminState => adminState.users);

export default adminSlice.reducer