import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
import {
  addResource,
  getResources,
  updateResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = express.Router();

// Resource routes
router.route("/resource/add").post(isAuthenticated, singleUpload, addResource);
router.route("/resources/:lectureId").get(isAuthenticated, getResources);
router
  .route("/resource/:resourceId")
  .put(isAuthenticated, singleUpload, updateResource)
  .delete(isAuthenticated, deleteResource);

export default router; 