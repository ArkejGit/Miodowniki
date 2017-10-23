const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require("fs");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let episodes = {};

//SET ENV
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

//listen for the app to be ready
app.on('ready', function() {
	//create new window
	mainWindow = new BrowserWindow({show: false});
	//load html into Window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	//quit app when closed
	mainWindow.on('closed', function(){
		app.quit();
		console.log('quit')
	})

	//build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//insert menu
	//Menu.setApplicationMenu(mainMenu);
	Menu.setApplicationMenu(null);
	//loadEpisodes and show mainWindow
	mainWindow.on('ready-to-show', function(){
		loadEpisodes();
		mainWindow.show();
	})
	
});

//create menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Load episodes',
				click(){
					loadEpisodes();
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

//if Mac, add empty object to menu
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

//add developer tools if not in production
if(process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle devTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(){
					app.quit();
				},
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	})
}

//load Episodes
function loadEpisodes() {

	fs.readdir(path.join(__dirname, 'episodes/'), (err, files) => {
		if (err) {
			throw err;
		};

		files.map(episode => {
			let season = episode.split('.')[1].slice(1);
			if (!(episodes.hasOwnProperty('season' + season))) {
				episodes['season' + season] = [];
			}
			episodes['season' + season].push({
				title: episode.split('-')[1].slice(1, -4),
				episode: episode.split('.')[0],
				season: episode.split('.')[1].slice(1),
				fileName: episode
			}); 
		});

		mainWindow.webContents.send('loadEpisodes', episodes);
	});
}	