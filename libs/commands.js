const fs = require('fs');

function parseCommands(text) {
    const commands = getCommands();
    let final = '';
    const bodyText = text.split('$');
    for (let i = 0; i < bodyText.length; i++) {
        if (i % 2 == 0) {
            final += bodyText[i];
        } else {
            const key = bodyText[i].replace(/\(.*\)/g, '');
            const isFunction = /\(.*\)/g.test(bodyText[i]);
            if(commands[key]) {
                if(isFunction) {
                    const args = bodyText[i].split('(')[1].split(')')[0].split(',').map(e => e.trim());
                    try {
                        final += commands[key].function(...args);
                    } catch (e) {
                        final += `${key} command returned a error: ${e.message}`;
                    }
                } else {
                    final += commands[key].message;
                }
            } else {
                final += `${key} command does not exists`;
            }
        }
    }
    return final;
}

function getCommands() {
    const path = 'commands';
    const dir = fs.readdirSync(path);
    const commands = {};
    dir.forEach(file => {
        const command = JSON.parse(fs.readFileSync(`${path}/${file}`));
        if (command.subcommand) {
            command.function = command.function = new Function(...command.subcommand.args, command.subcommand.function);
        }
        const filename = file.replace(/\..*/g, '');
        commands[filename] = command;
    });

    return commands;
}

function getDayTime() {
    
}

module.exports = {
    parseCommands
};