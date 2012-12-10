var builder = require('xmlbuilder');
var net = require('net');
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;

exports = module.exports = CKIPClient;

function CKIPClient(ip, port, user, pwd){
	this.ip = ip;
	this.port = port;
	this.user = user;
	this.pwd = pwd;
	this.rawText = '';
	this.returnText = '';
	this.term = [];
}

CKIPClient.prototype.send = function(txt){
	this.rawText = txt;
	var doc = builder.create('wordsegmentation')
		doc.att('version','0.1');
		doc.ele('option',{'showcategory':'1'});
		doc.ele('authentication',{'username':this.user,'password':this.pwd});
		doc.ele('text',this.rawText);
	
	console.log(doc.end({ pretty: true}));

	var client = net.connect({host: this.ip, port: this.port},
    function() { //'connect' listener
  		console.log('client connected');
  		var iconv = new Iconv('UTF-8', 'Big5');
  		client.write(iconv.convert(doc.end()));
	});
	client.on('data', function(data) {
		var iconv = new Iconv('Big5', 'UTF-8');
  		console.log(iconv.convert(data).toString());
  		client.end();
	});
	client.on('end', function() {
  		console.log('client disconnected');
	});
}