import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req,file) => {
        const timestamp = Math.floor(Date.now()/1000);
        const filename = file?.originalname.split('.')[0] ||'default';
        
        return {
            folder: "Whispr_Dev",
            public_id: `${timestamp}-${filename}`,
            allowed_formats: ['png','jpg','jpeg'],
        };
    }
});

export default storage;
export {cloudinary};