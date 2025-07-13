import * as readline from 'readline';
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        const ask = () => {
            rl.question(query, (ans) => {
                if (ans.trim() === '' || ans.trim() === 'whatsapp bot is not ready!!') {
                    // Re-prompt if input is empty or matches the unwanted message
                    ask();
                }
                else {
                    rl.close();
                    resolve(ans);
                }
            });
        };
        ask();
    });
}
export default askQuestion;
