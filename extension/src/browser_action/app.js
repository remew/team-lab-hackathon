

generateKosenList();
registSendButton();

chrome.extension.onMessage.addListener((data) => {
	console.log(data);
	//alert(data.message);
});

function generateKosenList() {
	var list = document.getElementById('new_message_kosen_id');
	var length = kosenList.length;
	for (var i = 0; i < length; i++) {
		var option = document.createElement('option');
		option.setAttribute('value', i + 1);
		option.innerText = kosenList[i].name;
		list.appendChild(option);
	}
}

function registSendButton() {
	var btn = document.getElementById('sendButton');
	btn.addEventListener('click', () => {
		var kosen = document.getElementById('new_message_kosen_id').value;
		var message = document.getElementById('new_message_id').value;
		//alert('kosen:' + kosen + ' msg:' + message);
		sendFirstMessage('test', kosen, message);
	});
}

function sendFirstMessage(name, kosen, message) {
	chrome.extension.sendMessage({
		method: 'send-message',
		data: {
			name: name,
			kosen: kosen,
			message: message
		}
	});
}

