var express = require('express')
, mongoose = require('mongoose')
, app = express()
, server = require('http').Server(app)
, io = require('socket.io')(server);

// Database
mongoose.connect('mongodb://localhost/chat', function(err) {
	if (err) throw err;
	console.log("Connected to database.");
});

var chatSchema = mongoose.Schema({
	msg: String,
	date: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

// Server
app.use(express.static(__dirname + '/src'));

io.on('connection', function(socket){
  
  console.log("An user has connected.");

  socket.on('hey', function(msg){
    console.log('message: ' + msg);

    var messa = new Chat({msg: msg});

    messa.save(function(err) {
    	if (err) throw err;
    	io.emit('hey', msg);
    });

  });

  socket.on('disconnect', function () {
  	console.log("An user has disconnected.");
  });
});

app.get('/api/messages', function (req, res) {

  console.log("What's up? Anybody called me?")

  Chat.find({}, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });

});

server.listen(3000, function() {
	console.log("App listening on port 3000");
});