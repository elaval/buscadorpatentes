'use strict';

angular
  .module('inapiApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'tide-angular',
    'underscore',
    'd3service'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/inapi.html',
        controller: 'InapiController',
        controllerAs: 'controller'
      })
      .when('/inapi', {
        templateUrl: 'views/inapi.html',
        controller: 'InapiController',
        controllerAs: 'controller'
      })

      .otherwise({
        redirectTo: '/inapi'
      });
  });
