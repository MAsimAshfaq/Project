import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { transmissionData } from "../data/dummy";
import { useCallback, useEffect, useState } from "react";
import DropzoneArea from "./Dropzone";
import {
  useAddVehicleMutation,
  useUpdateVehicleMutation,
} from "../redux/api/vehicles";
import ImageCard from "./ImagePreviewCard";

const validationSchema = yup.object().shape({
  transmission: yup.string().required("Transmission is required"),
  model: yup.string().required("Model is required"),
  make: yup.string().required("Make is required"),
  address: yup.string().required("Address is required"),
});

export default function Modal({ open, handleClose }) {
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [addNewVehicle, addNewVehicleResponse] = useAddVehicleMutation();
  const [updateVehicle, updateVehicleResponse] = useUpdateVehicleMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      transmission: "",
      model: "",
      make: "",
      address: "",
    },
  });

  useEffect(() => {
    const { data } = open;

    if (Array.isArray(data?.images) && data?.images.length) {
      const filteredImages = data.images.filter(
        (img) => img.type === "thumbnail"
      );
      setThumbnailImages(filteredImages);
    }
  }, [open]);

  const handleModalClose = useCallback(() => {
    handleClose();
    reset();
  }, [handleClose, reset]);

  const onSubmitForm = async (data) => {
    const formData = new FormData();
    formData.append("model", data.model);
    formData.append("transmission", data.transmission);
    formData.append("make", data.make);
    formData.append("address", data.address);

    if (open.type === "add") {
      formData.append(`car_images`, window.myDropzone.getAcceptedFiles()[0]);
      await addNewVehicle(formData);
    } else {
      const files = window.myDropzone.getAcceptedFiles();
      if (Array.isArray(files) && files.length > 0) {
        files.forEach((file) => {
          formData.append("car_images", file);
        });
      }

      const {
        data: { _id },
      } = open;
      await updateVehicle({ id: _id, body: formData });
    }

    handleModalClose();
    reset();
  };

  useEffect(() => {
    const { type, data } = open;
    if (type === "edit" && data) {
      setValue("transmission", data.transmission);
      setValue("model", data.model);
      setValue("make", data.make);
      setValue("address", data.address);
    }
  }, [open, setValue]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open.state}
      onClose={handleModalClose}
    >
      <DialogTitle>
        {open.type === "edit" ? "Update Vehicle" : "Add Vehicle"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Model"
                    fullWidth
                    error={!!errors.model}
                    helperText={errors.model?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="transmission"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Transmission*"
                    select
                    fullWidth
                    error={!!errors.transmission}
                    helperText={errors.transmission?.message}
                  >
                    {transmissionData.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="make"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Make"
                    type="make"
                    fullWidth
                    error={!!errors.make}
                    helperText={errors.make?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    type="address"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <DropzoneArea
                images={open.data?.images || []}
                type={open.type || "add"}
                vehicleId={open.data?._id || null}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            {thumbnailImages?.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image.key}>
                <ImageCard
                  image={image}
                  vehicleId={open.data?._id}
                  emitImageId={(imageId) => {
                    setThumbnailImages((prev) =>
                      prev.filter((img) => img._id !== imageId)
                    );
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="info" variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            loading={
              addNewVehicleResponse.isLoading || updateVehicleResponse.isLoading
            }
            type="submit"
            color="primary"
            variant="contained"
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
