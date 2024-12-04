import express from "express";
import { getAllUsersForSidebar, getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post('/send/:id', sendMessage)
router.get('/conversations', getAllUsersForSidebar)
router.get('/:id', getMessages)

export default router;