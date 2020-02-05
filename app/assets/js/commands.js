const beautify = require('js-beautify').js;

const {
    updateCommands
} = require('./../../../libs/commands');

function load() {
    loadTransitions({
        selector: '.command-class-controls *, .command-modal button, .command-list-item-controls img',
        value: 'background-color .15s'
    }, {
        selector: '.command-modal input',
        value: 'border-bottom .3s'
    }, {
        selector: '.command-modal, #error-text',
        value: 'opacity .3s'
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
            }, true);
        }
    }
}

function createListItem(dest, data, hasControls = false) {
    const item = document.createElement('div');
    item.className = 'command-list-item';
    item.innerHTML = `<h1 class="command-list-item-title">${data.key}</h1>${hasControls ? '<div class="command-list-item-controls"><img src="../assets/img/write.svg" onclick="local(\'editCommand\', {command: this.parentElement.parentElement.getElementsByClassName(\'command-list-item-title\')[0].innerText})" title="Editar Comando" alt="edit"/><img src="../assets/img/delete.svg" onclick="local(\'deleteCommand\', {command: this.parentElement.parentElement.getElementsByClassName(\'command-list-item-title\')[0].innerText})" title="Excluir Comando" alt="delete"/></div>': ''}<ul class="command-list-item-data"><li>Mensagem<span>${data.content.message}</span></li>${data.content.subcommand ? `<li>Sub-comando<span class="command-function-block">function (${typeof data.content.subcommand.args === 'object' ? data.content.subcommand.args.join(', ') : ''}) {<br/>&nbsp&nbsp&nbsp&nbsp${beautify(data.content.subcommand.function, { indent_size: 4, space_in_empty_paren: true }).replace(/\n/gm, '<br/>&nbsp&nbsp&nbsp&nbsp').replace(/\s/gm, '&nbsp')}<br/>}</span></li>` : ''}</ul>`;
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

function loadArgs(args) {
    const span = document.getElementById('function-args-preview');
    if (!args.args) span.innerHTML = '';
    span.innerHTML = '<span class="args-color">' + args.args.replace(/\s/g, '').split(',').join('</span>, <span class="args-color">') + '</span>';

}

function add(data = undefined) {
    const modal = document.getElementsByClassName('command-modal')[0];
    if (data) {
        const form = document.getElementById('command-form');
        const inputs = [...form.getElementsByTagName('input'), ...form.getElementsByTagName('textarea')];
        inputs[0].value = data.key;
        inputs[1].value = data.message;
        if (data.subcommand) {
            inputs[2].checked = true;
            inputs[3].value = data.subcommand.args.join(', ');
            inputs[4].value = beautify(data.subcommand.function, {
                indent_size: 4,
                space_in_empty_paren: true
            })
        }
    }
    addClass(modal, 'modal-enabled');
}

function serializeCommand() {
    const form = document.getElementById('command-form');
    const inputs = [...form.getElementsByTagName('input'), ...form.getElementsByTagName('textarea')];
    const data = {};
    let hasSubcommand = false;
    for (const input of inputs) {
        if ((input.hasAttribute('required') || (input.tagName === 'TEXTAREA' && hasSubcommand)) && input.value.length === 0) {
            showErr();
            return;
        } else {
            data[input.id] = input.value;
        }
        if (input.type === 'checkbox' && input.checked) {
            hasSubcommand = true;
        }
    }

    const command = {
        message: data.message
    };

    if (hasSubcommand) {
        command.subcommand = {
            args: data['function-args'].replace(/\s/gm, '').split(','),
            function: data['function-body'].replace(/\n/gm, '')
        }
    }

    const json = loadJSON('commands/custom.json');
    json[data.name] = command;
    saveJSON('commands/custom.json', json);
    load();
    closeModal();

    function showErr() {
        document.getElementById('error-text').style.opacity = '1';
    }
}

function closeModal() {
    removeClass(document.getElementsByClassName('command-modal')[0], 'modal-enabled');
    document.getElementById('error-text').style.opacity = '0';
}

function editCommand(args) {
    if (!args.command) return;
    const data = loadJSON('commands/custom.json')[args.command];
    data.key = args.command;
    add(data);
}

function deleteCommand(args) {
    if (!args.command) return;
    const data = loadJSON('commands/custom.json');
    delete data[args.command];
    saveJSON('commands/custom.json', data);
    load();
}

module.exports = {
    load,
    toggleList,
    update,
    add,
    loadArgs,
    serializeCommand,
    closeModal,
    editCommand,
    deleteCommand
};