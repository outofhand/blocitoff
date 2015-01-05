/*global Firebase*/
'use strict';

/**
 * @ngdoc function
 * @name blocitoff.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blocitoff
 */
angular.module('blocitoff')

  .filter("activeItems", function() {
    return function(messages, showComplete) {
      var resultArr = [];
      angular.forEach(messages, function(message) {
        if (message.status == "active" || showComplete == true) {
          resultArr.push(message);
        }
      });
      return resultArr;
    }
  }) 

  .filter("nonActiveItems", function() {
    return function(messages, showComplete) {
      var resultArr = [];
      angular.forEach(messages, function(message) {
        if (message.status !== "active" || showComplete == true) {
          resultArr.push(message);
        }
      });
      return resultArr;
    }
  })   

  .controller('MainCtrl', function ($scope, $timeout, TaskService) {
  
    $scope.currentUser = null;
    $scope.currentText = null;
    $scope.messages = [];    
    $scope.priorities = [
      {name: 'Low', rank: 3},
      {name: 'Medium', rank: 2},
      {name: 'High', rank: 1}
    ];
    $scope.newTaskPriority = $scope.priorities;
    $scope.newTaskDate = new Date();
    $scope.status = 'active';

    TaskService.childAdded(function(addedChild) {
      //$timeout(function() {
         $scope.messages.push(addedChild);
      //});
    });

    $scope.sendMessage = function() {
    //  var newMessage = {
    //    user: $scope.currentUser,
    //    text: $scope.currentText 
    //  };

      var newMessage = {
        user: $scope.currentText,
        text: $scope.newTaskPriority.name,
        status: $scope.status,
        priority: $scope.newTaskPriority.rank,
        duedate: $scope.newTaskDate.toString()
      };      
     
      var promise = TaskService.add(newMessage);
      promise.then(function(key) {
        console.log(key);
      });

      $scope.currentText = null;
      $scope.newTaskDate = new Date();
    };

    $scope.removeMessage = function(key) {
      //console.log(key);
      TaskService.remove(key);
      deleteMessageByKey(key);
    };

    $scope.updateMessage = function(key) {

      for (var i=0; i < $scope.messages.length; i++) {
        var currentMessage = $scope.messages[i];
        //console.log(currentMessage.key);
        if (currentMessage.key == key) {
          $scope.messages[i].status = 'completed';
          break;
        }
      }

      console.log($scope.messages);
      TaskService.update(key);
    };    

    function deleteMessageByKey(key) {
      for (var i=0; i < $scope.messages.length; i++) {
        var currentMessage = $scope.messages[i];
        //console.log(currentMessage.key);
        if (currentMessage.key == key) {
          $scope.messages.splice(i, 1);
          break;
        }
      }
    }    

    $scope.statusCheck = function(message) {
      return (message.status == "completed") ? "completed" : "";
    }    

    $scope.checkDate = function(duedate) {
      var today = new Date();
      var taskDate = new Date(duedate);
      taskDate.setDate(taskDate.getDate()+7);
      //var taskDueDate = taskDate.getDate()+7;
      console.log('Date: ' + today);
      console.log('Task: ' + taskDate);      

      if ( taskDate <= today ) {
        console.log("expired"); 
      } else {
        console.log("active");
      }
    }

  })

.service('TaskService', function($firebase) {
    var rootRef = new Firebase('https://glowing-fire-2971.firebaseio.com/');
    var messagesRef = rootRef.child('messages');
    var sync = $firebase(messagesRef);
    var syncArray = $firebase(messagesRef).$asArray();
    return {
      childAdded: function childAdded(cb) {
        messagesRef.on('child_added', function(snapshot) {
          var snapshotVal = snapshot.val();

          var newStatus = "";
          var today = new Date();
          var taskDate = new Date(snapshotVal.duedate);
          taskDate.setDate(taskDate.getDate()+7);  
          if ( taskDate <= today ) {
            newStatus = "expired"; 
          } else {
            newStatus = snapshotVal.status; 
          }

          cb.call(this, {
            text: snapshotVal.text,
            user: snapshotVal.user,
            status: newStatus,
            priority: snapshotVal.priority,
            duedate: snapshotVal.duedate,
            key: snapshot.key()
          });
        });
      },
      add: function addMessage(message) {
        //messagesRef.push(message);
        return syncArray.$add(message);
      },
      update: function updateMessage(key) {
        var currMessage = syncArray.$getRecord(key); 
        currMessage.status = 'completed';
        syncArray.$save(currMessage).then(function() {
          // data has been saved.
        });
      },
      remove: function removeMessage(key) {
        sync.$remove(key);
      }
    };
});
