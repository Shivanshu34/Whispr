import express from 'express';
import multer from 'multer';
import storage from '../cloudconfig.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import { addDetails, editDetails } from '../controller/details.js';
import { validateDetails } from '../middleware.js';

const router = express.Router();

const upload = multer({storage});

router.post("/add", upload.single('avatar'), validateDetails, wrapAsync(addDetails));

router.put("/edit", upload.single('avatar'), wrapAsync(editDetails));

export default router;  