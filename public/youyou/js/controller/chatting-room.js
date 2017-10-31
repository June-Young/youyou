var app = angular.module('YouyouWebapp');


app.controller('chattingroom', function ($scope, $location, $routeParams) {

    var roomName = sessionStorage.getItem("roomName");
    var myDisplayName = '';
    var myPhotoURL = '';
    var messagesRef = firebase.database().ref("messages/" + roomName);
    var target = '';
    var myid = '';

// modal to image upload start
    $scope.name = "Select Files to Upload";
    $scope.images = [];
    $scope.display = $scope.images[$scope.images.length - 1];

    $scope.shareImage = function () {
      console.log("shareImage");
      for (var index = 0; index < $scope.images.length; index++) {
        console.log($scope.images[index]);
      }
    };
    $scope.setImage = function (ix) {
      $scope.display = $scope.images[ix];
    };
    $scope.clearAll = function () {
      $scope.display = '';
      $scope.images = [];
    };
    $scope.upload = function (obj) {
      var elem = obj.target || obj.srcElement;
      for (i = 0; i < elem.files.length; i++) {
        var file = elem.files[i];
        var reader = new FileReader();

        reader.onload = function (e) {
          $scope.images.push(e.target.result);
          $scope.display = e.target.result;
          $scope.$apply();
        };
        reader.readAsDataURL(file);
      }
    };
    // modal to image upload end

    $scope.map = function () {

      $location.path("skMap");
      console.log("map clicked");
    };
    var mapChecker = function () {
      console.log('mapChecker');
      console.log($routeParams.type);
      console.log($routeParams.sx);
      console.log($routeParams.sy);
    };
    mapChecker();

    var data = [];
    addImage =function(photourl, imageUri, ownership){
/*
      if (imageUri.startsWith('gs://')) {
        imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
        this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
          imgElement.src = metadata.downloadURLs[0];
        });
      } else {
        imgElement.src = imageUri;
      }*/
    };
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

    var loadMessage = function () {
      messagesRef.off();
      setMessage = function (messages) {

        messages.forEach(function (snapshot) {
          var message = snapshot.key;
          var messageVal = snapshot.val();
          var ownership = false;
          var imageUri = messageVal['imageuri'];
          if (myid === message) {
            ownership = true;
          } else {
            ownership = false;
          }
          if (imageUri) {
            addImage(messageVal['photourl'], imageUri, ownership);
          } else {
            addText(messageVal['photourl'], messageVal['text'], ownership);
          }
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

        var text = $scope.input;

        // Clear message text field and SEND button state.
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
          $scope.input = '';
        } else {
          $scope.$apply(function () {
            $scope.input = '';
          });
        }

        var messageVal = {};
        messageVal[myid] = {
          name: myDisplayName || 'Anonymous',
          photourl: myPhotoURL || '/youyou/img/profile_placeholder.png',
          text: text
        };
        messagesRef.push(messageVal).then(function () {

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
      }
    };

    $scope.goback = function () {
      messagesRef.off();
      history.back();
    };

    checkSignedInWithMessage = function () {
      // Return true if the user is signed in Firebase
      if (myid) {
        return true;
      } else {
        return false;
      }
    };

    roomNameParser = function (myid) {
      console.log(roomName);
      var res = roomName.split("-!-");
      if (res.length === 2) {
        if (myid === res[0]) {
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
    // var user = firebase.auth().currentUser;
    var user = sessionStorage.getItem("myid");
    if (user) {

      firebase.database().ref("users/" + user).once('value').then(function (userInfo) {
        var userVal = userInfo.val();
        if (userVal) {
          myDisplayName = userVal.displayName;
          myPhotoURL = userVal.photoURL;
        }
      });

      if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
        myid = user;
        roomNameParser(myid);
        loadMessage();
        firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
      } else {
        $scope.$apply(function () {
          myid = user;
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
