const electron = require('electron');
const { app, BrowserWindow } = electron;

app.on('ready', onReady);

function onReady() {
    let win = new BrowserWindow({
        icon: `${__dirname}/images/app.ico`,
    });
    win.maximize();

    win.webContents.on('new-window', (event, url) => {
        event.preventDefault();

        const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

        const modalWin = new BrowserWindow({
            icon: `${__dirname}/images/app.ico`,
            width: width * .9,
            height: height * .9,
            parent: win,
            modal: true,
            title: "The website is loading..."
        });

        modalWin.setMenu(null);

        modalWin.once('ready-to-show', () => modalWin.show());
        modalWin.loadURL(url);
        event.newGuest = modalWin;
    })

    win.loadURL(`file://${__dirname}/index.html`);
}