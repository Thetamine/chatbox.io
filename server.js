var app = require('express')();
var http = require('http').Server(app);
var port_number = process.env.PORT || 3000;
var io = require("socket.io")(http);
var people = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/home.html');
});

io.on('connection', function(socket){
    
    socket.on('join', function(name){
        people[socket.id] = name;
        io.emit('update', name + ' has connected to the chat room');
        io.emit('update-people', people);
    });
    
    socket.on("send", function(msg){
        io.emit('chat', people[socket.id], msg)
    });
    
    socket.on('disconnect', function(){
        io.emit('update', people[socket.id] + ' has left the server.');
        delete people[socket.id];
        io.emit('update-people', people);
    });
    
});

//We make the http server listen on port 3000
http.listen(port_number, function() {
    console.log('listening on localhost:' + port_number);
});