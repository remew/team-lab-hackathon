'use strict';

console.log('starting socket.io server');
const PORT = 3000;
let io = require('socket.io').listen(PORT);

io.sockets.on('connection', (client) => {
	console.log('connected');
	client.on('request-login', (data) => {
		console.log('logging in');
		let name = data.name;
		let kosen = data.kosen;
		userList.add(name, kosen, client);
		client.emit('response-login', {success: true, data: {_id: client.id}});
	});
});


class User {
	constructor(name, kosen, socket, userListInstance) {
		this._id = socket.id;
		this.name = name;
		this.kosen = kosen;
		this.socket = socket;
		this.userList = userListInstance;
		this.init();
		this.events = {};
	}
	on(eventName, callback) {
		this.events[eventName] = callback;
	}
	fire(eventName) {
		this.events[eventName](this);
	}
	send(data) {
		this.socket.emit('receive-message', data);
	}
	init() {
		this.socket.emit('test');
		this.socket.on('disconnect', () => {
			this.fire('leave');
		});
		this.socket.on('send-message', (data) => {
			console.log(data);
			let message = data.message;
			let target = data.target;
			let kosen = data.kosen;
			let myId = this._id;
			if (message && target) {
				let targetUser = this.userList.findById(target);
				if (targetUser) {
					targetUser.send({
						message: message,
						from: {
							id: myId,
							name: this.name,
							kosen: this.kosen
						}
					});
					console.log('success find target');
				} else {
					console.log('failed find target');
				}
				return;
			}
			if (message && kosen) {
				let targetUser = this.userList.randomByKosen(kosen);
				if (targetUser) {
					targetUser.send({
						message: message,
						from: {
							id: myId,
							name: this.name,
							kosen: this.kosen
						}
					});
					console.log('success find target');
				} else {
					console.log('failed find target');
				}
				return;
			}
		});
	}
}

class UserList {
	constructor() {
		this.init();
	}
	init() {
		this.userList = [];
	}
	add(name, kosen, socket) {
		let user = new User(name, kosen, socket, this);
		user.on('leave', (leaveUser) => {
			this.userList = this.userList.filter(user => {
				return leaveUser._id !== user._id;
			});
		});
		this.userList.push(user);
	}
	findById(id) {
		let result = this.userList.filter((user) => {
			return user.id === id;
		});
		return result[0];
	}
	randomByKosen(kosen) {
		let targets = this.userList.filter((user) => {
			return user.kosen === kosen;
		});
		let length = targets.length;
		return targets[Math.floor(Math.random() * length)];
	}
}

let userList = new UserList();

