import { Box, Button } from "@mui/material";
import "./App.css";
import Navbar from "./components/Navbar";
import { useCallback, useMemo, useState } from "react";
import Modal from "./components/Modal";
import Table from "./components/Table";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import RenderImage from "./components/RenderImage";
import {
  useDeleteVehicleMutation,
  useGetVehiclesQuery,
} from "./redux/api/vehicles";

function App() {
  const { data: rows, isLoading } = useGetVehiclesQuery();
  const [deleteVehicleData] = useDeleteVehicleMutation();

  const [open, setOpen] = useState({
    state: false,
    type: "add",
    data: null,
  });
  const handleOpen = (state, type = "add", data = null) => {
    setOpen((prev) => ({ ...prev, state, type, data }));
  };

  const handleClose = () => {
    setOpen({
      state: false,
      type: "add",
      data: null,
    });
  };

  const deleteVehicle = useCallback(
    (id) => () => {
      deleteVehicleData(id);
    },
    [deleteVehicleData]
  );

  const editVehicle = useCallback(
    (id) => () => {
      const foundItem = rows.find((row) => row._id === id);
      handleOpen(true, "edit", foundItem);
    },
    [rows]
  );

  const columns = useMemo(
    () => [
      {
        field: "images",
        headerName: "Image",
        type: "string",
        minWidth: 50,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const originalImage = params.value?.find(
            (item) => item.type == "original"
          );
          return <RenderImage src={originalImage.key} />;
        },
      },
      { field: "model", headerName: "Modal", minWidth: 100, flex: 1 },
      { field: "make", headerName: "Make", minWidth: 100, flex: 1 },
      {
        field: "transmission",
        headerName: "Transmission",
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Actions",
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteVehicle(params.id)}
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={editVehicle(params.id)}
          />,
        ],
      },
    ],
    [deleteVehicle, editVehicle]
  );

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "flex-end",
          flexGrow: 1,
        }}
      >
        <Button variant="contained" onClick={() => handleOpen(true)}>
          Add Vehicle
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 132.5px)",
          paddingX: 2,
          paddingBottom: 2,
        }}
      >
        <Table columns={columns} rows={rows} loading={isLoading} />
      </Box>
      <Modal open={open} handleClose={handleClose} />
    </>
  );
}

export default App;
