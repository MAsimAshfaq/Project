import sharp from 'sharp';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    console.log(uploadPath);
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

export const upload = multer({ storage });

export const resizeImages = (operationType = 'add') => {
  return async (req, res, next) => {
    try {
      const outputDir = path.join(__dirname, '../uploads');
      const dimensions = [
        { type: 'original', width: null, height: null, keyPrefix: 'original' },
        { type: 'large', width: 1920, height: 1080, keyPrefix: 'large' },
        {
          type: 'compressed-original',
          width: 200,
          height: 200,
          keyPrefix: 'compressed-original',
        },
        { type: 'thumbnail', width: 600, height: 400, keyPrefix: 'thumb' },
      ];

      // Handle "add" operation (single file)
      if (operationType === 'add') {
        if (!req.file) {
          return next(
            new ApiError(
              httpStatus.UNPROCESSABLE_ENTITY,
              'car_images needs to have at least 1 image'
            )
          );
        }

        const { filename, path: filePath, originalname } = req.file;

        const processedFiles = await Promise.all(
          dimensions.map(async (dim) => {
            const outputFilePath = path.join(
              outputDir,
              `${dim.keyPrefix}-${filename}`
            );
            const pipeline = sharp(filePath);

            if (dim.width) {
              pipeline.resize({ width: dim.width, height: dim.height });
            }

            await pipeline.toFile(outputFilePath);

            return {
              fieldname: req.file.fieldname,
              originalname,
              encoding: req.file.encoding,
              mimetype: req.file.mimetype,
              size: (await fs.stat(outputFilePath)).size,
              key: `${dim.keyPrefix}-${filename}`,
              type: dim.type,
            };
          })
        );

        // await fs.rm(filePath, {force:true});
        req.processedFiles = processedFiles;
        return next();
      }

      if (operationType === 'update') {
        if (!Array.isArray(req.files) || req.files.length === 0) {
          req.processedFiles = [];
          return next();
        }

        const processedFiles = [];

        for (const file of req.files) {
          const { filename, path: filePath, originalname } = file;

          const resizedFiles = await Promise.all(
            dimensions.map(async (dim) => {
              const outputFilePath = path.join(
                outputDir,
                `${dim.keyPrefix}-${filename}`
              );
              const pipeline = sharp(filePath);

              if (dim.width) {
                pipeline.resize({ width: dim.width });
              }

              await pipeline.toFile(outputFilePath);

              return {
                fieldname: file.fieldname,
                originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                size: (await fs.stat(outputFilePath)).size,
                key: `${dim.keyPrefix}-${filename}`,
                type: dim.type,
              };
            })
          );

          // await fs.rm(filePath, {force:true});
          processedFiles.push(...resizedFiles);
        }

        req.processedFiles = processedFiles;
        return next();
      }
    } catch (error) {
      next(error);
    }
  };
};
