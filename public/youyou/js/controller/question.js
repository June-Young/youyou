var app = angular.module('YouyouWebapp');


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
        var roomName = '';
        if (myid > targetId) {
          roomName = myid + '-!-' + targetId
        } else {
          roomName = targetId + '-!-' + myid
        }


        firebase.database().ref('rooms/' + roomName).once('value').then(function (roomIsValid) {
          if (!roomIsValid.val()) {
            //roomList에 방 생성
            firebase.database().ref('rooms/' + roomName).set({lastMessage: ''});

            //나와 상대방 계정에 방 추가
            firebase.database().ref('roomList/' + myid + '/' + roomName).set(getCurrentTime());
            firebase.database().ref('roomList/' + targetId + '/' + roomName).set(getCurrentTime());
          }
        });


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
            $location.path("thankyou");
          });
        }).catch(function (error) {
          console.error('Error writing new message to Firebase Database', error);
        });
      });

    });
  };
  let checkSignedInWithMessage = function () {
    // Return true if the user is signed in Firebase
    if (currentUser) {
      return true;
    } else {
      return false;
    }
  };

  let pad2 = function (n) {
    return n < 10 ? '0' + n : n
  };

  let getCurrentTime = function () {
    var date = new Date();
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
  };

  // currentUser = auth.currentUser;
  var currentUser = sessionStorage.getItem("myid");
  if (currentUser) {
    // myid = currentUser.uid;
    myid = currentUser;
  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
});
app.controller('ThankyouController', function ($scope, $location) {
  setTimeout(function () {
    $scope.$apply(function () {
      $location.path("home")
    });
  }, 2000);
});
