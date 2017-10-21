'use strict';
angular.module('MobileAngularUiExamples').controller('login', function ($scope) {
  $scope.signInGoogle = function () {
    console.log('signin google');

    var google = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google).then(function () {
      console.log('login : ' + firebase.auth().currentUser);
      window.location.replace('chattinglist.html');
    });
  };
  $scope.signInFacebook = function () {
    console.log('signin facebook');

    var facebook = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebook).then(function () {
      console.log('login : ' + firebase.auth().currentUser);
      window.location.replace('chattinglist.html');
    });
  };
});
