import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: String,
    transmission: String,
    address: String,
    model: String,
    images: [
      {
        fieldname: { type: String, required: true }, // Field name
        originalname: { type: String, required: true }, // Original filename
        encoding: { type: String, required: true }, // Encoding type
        mimetype: { type: String, required: true }, // MIME type
        size: { type: Number, required: true }, // Size in bytes
        key: { type: String, required: true }, // Key for storage
        type: { type: String, required: true }, // Type of the image (e.g., "thumbnail", "large")
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('vehicle', vehicleSchema);

export default Vehicle;
