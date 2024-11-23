import { createSlice } from '@reduxjs/toolkit';
import { initialRows } from '../../../data/dummy';

const initialState = {
  rows: initialRows,
};

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    addVehicleAction: state => {
      state.value += 1;
    },
    updateVehicleAction: (state, action) => {
      const { id, make, modal, transmission } = action.payload;
      const index = state.rows.findIndex(row => row.id === id);
      if (index > -1) {
        state.rows[index].make = make;
        state.rows[index].modal = modal;
        state.rows[index].transmission = transmission;
      }
    },
    deleteVehicleAction: (state, action) => {
      state.rows = state.rows.filter(row => row.id !== action.payload);
    },
  },
});

export const { addVehicleAction, updateVehicleAction, deleteVehicleAction } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
