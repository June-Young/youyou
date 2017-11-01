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
  $scope.profileChange = function () {
    $location.path("profile-change");
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
app.controller('ProfileChangeController', function ($scope, $location) {

  var myid = sessionStorage.getItem("myid");
  var storage = firebase.storage();
  $scope.images = [];
  $scope.display = $scope.images[$scope.images.length - 1];

  if (myid) {
    firebase.database().ref("users/" + myid).once('value').then(function (userInfo) {

      if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
        $scope.profileImage = userInfo.val().photoURL;
        $scope.nickname = userInfo.val().displayName;
        $scope.myid = myid;
      } else {
        $scope.$apply(function () {
          $scope.profileImage = userInfo.val().photoURL;
          $scope.nickname = userInfo.val().displayName;
          $scope.myid = myid;
        });
      }
    });

    firebase.database().ref("youyou/" + myid).once('value').then(function (userInfo) {
      var val = userInfo.val();
      if (val) {
        $scope.status = 'Youyou';
        if (val.backgroundURL) {
          if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
            $scope.backgroundImg = userInfo.val().backgroundURL;
          } else {
            $scope.$apply(function () {
              $scope.backgroundImg = userInfo.val().backgroundURL;
            });
          }
        } else {
          if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
            $scope.backgroundImg = '/youyou/img/default-background.jpg';
          } else {
            $scope.$apply(function () {
              $scope.backgroundImg = '/youyou/img/default-background.jpg';
            });
          }
        }
      } else {
        $scope.status = 'Traveler';
      }
    });


  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }


  $scope.shareImage = function () {
    var path = myid + '/' + 'profile/' + myid + '.jpg';
    var storageRef = storage.ref(path);


    console.log("share Image");
    for (var index = 0; index < $scope.images.length; index++) {
      var img = $scope.images[index];
      var image = img.split(',');

      storageRef.putString(image[1], 'base64').then(function (snapshot) {
        var imageUri = snapshot.downloadURL;
        console.log('success upload image' + imageUri);
        var photoURL = {photoURL: imageUri};
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
          $scope.profileImage = imageUri;
        } else {
          $scope.$apply(function () {
            $scope.profileImage = imageUri;
          });
        }
        firebase.database().ref("users/" + myid).update(photoURL);

      });
    }
    $scope.display = '';
    $scope.images = [];
  };

  $scope.backgroundChangeImage = function () {
    var path = myid + '/' + 'youyou/' + myid + '.jpg';
    var storageRef = storage.ref(path);

    console.log("share Image");
    for (var index = 0; index < $scope.images.length; index++) {
      var img = $scope.images[index];
      var image = img.split(',');

      storageRef.putString(image[1], 'base64').then(function (snapshot) {
        var imageUri = snapshot.downloadURL;
        console.log('success upload image' + imageUri);
        var photoURL = {backgroundURL: imageUri};
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
          $scope.backgroundImg = imageUri;
        } else {
          $scope.$apply(function () {
            $scope.backgroundImg = imageUri;
          });
        }
        firebase.database().ref("youyou/" + myid).update(photoURL);

      });
    }
    $scope.display = '';
    $scope.images = [];
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
  $scope.goback = function () {
    history.back();
  };
});
