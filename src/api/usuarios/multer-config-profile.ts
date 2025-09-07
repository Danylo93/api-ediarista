
import { diskStorage, Options } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const multerConfigProfile: Options = {
  storage: diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

export default multerConfigProfile;