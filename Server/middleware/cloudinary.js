const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (req, res, next) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // success fully Uploaded ,
  // console.log("req.file--------", req.file);
  const localFilePath = req.file.path;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // success fully Uploaded ,
    // console.log("response--------", response);
    req.cloudinaryData = {
      url: response.secure_url,
      public_id: response.public_id,
    };
    fs.unlinkSync(localFilePath);
    next();
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return res
      .status(500)
      .json({ message: "Cloudinary upload failed", error: error.message });
  }
};

module.exports = uploadOnCloudinary;
