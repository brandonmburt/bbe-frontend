import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice'
import adpsReducer from './slices/adps.slice';
import exposureReducer from './slices/exposure.slice';
import adminReducer from './slices/admin.slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    exposure: exposureReducer,
    adps: adpsReducer,
    admin: adminReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;