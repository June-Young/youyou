var app = angular.module('MobileAngularUiExamples');


app.controller('HomeController', function ($scope, $location) {
  $scope.recommendClick = function () {
    console.log("recommend click");
  };

  $scope.questionClick = function () {
    console.log("question click");
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase.database().ref('users/' + user.uid).once('value').then(function (userDetailSnapshot) {
        var displayName = userDetailSnapshot.val() && userDetailSnapshot.val().displayName || 'Unknown';
        $scope.$apply(function () {
          $scope.nickname = displayName;
        });
      });
    }
  });


  $scope.clickedFooterHome = function () {
    $location.path("home");
  };
  $scope.clickedFooterChats = function () {
    $location.path("chattinglist");
  };
  $scope.clickedFooterUUList = function () {
    $location.path("youyoulist");
  };
  $scope.clickedFooterProfile = function () {
    $location.path("profile");
  };
});
