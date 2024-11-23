import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/' }),
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: () => `vehicle/`,
      providesTags: ['vehicle'],
    }),
    addVehicle: builder.mutation({
      query: (body) => ({
        url: `vehicle/createVehicleData`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['vehicle'],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, body }) => ({
        url: `vehicle/updateVehicle/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['vehicle'],
    }),
    deleteVehicle: builder.mutation({
      query: (vehicleId) => ({
        url: `vehicle/deleteVehicle/${vehicleId}`,
        method: 'Delete',
      }),
      invalidatesTags: ['vehicle'],
    }),
    deleteVehicleImage: builder.mutation({
      query: ({ vehicleId, imageId }) => ({
        url: `vehicle/deleteVehicleImage/${vehicleId}/${imageId}`,
        method: 'put',
      }),
    }),
  }),
});

export const {
  useAddVehicleMutation,
  useGetVehiclesQuery,
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleImageMutation,
} = vehicleApi;
