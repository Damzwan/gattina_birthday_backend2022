const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080', "https://gattin.herokuapp.com/"]
    }
});

let connections = {'Damian': null, 'Aurora': null}
let storage = {'Damian': null, 'Aurora': null}


app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        if (connections['Damian'] === socket.id) connections['Damian'] = null
        else connections['Aurora'] = null
    });

    socket.on('identify', (msg) => {
        connections[msg] = socket.id;
        if (storage[msg] != null) {
            io.to(connections[msg]).emit('sendCanvas', storage[msg]);
            storage[msg] = null
        }

    });

    socket.on('sendCanvas', (msg) => {
        targetSocket = connections[msg.target]

        if (targetSocket != null) {
            io.to(targetSocket).emit('sendCanvas', msg.canvasInformation);
        } else storage[msg.target] = msg.canvasInformation


    });
});


http.listen(3000, () => {
    console.log('listeninghttp on *:3000');
});