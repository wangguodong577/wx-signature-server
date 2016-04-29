exports.init = function (app) {
	var wechat_cfg = require('../config/wechat.cfg');
	var http = require('http');
	var cache = require('memory-cache');
	var sha1 = require('sha1'); //签名算法
	//var url = require('url');
	var signature = require('../sign/signature');

	
	app.get('/wechat',function(req,res){
		var url = 'http://www.boruifangzhou.com/demo.html' //获取当前url
		// console.log(url);
		signature.sign(url,function(signatureMap){
			signatureMap.appId = wechat_cfg.appid;
			// res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
			res.header("Access-Control-Allow-Origin", "*");
		    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
		    res.header("X-Powered-By", ' 3.2.1');
		    res.header("Content-Type", "application/json;charset=utf-8");
			res.end(JSON.stringify(signatureMap));
			// res.send(signatureMap);
			// res.render('index',signatureMap);
			// console.log(signatureMap)
		});
	});

	app.get('/wechat/code',function(req,res){
		app.get('https://open.weixin.qq.com/connect/oauth2/authorize',req.initParams, function(req,res){
		});
	});

    app.post('/wechat',function(req,res){
     	   var url = req.body.url; //获取当前url
       	 signature.sign(url,function(signatureMap){
                signatureMap.appId = wechat_cfg.appid;
                // res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
                res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By", ' 3.2.1');
            res.header("Content-Type", "application/json;charset=utf-8");
                res.end(JSON.stringify(signatureMap));
                // res.send(signatureMap);
                // res.render('index',signatureMap);
                // console.log(signatureMap)
        });
    });
};
