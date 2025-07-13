import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
/**
 * Create __dirname in ES modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Deletes the specified auth folder if it exists.
 * @param folderName Name of the folder to delete (relative to project root).
 */
export default function deleteAuthFolder(folderName = 'auth_info') {
    try {
        const folderPath = path.join(__dirname, '..', folderName);
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log('🗑️ Deleted auth folder:', folderPath);
        }
        else {
            console.log('ℹ️ Auth folder does not exist:', folderPath);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('❌ Failed to delete auth folder:', err.message);
        }
        else {
            console.error('❌ Unknown error while deleting folder:', err);
        }
    }
}
