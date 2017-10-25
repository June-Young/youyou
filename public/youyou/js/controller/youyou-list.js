var app = angular.module('MobileAngularUiExamples');


app.controller('YouyouListController', function ($scope, $location) {
  // var myid = '';
  /*$scope.clickRoom = function (targetId) {
    //대화시작
    console.log(targetId);

    if (myid !== '' && targetId) {
      var roomName = '';
      if (myid > targetId) {
        roomName = myid + '-!-' + targetId
      } else {
        roomName = targetId + '-!-' + myid
      }
      console.log("ROOMNAME");
      firebase.database().ref('rooms/' + roomName).once('value').then(function (roomIsValid) {
        if (roomIsValid.val()) {
          sessionStorage.setItem("roomName", roomName);
        } else {

          //roomList에 방 생성
          firebase.database().ref('rooms/' + roomName).set({lastMessage: ''});

          //나와 상대방 계정에 방 추가
          var roomObj = {};
          roomObj[roomName] = getCurrentTime();
          firebase.database().ref('roomList/' + myid).set(roomObj);
          firebase.database().ref('roomList/' + targetId).set(roomObj);
        }
        $scope.$apply(function () {
          $location.path("chattingroom");
        });
      });

    } else {
      console.log("내 정보 또는 상대 정보가 없습니다.." + myid);
    }
  };*/
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

  /*

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        myid = user.uid;
      }
    });
  */

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
  var target = sessionStorage.getItem("youyou_profile");
  var youyouList = firebase.database().ref('youyou/' + target);
  var myid = '';
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      myid = user.uid;
    }
  });
  // Make sure we remove all previous listeners.
  youyouList.once('value').then(function (users) {

    var username = (users.val() && users.val().nickname) || 'Anonymous';
    console.log(username);
    $scope.$apply(function () {
      $scope.nickname = username;

    });
  });
  $scope.chatting = function () {
    var roomName = '';
    if (myid > target) {
      roomName = myid + '-!-' + target;
    } else {
      roomName = target + '-!-' + myid;
    }
    sessionStorage.setItem("roomName", roomName);
    $location.path("chattingroom");
  };

  $scope.goback = function () {
    history.back();
  };
});
