var app = angular.module('YouyouWebapp');


app.controller('ProfileController', function ($scope, $location) {

  $scope.setting = function () {
    $location.path("settings");
  };
  $scope.customerService = function () {
    $location.path("youyou-info");
  };
  $scope.agreement = function () {
    $location.path("agreement");
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

  // var user = firebase.auth().currentUser;
  var user = sessionStorage.getItem("myid");
  if (user) {
    firebase.database().ref('users/' + user).once('value').then(function (userDetailSnapshot) {
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
app.controller('YouyouInfoController', function ($scope) {
  $scope.goback = function () {
    history.back();
  };
});
app.controller('AgreementController', function ($scope) {
  $scope.goback = function () {
    history.back();
  };
});
app.controller('SettingsController', function ($scope, $location) {

  $scope.switchYouyou = function () {
    //유저 정보 읽는다
    //youyou에 넣는다
    // var currentUser = firebase.auth().currentUser;
    var currentUser = sessionStorage.getItem("myid");
    if (currentUser) {
      var uid = currentUser;

      firebase.database().ref('users/' + uid).once('value').then(function (userData) {
        var userVal = userData.val();

        var name = userVal.displayName;
        var photo = userVal.photoURL;

        var obj = {likes: 0, response: 0, nickname: name, photoURL: photo};
        firebase.database().ref('youyou/' + currentUser).set(obj);
        $scope.$apply(function () {
          console.log("switch success");
          $location.path("home");
        });
      });
    } else {
      console.log("로그인 정보가 없습니다..");
      $scope.$apply(function () {
        $location.path("login");
      });
    }



  };
  $scope.goback = function () {
    history.back();
  };
});
