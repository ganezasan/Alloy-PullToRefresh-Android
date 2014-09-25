ApiMapper = function(){};
ApiMapper.prototype.apiEndpoint = Alloy.Globals.api_endpoint;
ApiMapper.prototype.apiKey = Alloy.Globals.apikey;
// ApiMapper.prototype.apiEndpoint = Alloy.Globals.app.api_endpoint;
ApiMapper.prototype.accessApi = function(method, uri, param, callback_success, callback_failure) {
		// オフラインなら失敗
		if(Titanium.Network.online == false){
		    return false;
		}
		// var xhr = Titanium.Network.createHTTPClient();
		var xhr = Ti.Network.createHTTPClient();
		xhr.timeout = 30000;
		xhr.onload = callback_success;
		xhr.onerror = callback_failure;
		// xhr.onsendstream = callback_status;
		Ti.API.info(uri);
		xhr.open(method, uri);
		xhr.send(param);

		return true;
};

ApiMapper.prototype.allnews = function (callback_success, callback_failure){
	return this.accessApi('GET', this.apiEndpoint, {}, callback_success, callback_failure);
};


exports.ApiMapper = ApiMapper;