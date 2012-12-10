var CKIPClient = require('../');

describe('ckipclient', function(){
	describe('.send()', function(){
		var client = new CKIPClient('127.0.0.1', 9999, 'user', 'pwd');
		it('should send text to CKIP server', function(done){
			client.send('台新金控12月3日將召開股東臨時會進行董監改選。');
		})
	})
})