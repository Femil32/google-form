import { Router } from "express";
import FormRoutes from "./form.js";
import ResponseRoutes from "./response.js";
import UserRoutes from "./user.js";
import TemplateRoutes from "./template.js";

const router = Router();

router
  .use("/api/form", FormRoutes)
  .use("/api/response", ResponseRoutes)
  .use("/api/user", UserRoutes)
  .use("/api/template", TemplateRoutes);

export default router;
