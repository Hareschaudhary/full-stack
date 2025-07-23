import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination:(req,file,cd)=>{
    cd(null,'./public/uploads')
    },
    filename:(req,file,cd)=>{
        const uploadfilename = Date.now() + path.extname(file.originalname);
        cd(null,uploadfilename)
    }
})

const fileFilter =(req,file,cd)=>{
if(file.mimetype.startsWith("image/")){
cd(null,true)
}else{
  cb(new Error("Only images are allowed"), false);
}
}

const fileSize =  1024 * 1024 * 3 // 3MB

const FileUpload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize:fileSize,
    }
})

export default FileUpload