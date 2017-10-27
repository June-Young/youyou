var app = angular.module('MobileAngularUiExamples');


app.controller('ProfileController', function ($scope, $location) {

  $scope.setting = function () {
    console.log("Setting");
  };
  $scope.customerService = function () {
    console.log("customerService");
  };

  $scope.agreement = function () {
    console.log("agreement");
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
      var displayName = userDetailSnapshot.val() && userDetailSnapshot.val().displayName || 'Anonymous';
      var photoURL = userDetailSnapshot.val() && userDetailSnapshot.val().photoURL || '/youyou/img/profile_placeholder.png';
      var country = userDetailSnapshot.val() && userDetailSnapshot.val().country || 'Unknown';
      $scope.$apply(function () {
        $scope.nickname = displayName;
        $scope.photoURL = photoURL;
        $scope.country = country;
      });
    });
  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
});
