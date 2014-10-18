angular.module('main', [])

.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	
	$http.get('/api/messages')
		.success(function (callback) {
			$scope.messages = callback;
		}).error(function (err) {
			console.log("Error: " + err);
		});

	var socket = io.connect('http://localhost:3000');
	$scope.send = function (message) {
		socket.emit('hey', message);
		$scope.message = "";
	}

	socket.on('hey', function (msg) {
		
		// Save data locally in order to avoid unnecessary server calls.
		$scope.messages.push({msg: msg});

		// Because the app is making changes outside the Angular context
		// (i.e. the code that changes models is wrapped outside $apply()),
		// it's necessary to inform Angular about it.
		$scope.$digest();

		// Scroll to bottom after have displayed the last message.
		var element = document.getElementById("chat");
		element.scrollTop = element.scrollHeight;
	});

}]);