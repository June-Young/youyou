'use strict';
// var app = angular.module('MobileAngularUiExamples');
angular.module('MobileAngularUiExamples').controller('login', function ($scope, $location) {
  $scope.signInGoogle = function ($location) {
    console.log('signin google');

    var google = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google).then(function () {
      console.log('login : ' + firebase.auth().currentUser);
      // window.location.replace("/youyou/#/nickname");
      $location.path("nickname");
    });

  };
  $scope.signInFacebook = function ($location) {
    console.log('signin facebook');
    var facebook = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebook).then(function () {
      console.log('login : ' + firebase.auth().currentUser);
      // window.location.replace("/youyou/#/nickname");
      $location.path("nickname");
    });
  };
});

angular.module('MobileAngularUiExamples').controller('nickname', function ($scope, $location) {
});

