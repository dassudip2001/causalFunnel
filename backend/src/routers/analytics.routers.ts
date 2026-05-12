import { Router } from "express";
import {
  create,
  getBySessionId,
  get,
  getClick,
} from "../controllers/analytics.controller";

const router = Router();

router.post("/event", create);
router.get("/sessions", get);
router.get("/session/:sessionId", getBySessionId);
router.get("/click", getClick);

export default router;
