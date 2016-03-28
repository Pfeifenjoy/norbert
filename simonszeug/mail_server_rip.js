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

    // By default only PLAIN and LOGIN are enabled
    authMethods: ['PLAIN', 'LOGIN', 'CRAM-MD5'],

    // Accept messages up to 10 MB
    size: 10 * 1024 * 1024,

    // allow overriding connection properties. Only makes sense behind proxy
    useXClient: true,

    // use logging of proxied client data. Only makes sense behind proxy
    useXForward: true,

    // Setup authentication
    // Allow only users with username 'testuser' and password 'testpass'
  
    

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