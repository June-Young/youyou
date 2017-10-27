var app = angular.module('MobileAngularUiExamples');


app.controller('HomeController', function ($scope, $location) {
  $scope.recommendClick = function () {
    console.log("recommend click");
  };

  $scope.questionClick = function () {
    console.log("question click");
  };


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


  var user = firebase.auth().currentUser;
  if (user) {
    firebase.database().ref('users/' + user.uid).once('value').then(function (userDetailSnapshot) {
      var displayName = userDetailSnapshot.val() && userDetailSnapshot.val().displayName || 'Unknown';
      $scope.$apply(function () {
        $scope.nickname = displayName;
      });
    });
  }else{
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
});
