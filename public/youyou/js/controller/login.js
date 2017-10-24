'use strict';
var app = angular.module('MobileAngularUiExamples');
app.controller('login', function ($scope, $location) {
  $scope.signInGoogle = function () {


    var google = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google).then(function () {
      console.log('signin google');
    });

  };
  $scope.signInFacebook = function () {

    var facebook = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebook).then(function () {
      console.log('signin facebook');
    });
  };


  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      var uid = user.uid;
      var userRef = firebase.database().ref('users/' + uid);
      //정보 가져오거나 넣거나해야지

      userRef.once('value').then(function (data) {
        var info = data.val();
        if (info) {
          pageChange("home_weather")
          //가입된 유저
        } else {
          //신규유저.
          sessionStorage.setItem("myid", uid);
          userRef.set({displayName: user.displayName, photoURL: user.photoURL});
          pageChange("nickname");
        }
      });
    }
  });


  var pageChange = function (path) {
    $scope.$apply(function () {
      $location.path(path);
    });
  }
});

angular.module('MobileAngularUiExamples').controller('nickname', function ($scope, $location) {

  $scope.clickSubmit = function () {
    if ($scope.edit) {
      if ($scope.edit.length > 0) {
        //firebase로 submit
        var myid = sessionStorage.getItem("myid");
        firebase.database().ref("users/" + myid).update({displayName: $scope.edit});
        $location.path("language");
      }
    } else {
      console.log("닉네임을 입력하고 누르세요.");
    }

  }
});

angular.module('MobileAngularUiExamples').controller('LanguageController', function ($scope, $location) {

  $scope.clickedEnglish = function () {
    var myid = sessionStorage.getItem("myid");
    firebase.database().ref("users/" + myid).set({language: 'english'});
    //firebase에 업데이트하고
    $location.path("country")
  }
});


angular.module('MobileAngularUiExamples').controller('LogoutController', function ($scope, $location) {

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase.auth().signOut();
    } else {
    }
  });
});

angular.module('MobileAngularUiExamples').directive('watcher', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var btn = document.getElementById("smbtn");
      scope.$watch(attrs.ngModel, function (v) {
        if (v) {
          btn.style.opacity = 1;
        } else {
          btn.style.opacity = 0.5;
        }
      });
    }
  }
}]);

