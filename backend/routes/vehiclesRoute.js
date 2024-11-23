/**
 * IMPORTS
 */
import express from "express";
import {
  createVehiclesData,
  deleteVehicle,
  getFile,
  getVehicleList,
  removeIndividualImage,
  updateVehicle,
} from "../controllers/vehiclesController.js";
import { resizeImages, upload } from "../middlewares/resizeImages.js";
import validate from "../middlewares/validate.js";
import {
  createVehicleValidation,
  deleteVehicleValidation,
  updateVehicleValidation,
  vehicleImageValidation,
} from "../validations/vehicle.validations.js";

const router = express.Router();

router.get("/", getVehicleList);
router.get("/file/:filename", getFile);

router.post(
  "/createVehicleData",
  upload.single("car_images"),
  resizeImages("add"),
  validate(createVehicleValidation),
  createVehiclesData
);
router.put(
  "/updateVehicle/:id",
  upload.array("car_images"),
  resizeImages("update"),
  validate(updateVehicleValidation),
  updateVehicle
);

router.delete(
  "/deleteVehicle/:id",
  validate(deleteVehicleValidation),
  deleteVehicle
);

router.put(
  "/deleteVehicleImage/:vehicleId/:imageId",
  validate(vehicleImageValidation),
  removeIndividualImage
);

export default router;
