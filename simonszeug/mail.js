/* eslint no-console: 0 */


'use strict';


// Replace '../lib/smtp-server' with 'smtp-server' when running this script outside this directory
var SMTPServer = require('smtp-server').SMTPServer;
var util = require('util');

var SERVER_PORT = 2525;
var SERVER_HOST = '127.0.0.1';

// Connect to this example server by running
//   telnet localhost 2525
// or
//   nc -c localhost 2525

// Authenticate with this command (username is 'testuser' and password is 'testpass')
//   AUTH PLAIN dGVzdHVzZXIAdGVzdHVzZXIAdGVzdHBhc3M=

// Setup server
var server = new SMTPServer({

    // log to console
    logger: true,

    // not required but nice-to-have
    banner: 'Welcome to My Awesome SMTP Server',

    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: ['STARTTLS'],

    

    // Accept messages up to 10 MB
    size: 10 * 1024 * 1024,


    // Handle message stream
    onData: function (stream, session, callback) {
        stream.pipe(process.stdout);
        stream.on('end', function () {
            var err;
            if (stream.sizeExceeded) {
                err = new Error('Error: message exceeds fixed maximum message size 10 MB');
                err.responseCode = 552;
                return callback(err);
            }
            callback(null, 'Message queued as abcdef'); // accept the message once the stream is ended
        });
    }
});

server.on('error', function (err) {
    console.log('Error occurred');
    console.log(err);
});

// start listening
server.listen(SERVER_PORT, SERVER_HOST);



'use strict';

/*
 * require installation of smtp-connection and its dependancies:
 * # npm install nodemailer-direct-transport nodemailer-smtp-transport nodemailer-smtp-pool smtp-connection
 */
var SMTPConnection = require('smtp-connection');

var connectionConfig = {
    host: 'localhost', // remote SMTP server address
    port: 2525,
    ignoreTLS: true,
    secure: false,
    //authMethod: 'CRAM-MD5', // can be 'LOGIN' or 'CRAM-MD5' if authentication is required
    
    //debug: true,
    
    name: 'mylocalcomputer.provider.com' // local connection address (for EHLO message)
};

var connectionAuth = {
	user: 'username',
	pass: 'password'
};

var sender = {
	name: 'Super sendor', // please use [a-zA-Z0-9.- ]
	email: 'me@supersendor.net'
};

var recipient = {
	name: 'Test recipient', // please use [a-zA-Z0-9.- ]
	email: 'test@recipient.net'
};

// below you don't have to configure anything

var now = new Date();
var testMsg = 'From: '+sender.name+' <'+sender.email+'>\r\n'
	+ 'To: '+recipient.name+' <'+recipient.email+'>\r\n'
	+ 'Subject: Test message on '+now+'\r\n'
	+ '\r\n'
	+'This is a test message\n\n'
	+'On '+now;

var connection = new SMTPConnection(connectionConfig);

connection.connect(function() {
	console.log('Connected');
	
	/*connection.login(connectionAuth, function(err) {
		if (err !== null) {
			console.log('login err: '+err);
		} else {
			console.log('Authenticated');
			*/
			var now = new Date();
			connection.send({
				from: sender.email,
				to: recipient.email
			}, testMsg, function(err) {
				console.log('Message sent');
				connection.quit();
			});
		
	});


// works only if connectionConfig.debug === true
connection.on('log', function(data) {
	console.dir(data);
});

connection.on('error', function(err) {
	console.log('Error occurred: '+err);
});
