const beautify = require('js-beautify').js;
const {
    updateCommands
} = require('./../../../libs/commands');

function load() {
    loadTransitions({
        selector: '.command-class-controls *, .command-modal button',
        value: 'background-color .15s'
    }, {
        selector: '.command-modal input',
        value: 'border-bottom .3s'
    });
    const main = loadJSON('commands/main.json');
    const custom = loadJSON('commands/custom.json');

    const mainList = document.getElementById('command-main-list');
    const customList = document.getElementById('command-custom-list');

    mainList.innerHTML = '';
    for (const key in main) {
        if (main.hasOwnProperty(key) && key.charAt(0) !== '_') {
            createListItem(mainList, {
                key: key,
                content: main[key]
            });
        }
    }

    customList.innerHTML = '';
    for (const key in custom) {
        if (custom.hasOwnProperty(key)) {
            createListItem(customList, {
                key: key,
                content: custom[key]
            });
        }
    }
}

function createListItem(dest, data) {
    const item = document.createElement('div');
    item.className = 'command-list-item';
    item.innerHTML = `<h1 class="command-list-item-title">${data.key}</h1><ul class="command-list-item-data"><li>Mensagem<span>${data.content.message}</span></li>${data.content.subcommand ? `<li>Sub-comando<span class="command-function-block">function (${typeof data.content.subcommand.args === 'object' ? data.content.subcommand.args.join(', ') : ''}) {<br/>&nbsp&nbsp&nbsp&nbsp${beautify(data.content.subcommand.function, { indent_size: 4, space_in_empty_paren: true }).replace(/\n/gm, '<br/>&nbsp&nbsp&nbsp&nbsp').replace(/\s/gm, '&nbsp')}<br/>}</span></li>` : ''}</ul>`;
    dest.appendChild(item);
}

function toggleList(args) {
    if (!args.list) return;
    if (args.list.style.display !== 'none') {
        args.list.style.display = 'none';
    } else {
        args.list.style.display = 'initial';
    }
}

async function update() {
    await updateCommands();
    load();
}

function add() {
    showMsgBox('Work in Progress');
}

module.exports = {
    load,
    toggleList,
    update,
    add
};