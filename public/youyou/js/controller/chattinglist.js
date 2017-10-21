var app = angular.module('MobileAngularUiExamples');
app.controller('chattinglist', function ($scope) {

  var currentUid='';
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.$apply(function () {
        $scope.mail = user.email;
        $scope.uid = user.uid;
        $scope.displayname = user.displayName;
        $scope.photourl = user.photoURL;
        currentUid=user.uid;
      });
    } else {
      console.log('NONE');
      // No user is signed in.
    }
  });

  test = function () {
    console.log(currentUid);
  };

  $scope.getRoomInfo = function () {
    test();
  };
});
