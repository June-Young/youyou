var app = angular.module('MobileAngularUiExamples');


app.controller('HomeController', function ($scope, $location) {
  $scope.recommendClick = function () {
    console.log("recommend click");
  };

  $scope.questionClick = function () {
    $location.path("question");
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

  const messaging = firebase.messaging();
  let permission = function () {
    messaging.requestPermission()
      .then(function () {
        console.log("permission grated");
        getToken();
      }).catch(function (err) {
      console.log('Unable to get permission to notify.' + err);
    });
  };

  let getToken = function (id) {
    messaging.getToken()
      .then(function (currentToken) {
        //DB확인하고 없으면 넣는다.
        var device = navigator.userAgent || 'Unknown';
        var data = [];
        data[currentToken] = device;
        firebase.database().ref('users/' + id + '/notifications').set(data);
        console.log(navigator.userAgent);
        if (currentToken) {
          console.log('current ' + currentToken);
        } else {
          permission();
        }
      });
  };

  var user = firebase.auth().currentUser;
  if (user) {
    const uid = user.uid;
    firebase.database().ref('users/' + uid).once('value').then(function (userDetailSnapshot) {
      var displayName = userDetailSnapshot.val() && userDetailSnapshot.val().displayName || 'Unknown';
      $scope.$apply(function () {
        $scope.nickname = displayName;
      });
    });
    getToken(uid);
  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
});
