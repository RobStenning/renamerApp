const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let mainWindow;

//listen for app ready
app.on('ready', function() {
    //create new window
    mainWindow = new BrowserWindow({});
    //load html file
    
})