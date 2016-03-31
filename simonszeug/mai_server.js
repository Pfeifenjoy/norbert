var SMTPServer = require('smtp-server').SMTPServer;
var server = new SMTPServer({
	onAuth: function(auth, session, callback){
        if(auth.username !== 'abc' || auth.password !== 'def'){
            return callback(new Error('Invalid username or password'));
        }
        callback(null, {user: 123}); // where 123 is the user id or similar property
    }
    onData: function(stream, session, callback){
        stream.pipe(process.stdout); // print message to console
        stream.on('end', callback);
    }
});

server.listen(465,127.0.0.1);