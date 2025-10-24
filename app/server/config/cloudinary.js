import { v2 as cloudinary } from 'cloudinary';


const uploadFile = async (file) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });
        const result = await cloudinary.uploader.upload(file);
        return result.secure_url;   //result is an object that contains the url of the uploaded image
    }
    catch(error){
        console.error(error);
    }
};

export default uploadFile;