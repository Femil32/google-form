import { Router } from "express";
import {
  createForm,
  getFormById,
  updateFormById,
  deleteFormById,
  getAllForms,
} from "../controllers/form.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post("/create", verifyToken, createForm);
router.get("/all", verifyToken, getAllForms);
router.get("/:formId", getFormById);
router
  .route("/:formId")
  .put(verifyToken, updateFormById)
  .delete(verifyToken, deleteFormById);

export default router;
