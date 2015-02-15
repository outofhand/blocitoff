(function () {
/*global Firebase*/
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebase service
 * - exposes the model to the template and provides event handlers
 */

function activeTasks() {
	return function(todos, filterOptions) {
	  var resultArr = [];
	  var today = new Date();

	  	switch(filterOptions) {

	  		case 'A':
				angular.forEach(todos, function(todo) {
					var taskDate = new Date(todo.duedate);
					if (todo.completed == false && taskDate >= today) {
					  resultArr.push(todo);
					}
				});
				break;

	  		case 'C':
				angular.forEach(todos, function(todo) {
					var taskDate = new Date(todo.duedate);
					if (todo.completed == true && taskDate >= today) {
					  resultArr.push(todo);
					}
				});
			    break;

	  		case 'E':
				angular.forEach(todos, function(todo) {
					var taskDate = new Date(todo.duedate);
					//taskDate.setDate(taskDate.getDate()+7);
					if (taskDate < today ) {
					  resultArr.push(todo);
					}
				});
			    break;	
		    default:
				angular.forEach(todos, function(todo) {
					resultArr.push(todo);
				});		    		    
		}

	  return resultArr;
	};    
} 

angular.module('blocitoff')

  .filter('activeTasks', activeTasks)

  .directive('jqdatepicker', function() {
		return {
		    restrict: 'A',
		    require: 'ngModel',
		    link: function(scope, element, attrs, ctrl) {
		        $(element).datepicker({
		            dateFormat: 'yy-mm-dd',
		            onSelect: function(date) {
		                ctrl.$setViewValue(date);
		                ctrl.$render();
		                scope.$apply();
		            }
		        });
		    }
		};
	})

  .controller('TaskCtrl', TaskCtrl);

  function TaskCtrl($scope, $firebase) {  

	  $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };

	  // Disable weekend selection
	  $scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	  };

	  $scope.toggleMin = function() {
	    $scope.minDate = $scope.minDate ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

    $scope.priorities = [
      {name: 'Low', rank: 3},
      {name: 'Medium', rank: 2},
      {name: 'High', rank: 1}
    ];
    $scope.newTask = null;
    $scope.newTaskPriority = $scope.priorities;
    $scope.newTaskDate = new Date();  	
    $scope.authData = null;
    $scope.userLoggedIn = false;
    $scope.isCollapsed = false;
    $scope.filterOptions = 'D';
    $scope.newTaskPriority = $scope.priorities[0];

	$scope.$watch('todos', function () {

		var total = 0;
		var remaining = 0;

		angular.forEach($scope.todos, function(todo) {
			total++;
			if (todo.completed === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.completedCount = total - remaining;
	}, true);

	$scope.addTodo = function () {
		var today = new Date();
		var dateDue = today.toString();
		var newTodo = $scope.newTask.trim();
        var newPriority = $scope.newTaskPriority.rank;  
        var newDueDate = $scope.dt.toString();   

		$scope.todos.$add({
			task: newTodo,
			completed: false,
			priority: newPriority,
			duedate: newDueDate
		});
		$scope.newTask = '';
		$scope.newTaskPriority = null;
	};

	$scope.removeTask = function (id) {
		$scope.todos.$remove(id);
	};

	$scope.toggleTask = function (todo) {
      var currTask = $scope.todos.$getRecord(todo.$id); 
      currTask.completed = !currTask.completed;
      $scope.todos.$save(currTask).then(function() {
        // data has been saved.
      });

	};	

    $scope.statusCheck = function(todo) {
		var today = new Date();
		var taskDate = new Date(todo.duedate);
		if (taskDate < today ) {
			if (todo.completed == true) {
				return "expired completed";
			} else {
				return "expired";
			}
		}      

		if (todo.completed == true) {
			return "completed";
		} else {
			return "";
		}
    }; 	


	$scope.newTodo = '';

    var rootRef = new Firebase('https://glowing-fire-2971.firebaseio.com/users/');
	rootRef.onAuth(authDataCallback);
	if ($scope.authData) {
		var uid = parseInt($scope.authData.uid.substring(12)); 
		var messagesRef = rootRef.child(uid + '/tasks');
		$scope.todos = $firebase(messagesRef).$asArray();
	} else {
		$scope.todos = [];
	}

	// Create a callback which logs the current auth state
	function authDataCallback(authData) {
		if (authData) {
		  $scope.authData = authData;
		  $scope.userLoggedIn = true;
		} else {
		  $scope.userLoggedIn = false;
		}
	}

}

})();