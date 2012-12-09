var builder = require('xmlbuilder');
var net = require('net');
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;

var rawText = ''
var returnText = '';
var term = [];

exports.send = function(){
	var testString = "台新金控12月3日將召開股東臨時會進行董監改選。";
	var root = builder.create('wordsegmentation')
		root.att('version','0.1');
		root.ele('option',{'showcategory':'1'});
		root.ele('authentication',{'username':'username','password':'password'});
		root.ele('text',testString);
	
	console.log(root.end({ pretty: true}));

	var output = root.end();

	var iconv = new Iconv('UTF-8', 'Big5');
	var buffer = iconv.convert(output);

	var client = net.connect({host: 'serverIp', port: port},
    function() { //'connect' listener
  		console.log('client connected');
  		client.write(buffer);
	});
	client.on('data', function(data) {
		var iconv2 = new Iconv('Big5', 'UTF-8');
		var b2 = iconv2.convert(data);
  		console.log(b2.toString());
  		client.end();
	});
	client.on('end', function() {
  		console.log('client disconnected');
	});
}