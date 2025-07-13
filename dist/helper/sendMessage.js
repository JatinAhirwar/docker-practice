import fs from 'fs';
import path from 'path';
// Use this only if you're in an ES module
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Send message to a group
async function sendMessageToGroup(sock, groupId, message, imagePath = null) {
    try {
        if (!sock.authState.creds.me?.id) {
            console.log('⚠️ Not connected.');
            return;
        }
        console.log(groupId, message);
        if (!groupId || !message) {
            console.log('❗ Group ID and message are required.');
            return;
        }
        if (imagePath) {
            const buffer = fs.readFileSync(path.resolve(__dirname, imagePath));
            await sock.sendMessage(groupId, {
                image: buffer,
                caption: message,
            });
        }
        else {
            await sock.sendMessage(groupId, { text: message });
        }
        console.log('✅ Message sent to group:', groupId);
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('❌ Failed to send message:', err.message);
        }
        else {
            console.error('❌ Unknown error while sending message:', err);
        }
    }
}
// List all groups the bot is in
async function listGroups(sock) {
    try {
        const chats = await sock.groupFetchAllParticipating();
        const groups = Object.values(chats);
        console.log('\n📋 Your WhatsApp Groups:\n');
        groups.forEach((group) => {
            console.log(`📌 ${group.subject} => ${group.id}`);
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('❌ Failed to fetch groups:', err.message);
        }
        else {
            console.error('❌ Unknown error while fetching groups:', err);
        }
    }
}
export { sendMessageToGroup, listGroups };
