(function () {
'use strict';

/**
 * @ngdoc function
 * @name blocitoff.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the blocitoff
 */
angular.module('blocitoff')
  .controller('LoginCtrl', LoginCtrl);

   function LoginCtrl($scope, $firebase, $firebaseAuth, $q, $timeout, $state) {
    $scope.errors = [];
    $scope.loginUser = {
    	email: '',
    	password: ''
    };
    $scope.userLoggedIn = false;
    $scope.authData = null;

	var rootRef = new Firebase('https://glowing-fire-2971.firebaseio.com/');
	var auth = $firebaseAuth(rootRef);
	rootRef.onAuth(authDataCallback);

	// Create a callback which logs the current auth state
	function authDataCallback(authData) {
		if (authData) {
		  $scope.authData = authData;
		  $scope.userLoggedIn = true;
		} else {
		  $scope.userLoggedIn = false;
		}
	}

	// Create a callback to handle the result of the authentication
	function authHandler(error, authData) {
		if (authData) {
		  userLoggedIn = true;
		  userinfo = authData;
		} else {
		  userLoggedIn = false;
		  userinfo = 0;
		}
	} 	

	function dologin(user1) {
	      var deferred = $q.defer();
	      var user = user1;

	      auth.$authWithPassword({
	        email : user.email,
	        password : user.password
	      }, authHandler, {
	        remember: "sessionOnly"
	      });

	      deferred.resolve($scope.authData);
	      return deferred.promise;

	    }	

    $scope.login = function() {
		var errors = [];
		var user = $scope.loginUser;
        if (user.email === '') {
          errors.push('Please enter an email.');
        }
        if (user.password === '') {
          errors.push('Password must not be empty.');
        }     
        if (errors.length > 0) {
      		 $scope.errors = errors;
      		 return;
        }      

		rootRef.authWithPassword({
			"email": user.email,
			"password": user.password
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				 $scope.userLoggedIn = true;			 
				console.log("Authenticated successfully with payload:", authData);
				$state.go('task');
			}
		});

    }

    $scope.logout = function() {
    	rootRef.unauth();
    	$scope.userLoggedIn = false;
    }

  };


})();