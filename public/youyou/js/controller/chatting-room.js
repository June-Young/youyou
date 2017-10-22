var app = angular.module('MobileAngularUiExamples');



app.controller('chattingroom', function ($scope, sharedService) {
  var roomName = sharedService.roomName;
  // var currentUid;
  var auth = firebase.auth();
  var messagesRef = firebase.database().ref("messages/" + roomName);

  checkSignedInWithMessage = function () {
    // Return true if the user is signed in Firebase
    if (auth.currentUser) {
      return true;
    }
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
      text: text
      // photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function () {
      // Clear message text field and SEND button state.
      $scope.input.inner = '';
    }.bind(this)).catch(function (error) {
      console.error('Error writing new message to Firebase Database', error);
    });

    console.log("Clicked!!" + $scope.input);
    // console.log("Clicked!! " + currentUid);

  };


  /* 데이터 load해올때 쓰게 될 것 같다

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.$apply(function () {
        currentUid = user.uid;
      });
    } else {
      console.log('NONE');
      // No user is signed in.
    }
  });
*/

});
