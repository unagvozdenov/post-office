import { Router } from "express";
import { PostOfficeController } from "../controllers/postOffice.controller";

const router = Router();
const postOfficeController = new PostOfficeController();

router.post("/", postOfficeController.createPostOffice);
router.get("/", postOfficeController.getPostOffices.bind(postOfficeController));
router.get("/:zipCode", postOfficeController.getPostOfficeByZipCode);
router.put("/:zipCode", postOfficeController.updatePostOffice);
router.delete("/:zipCode", postOfficeController.deletePostOffice);

export default router;
