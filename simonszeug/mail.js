var SMTPServer = require('smtp-server').SMTPServer;
var server = new SMTPServer({
    onData: function(stream, session, callback){
        stream.pipe(process.stdout); // print message to console
        stream.on('end', callback);
    }
});

server.listen(465);