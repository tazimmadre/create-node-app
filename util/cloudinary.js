import cloudinary from "cloudinary"
cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_CLOUD_NAME,
  api_key: process.env.Cloudinary_API_KEY,
  api_secret: process.env.Cloudinary_API_SECRET,
});
export default cloudinary;