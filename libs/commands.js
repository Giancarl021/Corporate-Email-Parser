const fs = require('fs');
const fetch = require('node-fetch');

async function parseCommands(text) {
    const commands = await getCommands();
    let final = text;
    const regex = /(\${[^}]*?})/gm;
    const bodyText = text.match(regex);
    console.log(commands);
    for (const match of bodyText) {
        const data = match.replace(/[\$\{\}]/gm, '');
        const key = data.replace(/\(.*\)/g, '');
        const isFunction = /\(.*\)/g.test(data);
        let r;
        if (commands[key]) {
            if (isFunction) {
                const args = match.split('(')[1].split(')')[0].split(',').map(e => e.trim());
                try {
                    r = commands[key].function(...args);
                } catch (e) {
                    r = `[${key} command returned a error: ${e.message}]`;
                }
            } else {
                r = commands[key].message;
            }
        } else {
            r = `[${key} command does not exists]`;
        }
        final = final.replace(match, r);
    }
    return final;
}

async function getCommands() {
    const commands = {
        main: require('./../commands/main'),
        custom: require('./../commands/custom')
    };

    return parseFunctions({
        ...commands.main,
        ...commands.custom
    });

    function parseFunctions(commands) {
        for (const key in commands) {
            if (!commands.hasOwnProperty(key) || key.charAt(0) === '_') continue;
            const command = commands[key];
            if (command.subcommand) {
                command.function = new Function(...command.subcommand.args, command.subcommand.function);
            } else {
                command.function = function () {
                    return `[${key} command does not have a function]`;
                };
            }
        }
        return commands;
    }
}

async function updateCommands() {
    const local = require('../commands/main');

    try {
        const filename = 'corporate-email-parser-main.json';
        const data = await fetchJSON('https://api.github.com/gists/f19da3e6b16f68eea5f1088549ec2352');

        if (local._lastUpdate === data.updated_at) return;

        if (data.files[filename].truncate) {
            try {
                const content = await fetchJSON(data.files[filename].raw_url);
                content._lastUpdate = data.updated_at;
                fs.writeFileSync('commands/main.json', JSON.stringify(content));
            } catch (e) {
                // Failed to fetch Commands from server
            }
        } else {
            const content = JSON.parse(data.files[filename].content);
            content._lastUpdate = data.updated_at;
            fs.writeFileSync('commands/main.json', JSON.stringify(content));
            r = content;
        }
    } catch (e) {
        // Failed to fetch Commands from server
    }

    async function fetchJSON(url) {
        const response = await fetch(url);
        return await response.json();
    }
}

module.exports = {
    parseCommands,
    updateCommands
};