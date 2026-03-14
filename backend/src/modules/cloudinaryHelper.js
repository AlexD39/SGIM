const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadBufferToCloudinary = (fileBuffer, folder = "sgim-reportes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { uploadBufferToCloudinary };