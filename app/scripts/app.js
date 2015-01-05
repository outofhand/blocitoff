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
    'ui.date'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
  
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'  
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'MainCtrl'  
      });  
  })
