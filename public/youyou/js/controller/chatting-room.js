var app = angular.module('MobileAngularUiExamples');


app.controller('chattingroom', function ($scope, $location, $routeParams) {

    var roomName = sessionStorage.getItem("roomName");
    var myDisplayName = '';
    var auth = firebase.auth();
    var messagesRef = firebase.database().ref("messages/" + roomName);
    var target = '';
    var myid = '';


    var mapChecker=function(){
      console.log('mapChecker');
      console.log($routeParams.type);
    };
    mapChecker();

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
        setScrollTop();
      }
    };


    setScrollTop = function () {
      var objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;
    };

    $scope.records = data;

    let loadMessage = function () {
      messagesRef.off();
      setMessage = function (messages) {

        messages.forEach(function (snapshot) {
          var message = snapshot.val();
          var ownership = false;
          if (myDisplayName === message['name']) {
            ownership = true;
          } else {
            ownership = false;
          }
          addText(message['photourl'], message['text'], ownership);
        });
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
      console.log("myid" + myid);

      var messageVal = {};
      messageVal[myid] = {
        name: currentUser.displayName || 'Anonymous',
        photourl: currentUser.photoURL || '/youyou/img/profile_placeholder.png',
        text: text
      };

      messagesRef.push(messageVal).then(function () {
        // Clear message text field and SEND button state.
        $scope.$apply(function () {
          $scope.input = '';
        });

        // unchecked 갱신
        firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
        firebase.database().ref("rooms/" + roomName + "/lastMessage").set(text);
        firebase.database().ref("uncheked/" + target + '/' + roomName).once('value').then(function (count) {
          firebase.database().ref("uncheked/" + target + '/' + roomName).set(count.val() + 1);
        });

        setScrollTop();

      }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
      });
    };

    $scope.goback = function () {
      messagesRef.off();
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


    firebase.messaging().onMessage(function (payload) {
      console.log('onMessage : ' + payload);
    });
    var user = firebase.auth().currentUser;
    if (user) {
      if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
        myid = user.uid;
        myDisplayName = user.displayName;
        roomNameParser(myid);
        loadMessage();
        firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
      } else {
        $scope.$apply(function () {
          myid = user.uid;
          myDisplayName = user.displayName;
          roomNameParser(myid);
          loadMessage();
        });
      }
    } else {
      console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
      $location.path("login");
    }
  }
);
