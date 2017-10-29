var app = angular.module('YouyouWebapp');


app.controller('YouyouListController', function ($scope, $location) {
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
  $scope.clickRoom = function (targetId) {
    //대화시작
    console.log(targetId);

    if (targetId) {

      sessionStorage.setItem("youyou_profile", targetId);
      $location.path("youyouprofile");

    } else {
      console.log("상대 정보가 없습니다.." + targetId);
    }
  };
  pad2 = function (n) {
    return n < 10 ? '0' + n : n
  };

  getCurrentTime = function () {
    var date = new Date();
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
  };


  var data = [];

  setData = function (key, nickname, photoURL, response, likes) {
    data.push({key: key, nickname: nickname, photoURL: photoURL, response: response, likes: likes});
    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
      $scope.records = data;
    } else {
      $scope.$apply(function () {
        $scope.records = data;
      });
    }
  };

  var getYouyouList = function () {
    // 방 정보 가져오기 시작
    var youyouList = firebase.database().ref('youyou/');
    // Make sure we remove all previous listeners.
    youyouList.once('value').then(function (users) {

      users.forEach(function (snapshot) {
        var obj = snapshot.val();
        var key = snapshot.key;
        if (obj) {
          var nickname = obj.nickname || 'Anonymous';
          var photoURL = obj.photoURL || 'ERROR';
          var response = obj.response || 0;
          var likes = obj.likes || 0;

          setData(key, nickname, photoURL, response, likes);
        } else {
          console.error("유유 데이터를 불러오는데 실패했습니다.");
        }
      });
    });
  };

  getYouyouList();
});


app.controller('YouyouProfileController', function ($scope, $location) {
  var targetId = sessionStorage.getItem("youyou_profile");
  var youyouList = firebase.database().ref('youyou/' + targetId);
  var myid = sessionStorage.getItem("myid");
  // Make sure we remove all previous listeners.
  youyouList.once('value').then(function (users) {

    var username = (users.val() && users.val().nickname) || 'Anonymous';
    console.log(username);
    $scope.$apply(function () {
      $scope.nickname = username;

    });
  });
  $scope.chatting = function () {
    //대화시작
    console.log(targetId);

    if (myid !== '' && targetId) {
      var roomName = '';
      if (myid > targetId) {
        roomName = myid + '-!-' + targetId
      } else {
        roomName = targetId + '-!-' + myid
      }
      firebase.database().ref('rooms/' + roomName).once('value').then(function (roomIsValid) {
        sessionStorage.setItem("roomName", roomName);
        if (!roomIsValid.val()) {
          //roomList에 방 생성
          firebase.database().ref('rooms/' + roomName).set({lastMessage: ''});

          //나와 상대방 계정에 방 추가
          firebase.database().ref('roomList/' + myid + '/' + roomName).set(getCurrentTime());
          firebase.database().ref('roomList/' + targetId + '/' + roomName).set(getCurrentTime());
        }
        $scope.$apply(function () {
          $location.path("chattingroom");
        });
      });

    } else {
      console.log("내 정보 또는 상대 정보가 없습니다.." + myid);
    }
  };

  $scope.goback = function () {
    history.back();
  };
});
