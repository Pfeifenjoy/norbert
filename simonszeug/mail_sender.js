var SMTPConnection = require('smtp-connection');
var connection = new SMTPConnection({port : '2525', host : '127.0.0.1'});

console.log('A');
connection.on('error', function(error){
	console.log(error);
});

connection.connect(function () {
	connection.wrtie('EHLO example.com\r\n');
	console.log('Connected');
	console.log('Kappa');
	connection.send({from : '{simon@localhost.local}',to : '{ossi@osslack.local}'}, 'Kappa',function (error,info) {
	//console.log(error);
	console.log(info);
});
});



connection.quit();

