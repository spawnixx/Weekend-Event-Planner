import express from "express";
import { searchTicketmasterEvents } from "../controllers/ticketmasterController.js";
import { tokenAuth } from "../middleware/tokenAuth.js";

const router = express.Router();

router.get("/events", tokenAuth, searchTicketmasterEvents);

export default router;
