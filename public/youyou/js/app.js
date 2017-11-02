/* eslint no-alert: 0 */

'use strict';

//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('YouyouWebapp', [
  'ngRoute',
  'mobile-angular-ui',
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'.
  // This is intended to provide a flexible, integrated and and
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures',
  'ngTouch'
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
    templateUrl: 'pages/home_weather.html',
    controller: 'WeatherController',
    reloadOnSearch: false
  });
  // $routeProvider.when('/', {templateUrl: '/home.html', reloadOnSearch: false, controller: 'MainController'});
  $routeProvider.when('/signin-account', {
    templateUrl: 'pages/signin.html',
    controller: 'SignInController',
    reloadOnSearch: false
  });
  $routeProvider.when('/signup-account', {
    templateUrl: 'pages/signup.html',
    controller: 'SignUpController',
    reloadOnSearch: false
  });
  $routeProvider.when('/nickname', {templateUrl: 'pages/nickname.html', controller: 'nickname', reloadOnSearch: false});
  $routeProvider.when('/chattinglist', {
    templateUrl: 'pages/chatting-list.html',
    controller: 'chattinglist',
    reloadOnSearch: false
  });
  $routeProvider.when('/chattingroom', {
    templateUrl: 'pages/chatting-room.html',
    controller: 'chattingroom',
    reloadOnSearch: false
  });
  $routeProvider.when('/googleMap', {
    templateUrl: 'pages/googleMap.html',
    controller: 'GoogleMapController',
    reloadOnSearch: false
  });
  $routeProvider.when('/home_weather', {
    templateUrl: 'pages/home_weather.html',
    controller: 'WeatherController',
    reloadOnSearch: false
  });
  $routeProvider.when('/language', {
    templateUrl: 'pages/language.html',
    controller: 'LanguageController',
    reloadOnSearch: false
  });
  $routeProvider.when('/welcome', {
    templateUrl: 'pages/welcome.html',
    controller: 'WelcomeController',
    reloadOnSearch: false
  });
  $routeProvider.when('/country', {
    templateUrl: 'pages/country.html',
    controller: 'CountryController',
    reloadOnSearch: false
  });
  $routeProvider.when('/logout', {
    templateUrl: 'pages/logout.html',
    controller: 'LogoutController',
    reloadOnSearch: false
  });
  $routeProvider.when('/youyoulist', {
    templateUrl: 'pages/youyou-list.html',
    controller: 'YouyouListController',
    reloadOnSearch: false
  });
  $routeProvider.when('/youyouprofile', {
    templateUrl: 'pages/youyou-profile.html',
    controller: 'YouyouProfileController',
    reloadOnSearch: false
  });
  $routeProvider.when('/home', {templateUrl: 'pages/home.html', controller: 'HomeController', reloadOnSearch: false});
  $routeProvider.when('/profile', {
    templateUrl: 'pages/profile.html',
    controller: 'ProfileController',
    reloadOnSearch: false
  });
  $routeProvider.when('/tourApi', {
    templateUrl: 'pages/tourApi.html',
    controller: 'TourApiController',
    reloadOnSearch: false
  });
  $routeProvider.when('/gallery', {
    templateUrl: 'pages/gallery.html',
    controller: 'GalleryController',
    reloadOnSearch: false
  });
  $routeProvider.when('/question', {
    templateUrl: 'pages/question.html',
    controller: 'QuestionController',
    reloadOnSearch: false
  });
  $routeProvider.when('/thankyou', {
    templateUrl: 'pages/thankyou.html',
    controller: 'ThankyouController',
    reloadOnSearch: false
  });
  $routeProvider.when('/youyou-info', {
    templateUrl: 'pages/youyou-info.html',
    controller: 'YouyouInfoController',
    reloadOnSearch: false
  });
  $routeProvider.when('/agreement', {
    templateUrl: 'pages/agreement.html',
    controller: 'AgreementController',
    reloadOnSearch: false
  });
  $routeProvider.when('/settings', {
    templateUrl: 'pages/settings.html',
    controller: 'SettingsController',
    reloadOnSearch: false
  });
  $routeProvider.when('/test', {templateUrl: 'pages/test.html', controller: 'TestController', reloadOnSearch: false});
  $routeProvider.when('/', {
    templateUrl: 'pages/login_main.html',
    controller: 'StartController',
    reloadOnSearch: false
  });
  $routeProvider.when('/login', {
    templateUrl: 'pages/login_main.html',
    controller: 'StartController',
    reloadOnSearch: false
  });
  $routeProvider.when('/recommend-main', {
    templateUrl: 'pages/recommend_main.html',
    controller: 'RecommendMainController',
    reloadOnSearch: false
  });
  $routeProvider.when('/recommend-detail', {
    templateUrl: 'pages/recommend_list.html',
    controller: 'RecommendListController',
    reloadOnSearch: false
  });
  $routeProvider.when('/recommend-contents', {
    templateUrl: 'pages/recommend_contents.html',
    controller: 'RecommendContentsController',
    reloadOnSearch: false
  });
  $routeProvider.when('/policy', {
    templateUrl: 'pages/youyouPolicy.html',
    reloadOnSearch: false
  });
  $routeProvider.when('/profile-change', {
    templateUrl: 'pages/profile_change.html',
    controller: 'ProfileChangeController',
    reloadOnSearch: false
  });

});
