const { parseCommands } = require('./../../../libs/commands');

const __keywords = [];

function load() {
    loadTransitions({
        selector: '.split-side-control',
        value: 'background-color .15s'
    });
}

async function run() {
    const input = document.getElementById('input-email');
    const output = document.getElementById('output-email');
    output.value = await parseCommands(input.value);
}

function highlight(args) {
    if(!args.event) return;
    if(args.event.key.length > 1 && !['Delete', 'Backspace', 'Delete', 'Enter'].includes(args.event.key)) return;
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
            final = final.replace(highlight, `<mark class="highlighter">${highlight}</mark>`);
        }
    }
    highlighter.innerHTML = final;
}

function copy() {
    const output = document.getElementById('output-email');
    output.select();
    document.execCommand('copy');
}

module.exports = {
    load,
    run,
    highlight,
    copy
};
