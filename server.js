var express = require('express');
var path = require('path');

var app = express();
app.use('/js', express.static(__dirname + '/dist/js'));
app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/img', express.static(__dirname + '/dist/img'));
app.get(['/:page?'], function (req, res) {
	req.server_path = path.join(__dirname, 'dist');
	if(req.params.page){
		res.sendFile(req.server_path+'/'+req.params.page);
	}else{
		res.sendFile(req.server_path+'/index.html');
	}
});

//start listen
var server = app.listen(80, function () {
  console.log("-------server start on 80-------");
});