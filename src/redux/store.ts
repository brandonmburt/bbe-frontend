import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice'
import adpsReducer from './slices/adps.slice';
import exposureReducer from './slices/exposure.slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    exposure: exposureReducer,
    adps: adpsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;