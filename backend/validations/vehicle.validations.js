import Joi from 'joi';
import { objectId } from './custom.validations.js';

export const createVehicleValidation = {
  body: Joi.object().keys({
    make: Joi.string().trim().required(),
    transmission: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
  }),
};

export const updateVehicleValidation = {
  body: Joi.object().keys({
    make: Joi.string().trim().required(),
    transmission: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    car_images: Joi.any().optional(),
  }),
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

export const deleteVehicleValidation = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export const vehicleImageValidation = {
  params: Joi.object().keys({
    vehicleId: Joi.string().custom(objectId),
    imageId: Joi.string().custom(objectId),
  }),
};
