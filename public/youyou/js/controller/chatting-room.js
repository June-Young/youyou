var app = angular.module('MobileAngularUiExamples');


app.controller('chattingroom', function ($scope) {
  var roomName = sessionStorage.getItem("roomName");
  var myDisplayName = sessionStorage.getItem("displayname");
  var auth = firebase.auth();
  var messagesRef = firebase.database().ref("messages/" + roomName);


  var data = [];
  addText = function (photourl, text, ownership) {
    if (text) {
      var obj = {
        photourl: photourl,
        text: text,
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
    }
  };

  $scope.records = data;

  loadMessage = function () {
    messagesRef.off();
    setMessage = function (messages) {
      var message = messages.val();
      var ownership = false;
      if (myDisplayName === message.name) {
        ownership = true;
        console.log("내 메시지 " + message.text);
      } else {
        ownership = false;
        console.log("상대방 메시지 " + message.text)
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

      var objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;


    }.bind(this)).catch(function (error) {
      console.error('Error writing new message to Firebase Database', error);
    });
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
      var target = '';
      if (myid === res[0]) {
        console.log("내 아이디");
        target = res[1];
      } else {
        target = res[0];
      }
      firebase.database().ref('users/' + target).once('value').then(function (userDetailSnapshot) {
        $scope.$apply(function () {
          $scope.nickname = userDetailSnapshot.val().displayName;
        });
      });
    } else {
      console.error("유효하지 않은 유저와의 대화입니다.");
    }
  };
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.$apply(function () {
        roomNameParser(user.uid);
        loadMessage();
      });
    } else {
      console.log('NONE');
      // No user is signed in.
    }
  });
});
