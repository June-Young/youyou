var app = angular.module('MobileAngularUiExamples');


app.controller('QuestionController', function ($scope, $location) {
  var myid = '';
  var auth = firebase.auth();
  var currentUser;
  $scope.goback = function () {
    history.back();
  };

  $scope.sendMessage = function () {

    if (checkSignedInWithMessage()) {
      console.log("Login")
    } else {
      console.log("Not log in");
    }


    var text = $scope.input;
    var messageVal = {};
    messageVal[myid] = {
      name: currentUser.displayName || 'Anonymous',
      photourl: currentUser.photoURL || '/youyou/img/profile_placeholder.png',
      text: text
    };

    //유유를 랜덤으로 뽑아준다.
    firebase.database().ref("youyou/").once('value').then(function (youyouList) {

      youyouList.forEach(function (youyou) {

        var targetId = youyou.key;
        console.log('key' + targetId);
        console.log('val' + youyou.val());

        var roomName = '';
        if (myid > targetId) {
          roomName = myid + '-!-' + targetId
        } else {
          roomName = targetId + '-!-' + myid
        }


        firebase.database().ref("messages/" + roomName).push(messageVal).then(function () {
          // Clear message text field and SEND button state.
          $scope.$apply(function () {
            $scope.input = '';
          });

          // unchecked 갱신
          firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
          firebase.database().ref("rooms/" + roomName + "/lastMessage").set(text);
          firebase.database().ref("uncheked/" + targetId + '/' + roomName).once('value').then(function (count) {
            firebase.database().ref("uncheked/" + targetId + '/' + roomName).set(count.val() + 1);
          });

          $scope.$apply(function () {
            $location.path("home");
          });
        }).catch(function (error) {
          console.error('Error writing new message to Firebase Database', error);
        });
      });

    });
    //방을 만든다. 방이 있으면 메시지만 보낸다.

  };
  checkSignedInWithMessage = function () {
    // Return true if the user is signed in Firebase
    if (auth.currentUser) {
      return true;
    } else {
      return false;
    }
  };

  currentUser = auth.currentUser;
  if (currentUser) {
    myid = currentUser.uid;
  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
});
