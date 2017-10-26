var app = angular.module('MobileAngularUiExamples');


app.controller('chattingroom', function ($scope) {
  var roomName = sessionStorage.getItem("roomName");
  // var myDisplayName = sessionStorage.getItem("displayname");
  var auth = firebase.auth();
  var messagesRef = firebase.database().ref("messages/" + roomName);
  var target = '';
  var myid = '';

  var data = [];
  addText = function (photourl, text, ownership) {
    if (text) {

      var obj = {
        photourl: photourl,
        text: cutter(text),
        ownership: ownership
      };
      data.push(obj);
      if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
        $scope.records = data;
      } else {
        $scope.$apply(function () {
          $scope.records = data;
        });
      }
      setScrollTop();
    }
  };

  setScrollTop = function () {
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  cutter = function (text) {
    var resultMessage = '';
    var len = text.length;
    if (len > 15) {

      while (len > 15) {
        resultMessage += text.substring(0, 15) + '\n';
        text = text.substring(15);
        len = text.length
      }
    } else {
      resultMessage = text;
    }
    return resultMessage;
  };

  $scope.records = data;

  loadMessage = function () {
    messagesRef.off();
    setMessage = function (messages) {
      var message = messages.val();
      var ownership = false;
      if (myDisplayName === message.name) {
        ownership = true;
      } else {
        ownership = false;
      }
      addText(message.photourl, message.text, ownership);

    };
    messagesRef.on('child_added', setMessage);
  };

  loadMessage();

  $scope.inputText = function (event) {
    console.log(event);
  };
  $scope.sendMessage = function () {

    if (checkSignedInWithMessage()) {
      console.log("Login")
    } else {
      console.log("not log in");
    }

    var currentUser = auth.currentUser;
    var text = $scope.input;
    console.log("Current User" + currentUser);

    messagesRef.push({
      name: currentUser.displayName,
      photourl: currentUser.photoURL || '/youyou/img/profile_placeholder.png',
      text: text
    }).then(function () {
      // Clear message text field and SEND button state.
      $scope.$apply(function () {
        $scope.input = '';
      });


      // unchecked 갱신
      firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
      firebase.database().ref("uncheked/" + target + '/' + roomName).once('value').then(function (count) {
        firebase.database().ref("uncheked/" + target + '/' + roomName).set(count.val() + 1);
      });

      setScrollTop();

    }.bind(this)).catch(function (error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  };

  $scope.goback = function () {
    history.back();
  };

  checkSignedInWithMessage = function () {
    // Return true if the user is signed in Firebase
    if (auth.currentUser) {
      return true;
    }
  };

  roomNameParser = function (myid) {
    console.log(roomName);
    var res = roomName.split("-!-");
    if (res.length === 2) {
      if (myid === res[0]) {
        console.log("내 아이디");
        target = res[1];
      } else {
        target = res[0];
      }
      firebase.database().ref('users/' + target).once('value').then(function (userDetailSnapshot) {
        $scope.$apply(function () {
          $scope.nickname = (userDetailSnapshot.val() && userDetailSnapshot.val().displayName) || 'Anonymous';
        });
      });
    } else {
      console.error("유효하지 않은 유저와의 대화입니다.");
    }
  };
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.$apply(function () {
        myid = user.uid;
        roomNameParser(myid);
        loadMessage();
      });
    } else {
      console.log('NONE');
      // No user is signed in.
    }
  });
});
