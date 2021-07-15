const ws = require("ws");
const url = require("url");
const express = require("express");
const debug = require('debug')('express-learn:server');
const http = require('http');
const json_server = require("./json-server");
const text_server = require('./text-server');

const app = express();
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3008');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const wss = new ws.Server({
    noServer: true,
    perMessageDeflate: false
});
server.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? url.parse(request.url).pathname : undefined;
    // console.log(1,pathname);
    if (pathname === '/jsonServer') {
        wss.handleUpgrade(request, socket, head, webSocket => {
            const socket = {
                send: content => webSocket.send(content, error => {
                    if (error) {
                        throw error;
                    }
                }),
                onMessage: cb => webSocket.on('message', cb),
                onError: cb => webSocket.on('error', cb),
                onClose: cb => webSocket.on('close', cb),
                dispose: () => webSocket.close()
            };
            // launch the server when the web socket is opened
            if (webSocket.readyState === webSocket.OPEN) {
                json_server.launch(socket);
            }
            else {
                webSocket.on('open', () => json_server.launch(socket));
            }
        });
    } else if ('/textServer') {
        wss.handleUpgrade(request, socket, head, webSocket => {
            const socket = {
                send: content => webSocket.send(content, error => {
                    if (error) {
                        throw error;
                    }
                }),
                onMessage: cb => webSocket.on('message', cb),
                onError: cb => webSocket.on('error', cb),
                onClose: cb => webSocket.on('close', cb),
                dispose: () => webSocket.close()
            };
            // launch the server when the web socket is opened
            if (webSocket.readyState === webSocket.OPEN) {
                text_server.launch(socket);
            }
            else {
                webSocket.on('open', () => text_server.launch(socket));
            }
        });
    } else {
        console.log('no match language server');
    }
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
