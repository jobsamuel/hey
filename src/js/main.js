angular.module('main', [])

.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
	
	$http.get('http://localhost:3000/api/messages')
		.success(function (callback) {
			$scope.messages = callback;
		});

	var socket = io.connect('http://localhost:3000');
	
	$scope.send = function (message) {
		socket.emit('hey', message);
		$scope.message = "";
	}

	socket.on('hey', function (msg) {
		// Save data locally; avoid the unnecessary server calls.
		$scope.messages.push({msg: msg});

		// Because the app is making changes outside the Angular context
		// (i.e. the code that changes models is wrapped outside $apply()),
		// it's necessary to inform Angular about that change.
		$scope.$digest();
	});

}]);