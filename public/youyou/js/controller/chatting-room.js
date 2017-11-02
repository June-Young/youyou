var app = angular.module('YouyouWebapp');


app.controller('chattingroom', function ($scope, $location, $compile, $routeParams) {

  var roomName = sessionStorage.getItem("roomName");
  var myDisplayName = '';
  var myPhotoURL = '';
  var messagesRef = firebase.database().ref("messages/" + roomName);
  var target = '';
  var myid = '';
  var storage = firebase.storage();
  // modal to image upload start
  $scope.name = "Select Files to Upload";
  $scope.images = [];
  $scope.display = $scope.images[$scope.images.length - 1];

  $scope.shareImage = function () {
    var d = new Date().getTime();
    var path = myid + '/' + 'messages/' + d;
    var storageRef = storage.ref(path);
    for (var index = 0; index < $scope.images.length; index++) {
      var img = $scope.images[index];
      var image = img.split(',');

      storageRef.putString(image[1], 'base64').then(function (snapshot) {
        var imageUri = snapshot.downloadURL;
        console.log('success upload image' + imageUri);
        sendImage(imageUri);
        // console.log(snapshot.val().downloadUrl);

      });
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
    console.log("chatting-room upload");
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

  $scope.clickMap = function (event) {
    var fullLink = event.target.id;
    console.log(event.target.id);

    var protocol = fullLink.split(":///");
    console.log(protocol);
    var data = protocol[1].split("|");
    var type = data[0];
    if (type === 'share') {
      if (data.length === 3) {
        $location.path("googleMap").search({type: type, sx: data[1], sy: data[2]});
      } else {
        console.error("파라미터가 부족합니다." + data.length);
      }
    } else if (type === 'route') {
      if (data.length === 5) {
        $location.path("googleMap").search({
          type: type,
          sx: data[1],
          sy: data[2],
          ex: data[3],
          ey: data[4]
        });
      } else {
        console.error("파라미터가 부족합니다." + data.length);
      }
    } else {
      $location.path("googleMap");
    }
  };
  $scope.map = function () {
    $location.path("googleMap");
  };


  var sendMap = function (message) {

    console.log(message);
    var messageVal = {};
    messageVal[myid] = {
      name: myDisplayName || 'Anonymous',
      photourl: myPhotoURL || '/youyou/img/profile_placeholder.png',
      text: message
    };
    messagesRef.push(messageVal).then(function () {

      // unchecked 갱신
      firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
      firebase.database().ref("rooms/" + roomName + "/lastMessage").set(message);
      firebase.database().ref("uncheked/" + target + '/' + roomName).once('value').then(function (count) {
        firebase.database().ref("uncheked/" + target + '/' + roomName).set(count.val() + 1);
      });

      setScrollTop();

    }).catch(function (error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  };
  var sendImage = function (imageUri) {

    console.log(imageUri);
    console.log('myid' + myid);
    var messageVal = {};
    messageVal[myid] = {
      name: myDisplayName || 'Anonymous',
      imageuri: imageUri || 'https://www.google.com/images/spin-32.gif',
      photourl: myPhotoURL
    };
    messagesRef.push(messageVal).then(function () {
      // unchecked 갱신
      firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
      firebase.database().ref("rooms/" + roomName + "/lastMessage").set(message);
      firebase.database().ref("uncheked/" + target + '/' + roomName).once('value').then(function (count) {
        firebase.database().ref("uncheked/" + target + '/' + roomName).set(count.val() + 1);
      });

      setScrollTop();

    }).catch(function (error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  };


  var data = [];
  addImage = function (photourl, imageUri, ownership) {
    if (imageUri) {
      var obj = {
        photourl: photourl,
        imageuri: imageUri,
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
  addMap = function (photourl, text, ownership) {
    if (text) {
      var obj = {
        photourl: photourl,
        text: 'Map Sharing. Please press.',
        ownership: ownership,
        map: text
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
        var photo = messageVal['photourl'];
        var imageUri = messageVal['imageuri'];
        var text = messageVal['text'];
        if (myid === message) {
          ownership = true;
        } else {
          ownership = false;
        }
        if (imageUri) {
          addImage(photo, imageUri, ownership);
        } else if (text.startsWith('map:///')) {
          addMap(photo, text, ownership);
        } else {
          addText(photo, text, ownership);
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
    $location.path("chattinglist");
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


  // var user = firebase.auth().currentUser;
  myid = sessionStorage.getItem("myid");
  if (myid) {
    firebase.database().ref("users/" + myid).once('value').then(function (userInfo) {
      var userVal = userInfo.val();
      console.log('userval' + userVal);
      if (userVal) {
        myDisplayName = userVal.displayName;
        myPhotoURL = userVal.photoURL;
      }
      console.log('myDisplayName' + myDisplayName);
    });

    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {

      roomNameParser(myid);
      loadMessage();
      firebase.database().ref("uncheked/" + myid + '/' + roomName).set(0);
    } else {
      $scope.$apply(function () {
        roomNameParser(myid);
        loadMessage();
      });
    }
  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
  mapChecker = function () {
    var type = $routeParams.type;
    if (type === 'share') {

      var sx = $routeParams.sx;
      var sy = $routeParams.sy;
      var message = 'map:///' + type + '|' + sx + '|' + sy;
      sendMap(message);
    } else if (type === 'route') {
      var sx = $routeParams.sx;
      var sy = $routeParams.sy;
      var ex = $routeParams.ex;
      var ey = $routeParams.ey;
      var message = 'map:///' + type + '|' + sx + '|' + sy + '|' + ex + '|' + ey;
      sendMap(message);
    } else {

    }
    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
      $location.search({});
    } else {
      $scope.$apply(function () {
        $location.search({});
      });
    }
  };

  firebase.messaging().onMessage(function (payload) {
    console.log('onMessage : ' + payload);
  });
  mapChecker();

});
