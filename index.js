const { app, BrowserWindow } = require('electron');
const { updateCommands } = require('./libs/commands');
let win;
// Stating the application

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createMainWindow();
    }
});

// Window Constructors

function createMainWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 710,
        minWidth: 900,
        minHeight: 710,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });
    
    updateCommands();

    win.removeMenu();

    win.on('ready-to-show', () => {
        win.show()
    });

    win.loadFile('app/pages/main.html').catch(console.log);

    win.on('closed', () => {
        win = null;
    });
}
