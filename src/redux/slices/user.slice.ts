import { createSlice, PayloadAction, createAsyncThunk, createSelector, createAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import ApiService from '../api/api.service';
import Cookies from 'js-cookie';
import { ReplacementRule } from '../../models/player.model';
import { UserProps, SignUpProps } from '../../models/user.model';

export interface UserState {
    shouldFetchData: boolean;
    userInfo: UserProps,
    signUp: {
        inProgress: boolean,
        error: string,
        signUpSuccessful: boolean,
    },
    signIn: {
        inProgress: boolean,
        error: string,
    }
    accessToken: string;
    shouldRenderApp: boolean;
    showDemoCredentials: boolean;
    replacementRules?: ReplacementRule[];
}

const initialState: UserState = {
    shouldFetchData: false,
    userInfo: null,
    signUp: { inProgress: false, error: null, signUpSuccessful: false },
    signIn: { inProgress: false, error: null },
    accessToken: null,
    shouldRenderApp: false,
    showDemoCredentials: false,
}

export const signUp = createAsyncThunk('user/signUp', async (props: SignUpProps) => {
    const { firstName, lastName, email, password } = props;
    return await ApiService.signUp(firstName, lastName, email, password);
});

export const signIn = createAsyncThunk('user/signIn', async (props: Partial<SignUpProps>) => {
    const { email, password, rememberMe } = props;
    return await ApiService.signIn(email, password, rememberMe);
});

export const invalidateRefreshToken = createAsyncThunk('user/invalidateRefreshToken', async (props: { refreshToken: string }) => {  
    const { refreshToken } = props;
    return await ApiService.deleteRefreshToken(refreshToken);
});

export const checkToken = createAsyncThunk('user/checkToken', async (props: { token: string, refresh: boolean }) => {
    const { token, refresh } = props;
    return await ApiService.checkToken(token, refresh);
});

export const addReplacementRule = createAsyncThunk('user/addReplacementRule', async (props: { fName: string, lName: string, fNameReplacement: string, lNameReplacement: string }, { getState }) => {
    const { fName, lName, fNameReplacement, lNameReplacement } = props;
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') console.error('Unauthorized to upload ADPs');
    return await ApiService.addReplacementRule(token, fName, lName, fNameReplacement, lNameReplacement);
});

export const deleteReplacementRule = createAsyncThunk('user/deleteReplacementRule', async (props: { id: string }, { getState }) => {
    const { id } = props;
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') console.error('Unauthorized to upload ADPs');
    return await ApiService.deleteReplacementRule(token, id);
});

export const fetchReplacementRules = createAsyncThunk('user/fetchReplacementRules', async (obj: any, { getState }) => {
    let state: any = getState();
    let token = state.user.accessToken;
    if (state.user.userInfo.role !== 'admin') return { rules: null };
    else return await ApiService.getReplacementRules(token);
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setShouldFetchData: (state, action: PayloadAction<boolean>) => {
            state.shouldFetchData = action.payload;
        },
        setShouldRenderApp: (state, action: PayloadAction<boolean>) => {
            state.shouldRenderApp = action.payload;
        },
        setShowDemoCredentials: (state, action: PayloadAction<boolean>) => {
            state.showDemoCredentials = action.payload;
        },
        resetSignInError: (state) => {
            state.signIn.error = null;
        },
        resetSignUpError: (state) => {
            state.signUp.error = null;
        },
        signOut: (state) => {
            state.userInfo = null;
            state.shouldFetchData = false;
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            state.accessToken = null;
        }
    },
    extraReducers: (builder) => {
        // signUp
        builder.addCase(signUp.pending, (state) => {
            state.signUp.inProgress = true;
            state.signUp.error = null;
        })
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.signUp.inProgress = false;
            state.signUp.error = null;
            state.signUp.signUpSuccessful = true;
        })
        builder.addCase(signUp.rejected, (state, action) => {
            state.signUp.inProgress = false;
            state.signUp.error = 'Email already in use';
        })
        // signIn
        builder.addCase(signIn.pending, (state) => {
            state.signIn.inProgress = true;
            state.signIn.error = null;
        })
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.signIn.inProgress = false;
            state.signIn.error = null;

            state.userInfo = {
                userId: action.payload.id,
                email: action.payload.email,
                role: action.payload.role,
                loggedIn: true,
                loading: false,
                error: '',
            }
            state.shouldFetchData = true;
            state.accessToken = action.payload.accessToken;
            Cookies.set('accessToken', action.payload.accessToken, { secure: true, sameSite: 'strict', expires: 1 });

            if (action.payload.refreshToken) {
                console.log('setting refresh token', action.payload.refreshToken);
                // Set the access token in a cookie with a specific name and options (e.g., secure, httpOnly)
                Cookies.set('refreshToken', action.payload.refreshToken, { secure: true, sameSite: 'strict', expires: 1 }); // TODO: look into options
            }

        })
        builder.addCase(signIn.rejected, (state, action) => {
            state.signIn.inProgress = false;
            state.signIn.error = 'Invalid email or password';
        })
        // invalidateRefreshToken
        builder.addCase(invalidateRefreshToken.pending, (state) => {

        })
        builder.addCase(invalidateRefreshToken.fulfilled, (state, action) => {
            console.log('refresh token deleted; ', action.payload)
        })
        builder.addCase(invalidateRefreshToken.rejected, (state, action) => {
            console.log('refresh token not deleted; ', action.payload);
        })
        // checkToken
        builder.addCase(checkToken.pending, (state) => {
        })
        builder.addCase(checkToken.fulfilled, (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.userInfo = {
                userId: action.payload.id,
                email: action.payload.email,
                role: action.payload.role,
                loggedIn: true,
                loading: false,
                error: '',
            }
            state.shouldFetchData = true;
            state.shouldRenderApp = true;
        })
        builder.addCase(checkToken.rejected, (state, action) => {
            console.log('refresh token rejected; ', action.payload);
            state.shouldRenderApp = true;
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
        })
        // addReplacementRule
        builder.addCase(addReplacementRule.pending, (state) => {
        })
        builder.addCase(addReplacementRule.fulfilled, (state, action) => {
        })
        builder.addCase(addReplacementRule.rejected, (state, action) => {
        })
        // deleteReplacementRule
        builder.addCase(deleteReplacementRule.pending, (state) => {
        })
        builder.addCase(deleteReplacementRule.fulfilled, (state, action) => {
        })
        builder.addCase(deleteReplacementRule.rejected, (state, action) => {
        })
        // fetchReplacementRules
        builder.addCase(fetchReplacementRules.pending, (state) => {
        })
        builder.addCase(fetchReplacementRules.fulfilled, (state, action) => {
            const rules: ReplacementRule[] = action.payload.rules;
            state.replacementRules = rules;
        })
        builder.addCase(fetchReplacementRules.rejected, (state, action) => {
        })
    }
})

