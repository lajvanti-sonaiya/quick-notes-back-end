import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import cloudinary from "../utills/cloudinaryConfig.js";

export const uploadFileToClodinary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next(new Error("No files provided"));
    }

    const uploadPromises = files.map(async (file) => {
      const resizedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600 })
        .toBuffer();

      return new Promise<{ url: string; public_id: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "images",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result!.secure_url,
                public_id: result!.public_id,
              });
            },
          );

          stream.end(resizedBuffer);
        },
      );
    });

    const cloudinaryUrls = await Promise.all(uploadPromises);
    console.log("🚀 ~ uploadFileToClodinary ~ cloudinaryUrls:", cloudinaryUrls);

    req.body.cloudinaryUrls = cloudinaryUrls;

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    next(error);
  }
};
