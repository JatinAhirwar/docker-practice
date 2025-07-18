import express from 'express';
import bodyParser from 'body-parser';
import GLOBAL from './constant/index.js';
import { sendMessageToGroup } from './helper/sendMessage.js';
import { startBot } from './index.js';
const app = express();
app.use(bodyParser.json());
/**
 * Telegram webhook endpoint
 */
app.post('/webhook', async (req, res) => {
    try {
        if (!GLOBAL.TELEGRAM_BOT_START) {
            console.log("⚠️ WhatsApp bot is not ready!");
            res.sendStatus(200);
            return;
        }
        const message = req.body.message;
        const channel = req.body?.channel_post?.chat;
        console.log("📨 Received channel_post from:", channel);
        console.log("📦 Raw body:", req.body);
        // Handle direct message (optional)
        if (message && message.text) {
            const chatId = message.chat.id;
            console.log('💬 Received direct message:', message.text);
            console.log("🆔 Telegram Chat ID:", chatId);
        }
        // Handle post
        if (channel && channel.id === GLOBAL.TELEGRAM_ID) {
            const text = req.body?.channel_post?.text || '';
            console.log("📣 Handling channel post:", text);
            await sendMessageToGroup(GLOBAL.SOCK, GLOBAL.GROUP_ID, text, null);
        }
        // Handle channel messages
        if (channel && channel.id === GLOBAL.TELEGRAM_ID) {
            const text = req.body?.channel_post?.text || '';
            console.log("📣 Handling channel post:", text);
            await sendMessageToGroup(GLOBAL.SOCK, GLOBAL.GROUP_ID, text, null);
        }
        res.sendStatus(200);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('❌ Error in /webhook:', err.message);
        }
        else {
            console.error('❌ Unknown error in /webhook:', err);
        }
        res.sendStatus(500);
    }
});
app.get('/ping', async (req, res) => {
    res.status(200).json({ message: "working" });
});
/**
 * Start the Express server
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    startBot(); // Start WhatsApp bot
});
