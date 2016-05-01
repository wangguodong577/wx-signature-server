var request = require('request'),
	cache = require('memory-cache'),
	sha1 = require('sha1'),
	config = require('../config/wechat.cfg'),
	noncestr = '',
	ticketMap='';

exports.sign = function (url,callback) {
	var timestamp = Math.floor(Date.now()/1000), //精确到秒
		jsapi_ticket;
	if(cache.get('ticket') && cache.get('accessToken')){
		jsapi_ticket = cache.get('ticket');
		console.log('1' + 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url + '&accessToken=' + cache.get('accessToken'));
		callback({
			accessToken: cache.get('accessToken'),
			noncestr:noncestr,
			timestamp:timestamp,
			url:url,
			jsapi_ticket:jsapi_ticket,
			signature:sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
		});
	}else{
		request(config.accessTokenUrl + '?grant_type=' + config.grant_type + '&appid=' + config.appid + '&secret=' + config.secret ,function(error, response, body){
			if (!error && response.statusCode == 200) {
				tokenMap = JSON.parse(body);
				request(config.ticketUrl + '?access_token=' + tokenMap.access_token + '&type=jsapi', function(error, resp, json){
					if (!error && response.statusCode == 200) {
						ticketMap = JSON.parse(json);
						cache.put('ticket',ticketMap.ticket,config.cache_duration);  //加入缓存
						cache.put('accessToken', tokenMap.access_token, config.cache_duration);
						noncestr = Math.random().toString(36).substr(2, 15);
						console.log('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url + '&accessToken=' + tokenMap.access_token);
						callback({
							accessToken: tokenMap.access_token,
							noncestr:noncestr,
							timestamp:timestamp,
							url:url,
							jsapi_ticket:ticketMap.ticket,
							signature:sha1('jsapi_ticket=' + ticketMap.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
						});
					}
				})
			}
		})
	}
}
