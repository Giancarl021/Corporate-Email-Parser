const { parseCommands } = require('./../../../libs/commands');

function load() {
    loadTransitions({
        selector: '.split-side-control',
        value: 'background-color .15s'
    });

    document.getElementById('input-email').value = inputCache;
}

async function run() {
    const input = document.getElementById('input-email');
    const output = document.getElementById('output-email');
    output.value = await parseCommands(input.value);
}

function highlight(args) {
    if (!args.event) return;
    if (args.event.key.length > 1 && !['Delete', 'Backspace', 'Delete', 'Enter'].includes(args.event.key)) return;
    const highlighter = document.getElementById('input-highlight');
    const text = document.getElementById('input-email').value;
    let final = text;
    if (!text) {
        highlighter.innerHTML = '';
        return;
    }
    const regex = /(\${[^}]*?})/gm;
    const highlights = text.match(regex);
    if (!highlights) {
        final = final.replace(/<mark\sclass="highlighter">.*?<\/mark>/gm, '')
    } else {
        for (const highlight of highlights) {
            final = final.replace(new RegExp(`(?!<mark\\sclass="highlighter">)${highlight.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}(?!<\\/mark>)`, 'gm'), `<mark class="highlighter">${highlight}</mark>`);
        }
    }
    highlighter.innerHTML = final;
}

function copy() {
    const output = document.getElementById('output-email');
    output.select();
    document.execCommand('copy');
}

function unload() {
    inputCache = document.getElementById('input-email').value;
}

module.exports = {
    load,
    run,
    highlight,
    copy,
    unload
};
