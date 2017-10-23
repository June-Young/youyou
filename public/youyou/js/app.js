/* eslint no-alert: 0 */

'use strict';

//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('MobileAngularUiExamples', [
  'ngRoute',
  'mobile-angular-ui',


  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'.
  // This is intended to provide a flexible, integrated and and
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

app.run(function ($transform) {
  window.$transform = $transform;
});

//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
app.config(function ($routeProvider) {
  $routeProvider.when('/home_weather', {
    templateUrl: '/youyou/pages/home_weather.html',
    controller: 'WeatherController',
    reloadOnSearch: false
  });
  $routeProvider.when('/', {templateUrl: '/youyou/home.html', reloadOnSearch: false, controller: 'MainController'});
  $routeProvider.when('/login', {templateUrl: '/youyou/pages/login.html', controller: 'login', reloadOnSearch: false});
  $routeProvider.when('/nickname', {templateUrl: '/youyou/pages/nickname.html', controller: 'nickname', reloadOnSearch: false});
  $routeProvider.when('/chattinglist', {templateUrl: '/youyou/pages/chatting-list.html', controller: 'chattinglist', reloadOnSearch: false});
  $routeProvider.when('/chattingroom', {templateUrl: '/youyou/pages/chatting-room.html', controller: 'chattingroom', reloadOnSearch: false});
  $routeProvider.when('/skMap', {templateUrl: '/youyou/pages/skMap.html', controller: 'SkMapController', reloadOnSearch: false});
  $routeProvider.when('/home_weather', {templateUrl: '/youyou/pages/home_weather.html', controller: 'WeatherController', reloadOnSearch: false});
  $routeProvider.when('/language', {templateUrl: '/youyou/pages/language.html', controller: 'LanguageController', reloadOnSearch: false});
  $routeProvider.when('/welcome', {templateUrl: '/youyou/pages/welcome.html', controller: 'WelcomeController', reloadOnSearch: false});
  $routeProvider.when('/country', {templateUrl: '/youyou/pages/country.html', controller: 'CountryController', reloadOnSearch: false});
});
