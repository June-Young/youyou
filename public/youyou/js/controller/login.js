'use strict';
// var app = angular.module('MobileAngularUiExamples');
var app = angular.module('MobileAngularUiExamples');
app.controller('login', function ($scope, $location) {
  $scope.signInGoogle = function () {
    console.log('signin google');

    var google = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google).then(function () {
      console.log('login : ' + firebase.auth().currentUser);
      // window.location.replace("/youyou/#/nickname");
      pageChange();
    });

  };
  $scope.signInFacebook = function () {
    console.log('signin facebook');
    var facebook = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebook).then(function () {
      console.log('login : ' + firebase.auth().currentUser);
      // window.location.replace("/youyou/#/nickname");
      pageChange()
    });
  };

  var pageChange = function () {
    $scope.$apply(function () {
      $location.path("nickname");
    });
  }
});

angular.module('MobileAngularUiExamples').controller('nickname', function ($scope, $location) {
});

