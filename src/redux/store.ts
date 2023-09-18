import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user.slice'
import playersReducer from './slices/players.slice';
import tournamentsReducer from './slices/tournaments.slice';
import adpsReducer from './slices/adps.slice';
import exposureReducer from './slices/exposure.slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    exposure: exposureReducer,
    players: playersReducer,
    tournaments: tournamentsReducer,
    adps: adpsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;