import path from "path";
import fs from "fs/promises";
import Vehicle from "../models/Vehicles.js";
import { fileURLToPath } from "url";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const getVehicleList = async (req, res) => {
  try {
    const vehicle = await Vehicle.find();
    res.status(200).json(vehicle);
  } catch (err) {
    console.log(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during listing vehicle"
    );
  }
};

export const createVehiclesData = async (req, res) => {
  try {
    let fileName = req.file?.filename;
    await Vehicle.create({
      images: req?.processedFiles,
      make: req.body.make,
      transmission: req.body.transmission,
      model: req.body.model,
      address: req.body.address,
      fileName: fileName,
    });
    return res.status(201).json({
      message: "Vehicles data has been created",
    });
  } catch (err) {
    console.log(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during adding vehicle"
    );
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const updateBody = {
      make: req.body.make,
      transmission: req.body.transmission,
      model: req.body.model,
      address: req.body.address,
    };

    if (Array.isArray(req?.processedFiles) && req?.processedFiles.length > 0) {
      updateBody.images = req.processedFiles;
    }

    if (req.file?.filename) {
      updateBody.fileName = req.file.filename;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        $set: {
          make: updateBody.make,
          transmission: updateBody.transmission,
          model: updateBody.model,
          address: updateBody.address,
        },
        ...(updateBody.images
          ? {
              $push: {
                images: {
                  $each: updateBody.images,
                },
              },
            }
          : {}),
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    if (!updatedVehicle) {
      throw new ApiError(httpStatus.NOT_FOUND, "Vehicle not found");
    }

    return res.status(200).json({
      message: "Vehicle data has been updated",
      data: updatedVehicle,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during updating vehicle"
    );
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      throw new ApiError(httpStatus.NOT_FOUND, "Vehicle not found");
    }

    await Vehicle.deleteOne({ _id: vehicleId }, { useFindAndModify: false });

    return res.status(200).json({
      message: "Vehicle and associated files have been deleted",
    });
  } catch (err) {
    console.log(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during deleting vehicle"
    );
  }
};

export const getFile = async (req, res) => {
  try {
    let fileName = req.params.filename;
    let pathValue = path.join(__dirname, "../uploads", fileName);
    res.sendFile(pathValue);
  } catch (err) {
    console.log(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during getting vehicle images"
    );
  }
};

export const removeIndividualImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const vehicleId = req.params.vehicleId;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      throw new ApiError(httpStatus.NOT_FOUND, "Vehicle not found");
    }

    const imageIndex = vehicle.images.findIndex((img) => img._id == imageId);
    if (imageIndex === -1) {
      throw new ApiError(httpStatus.NOT_FOUND, "Image not found");
    }

    const removedImageName = vehicle.images[imageIndex].originalname;

    const updatedVehicleImages = vehicle.images.filter(
      (img) => img.originalname !== removedImageName
    );

    vehicle.images = updatedVehicleImages;
    await vehicle.save();

    return res.status(200).json({
      message: "Vehicle data has been updated",
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error during removeIndividualImage"
    );
  }
};