export const { setShouldFetchData, setShouldRenderApp, setShowDemoCredentials, resetSignInError, resetSignUpError, signOut } = userSlice.actions

const selectUserState = (state: RootState) => state.user;
export const selectShouldFetchData = createSelector([selectUserState], userState => userState.shouldFetchData);
export const selectShowDemoCredentials = createSelector([selectUserState], userState => userState.showDemoCredentials);

export const selectUserInfo = createSelector([selectUserState], userState => userState.userInfo);
export const selectShouldRenderApp = createSelector([selectUserState], userState => userState.shouldRenderApp);
export const selectLoggedIn = createSelector([selectUserInfo], userInfo => userInfo?.loggedIn ?? false);
export const selectUserId = createSelector([selectUserInfo], userInfo => userInfo?.userId ?? null);
export const selectUserEmail = createSelector([selectUserInfo], userInfo => userInfo?.email) ?? null;
export const selectUserIsAdmin = createSelector([selectUserInfo], userInfo => userInfo?.role === 'admin');
export const selectUserIsDemo = createSelector([selectUserInfo], userInfo => userInfo?.role === 'demo');
export const selectUserAccessToken = createSelector([selectUserState], userState => userState?.accessToken ?? null);
export const selectUserLoading = createSelector([selectUserInfo], userInfo => userInfo?.loading ?? false);
export const selectUserError = createSelector([selectUserInfo], userInfo => userInfo?.error ?? null);
export const selectSignInError = createSelector([selectUserState], userState => userState?.signIn?.error ?? null);
export const selectReplacementRules = createSelector([selectUserState, selectUserIsAdmin], (userState, isAdmin) => {
    return isAdmin ? userState?.replacementRules ?? null : null;
});
export const selectSignUpError = createSelector([selectUserState], userState => userState?.signUp?.error ?? null);
export const selectSignUpSuccessful = createSelector([selectUserState], userState => userState?.signUp?.signUpSuccessful ?? false);

export default userSlice.reducer