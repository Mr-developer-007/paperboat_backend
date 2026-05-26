import path from "path";
import fs from "fs";

export const removeImage = async (imgpath :string)=>{

const fullpath =  path.join(process.cwd(),imgpath);

if(fs.existsSync(fullpath)){
    fs.promises.unlink(fullpath)
}

} 