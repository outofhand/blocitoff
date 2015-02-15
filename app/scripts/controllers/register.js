(function () {
'use strict';

/**
 * @ngdoc function
 * @name blocitoff.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the blocitoff
 */
angular.module('blocitoff')
  .controller('RegisterCtrl', function ($scope, $firebase) {   

    var rootRef = new Firebase('https://glowing-fire-2971.firebaseio.com/');

    $scope.errors = [];
    $scope.registerUser = {
    	email: '',
    	password: '',
    	confirmPassword: ''
    };
    $scope.userLoggedIn = false;

    $scope.register = function() {
    	var errors = [];
    	var user = $scope.registerUser;
    	if (user.email === '') {
    		errors.push('Please enter an email.');
    	}
    	if (user.password === '') {
    		errors.push('Password must not be empty.');
    	}    	
    	else if (user.password !== user.confirmPassword) {
    		errors.push('Passwords must match.');
    	}
    	if (errors.length > 0) {
    		$scope.errors = errors;
    		return;
    	}    	

    	console.log(user.email);
    	console.log(user.password);

    	rootRef.createUser({
	    		email: user.email,
	    		password: user.password
    		}, function(error) {
    			if (error === null) {
				console.log("User created successfully", user);
	    	} else {
				console.log("Error creating user:", error);
	    	}
    	});

	};

    $scope.logout = function() {
        rootRef.unauth();
        $scope.userLoggedIn = false;
    }    

    var authData = rootRef.getAuth();
    if (authData) {
    	$scope.userLoggedIn = true;
    	console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
    	$scope.userLoggedIn = false;
    	console.log("User is logged out");
    }

  });

})();