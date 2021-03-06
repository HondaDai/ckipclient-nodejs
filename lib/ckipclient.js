var builder = require('xmlbuilder');
var net = require('net');
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var xml2js = require('xml2js');

exports = module.exports = CKIPClient;

util.inherits(CKIPClient, EventEmitter);

function CKIPClient(ip, port, user, pwd){
	this.ip = ip;
	this.port = port;
	this.user = user;
	this.pwd = pwd;
	this.rawText = '';
	this.returnText = '';
	this.term = [];
	this.client = net.createConnection(this.port, this.ip);
	this.sendCallback = null;
}

CKIPClient.prototype.open = function(){
	var self = this;
	this.client.on('data', function(data) {
		console.log('recive response');
		var iconv = new Iconv('Big5', 'UTF-8');
		self.returnText = iconv.convert(data).toString();

		var parser = new xml2js.Parser(xml2js.defaults["0.1"]);
		parser.parseString(self.returnText, function (err, doc) {
        	console.dir(doc.result.sentence);
        	var datePart = doc.result.sentence.split(/\s+/);
        	for(var i=0; i<datePart.length; i++){
        		var group = datePart[i].match(/(\S*)\((\S*)\)/);
        		var term = {};
        		term.term = group[1];
        		term.tag = group[2];
        		console.dir(term);
        		self.term.push(term);
        	}
    	});
		self.sendCallback();
	});

	this.client.on('connect', function() {
  		console.log('client connected');
	});

	this.client.on('end', function() {
  		console.log('client disconnected');
	});
}

CKIPClient.prototype.send = function(txt, callback){
	console.log('send');
	this.rawText = txt;
	this.sendCallback = callback;
	var doc = builder.create('wordsegmentation')
		doc.att('version','0.1');
		doc.ele('option',{'showcategory':'1'});
		doc.ele('authentication',{'username':this.user,'password':this.pwd});
		doc.ele('text',this.rawText);
	
	console.log(doc.end({ pretty: true}));

	var iconv = new Iconv('UTF-8', 'Big5');
  	this.client.write(iconv.convert(doc.end()));
}

CKIPClient.prototype.close = function(){
	console.log('close');
	this.client.end();
}

