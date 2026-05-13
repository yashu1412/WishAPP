const cloudinary = require("../config/cloudinary");
const { ApiError } = require("../utils/ApiError");

const uploadOnCloudinary = async (fileBuffer, folderName = "greetings") => {
  try {
    if (!fileBuffer) return null;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(new ApiError(500, "Error uploading to cloudinary"));
          else resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Cloudinary upload failed");
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary: ", error);
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
