const fs = require('fs');
const { parseCommands, updateCommands } = require('./libs/commands');
async function main() {
    await updateCommands();
    const email = fs.readFileSync('email.txt', 'utf8');
    console.log(await parseCommands(email));
}

main().catch(console.log);