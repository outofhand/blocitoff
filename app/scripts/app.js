'use strict';

/**
 * @ngdoc overview
 * @name blocitoff
 * @description
 * # blocitoff
 *
 * Main module of the application.
 */
angular
  .module('blocitoff', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'firebase',
    'ui.date',
    'ui.bootstrap'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
  
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'  
      })  
      .state('task', {
        url: '/task',
        templateUrl: 'views/task.html',
        controller: 'TaskCtrl'  
      })        
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'  
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'  
      });           
  })
