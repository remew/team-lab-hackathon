//example of using a message handler from the inject scripts
//


var socket = null;
chrome.extension.onMessage.addListener(function(data) {
	socket.emit(data.method, data.data);
});

chrome.storage.local.get(['name', 'kosen'], function(data) {
	var nickname = data.name;
	var kosen = data.kosen;
	login(nickname, kosen);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	var nickname = changes.name.newValue;
	var kosen = changes.kosen.newValue;
	login(nickname, kosen);

	socket.on('receive-message', function(data) {
		console.log('receive');
		console.log(data);
		chrome.runtime.sendMessage(data);
	});
});

var login = function(name, kosen) {
	const HOST = 'http://153.126.186.8:3000';
	if (socket) {
		socket.close();	
	}
	socket = io.connect(HOST);
	socket.emit('request-login', {
		name: name,
		kosen: kosen
	});
}

