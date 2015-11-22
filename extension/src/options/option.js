
generateKosenList();
registSendButton();

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
		var nickname = document.getElementById('nickname_input').value;
		saveUser(nickname, kosen);
		//sendFirstMessage('test', kosen, message);
	});
}

function saveUser(name, kosen) {
	chrome.storage.local.set({name: name, kosen: kosen}, function() {
		console.log(arguments);
	});
}

