import { configureStore } from '@reduxjs/toolkit';
import vehicleReducer from './features/vehicles/vehicleSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { vehicleApi } from './api/vehicles';

export const store = configureStore({
  reducer: {
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    vehicle: vehicleReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(vehicleApi.middleware),
});

setupListeners(store.dispatch);
