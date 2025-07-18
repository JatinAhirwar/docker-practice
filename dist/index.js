import bodyParser from 'body-parser';
import express from 'express';
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { listGroups } from './helper/sendMessage.js';
import GLOBAL from './constant/index.js';
import deleteAuthFolder from './helper/deleteAuth.js';
const AUTH_FOLDER = 'auth_info';
let deleteAuth = true;
// express
const app = express();
app.use(bodyParser.json());
// Prompt user input before connecting
// GLOBAL.GROUP_ID = await askQuestion('\n📝 Enter WhatsApp Group ID to send message: ');
// GLOBAL.GROUP_ID = "120363383098721276@g.us"
// GLOBAL.MESSAGE = await askQuestion('💬 Enter the message to send: ');
GLOBAL.MESSAGE = '555';
// GLOBAL.IMAGE_PATH = await askQuestion('🖼️ (Optional) Enter image path (or press Enter to skip): ');
// // GLOBAL.IMAGE_PATH = await askQuestion('🖼️ (Optional) Enter image path (or press Enter to skip): ');
// const resolvedImagePath = GLOBAL.IMAGE_PATH.trim() === '' ? null : GLOBAL.IMAGE_PATH.trim();
// Start WhatsApp socket
async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
        const { version } = await fetchLatestBaileysVersion();
        GLOBAL.SOCK = makeWASocket({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys),
            },
        });
        GLOBAL.SOCK.ev.on('creds.update', saveCreds);
        GLOBAL.SOCK.ev.on('connection.update', async (update) => {
            const { connection, qr } = update;
            if (qr) {
                console.log('🔐 Scan the QR code below:');
                qrcode.generate(qr, { small: true });
            }
            if (connection === 'open') {
                console.log('✅ Connected to WhatsApp!\n');
                // Optional: list groups for reference
                await listGroups(GLOBAL.SOCK);
                // Send message
                // await sendMessageToGroup(GLOBAL.SOCK, GLOBAL.GROUP_ID.trim(), GLOBAL.MESSAGE.trim(), resolvedImagePath);
                console.log("Now Starting telegram bot");
                // GLOBAL.GROUP_ID = await askQuestion('\n📝 Enter WhatsApp Group ID to send message: ');
                // GLOBAL.TELEGRAM_ID = Number(await askQuestion('\n📝 Enter Telegram Channel ID to send message: '));
                GLOBAL.TELEGRAM_BOT_START = true;
                console.log("Telegram to Whatsapp bot started!! This bot is created by Jatin \n Telegram id : jatin9911 \n whatsapp no. 9540454252 ");
            }
            if (connection === 'close') {
                console.log('📴 Disconnected...');
                if (deleteAuth) {
                    deleteAuthFolder(AUTH_FOLDER);
                    deleteAuth = false;
                }
                startBot();
            }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('💥 Connection failed:', err.message);
            deleteAuthFolder(AUTH_FOLDER);
            await new Promise((r) => setTimeout(r, 2000));
            await startBot();
        }
        else {
            console.log("Unknown error:", err);
        }
        ;
    }
    return GLOBAL.SOCK;
}
// 🔁 Start the bot
// startBot();
export { startBot };
