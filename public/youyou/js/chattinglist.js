'use strict';

// Initializes the ChattingListFunc.
function ChattingListFunc() {
  document.addEventListener('DOMContentLoaded', function () {
    this.mail = document.getElementById('mail');
    this.uid = document.getElementById('uid');
    this.photourl = document.getElementById('photourl');
    this.displayname = document.getElementById('displayname');
    this.btn = document.getElementById('room-button');

    this.initFirebase();

    this.btn.addEventListener('click', this.getRoomInfo.bind(this));

    // Get a reference to the database service
  }.bind(this));
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
ChattingListFunc.prototype.initFirebase = function () {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Triggered on Firebase auth state change.
ChattingListFunc.prototype.onAuthStateChanged = function (user) {
  if (user) {
    console.log(user);
    this.mail.innerText = user.email;
    this.uid.innerText = user.uid;
    this.displayname.innerText = user.displayName;
    this.photourl.innerText = user.photoURL;
    // User is signed in.
    this.currentUid = user.uid;
  } else {
    console.log('NONE');
    // No user is signed in.
  }
};

ChattingListFunc.prototype.getRoomInfo = function () {
  console.log(this.currentUid);
  console.log('db' + this.database);
  var uid = this.currentUid;
  this.database.ref('roomList/' + uid).on('child_added', function (snapshot) {
    var roomName = snapshot.key;
    console.log('Room Name : ' + roomName);

    firebase.database().ref('rooms/' + roomName).once('value').then(function (roomSnapshot) {
      console.log('New Data');
      if (roomSnapshot.val()) {
        console.log('데이터 있음' + roomName);
        console.log(roomSnapshot.val().lastModified);
        console.log(roomSnapshot.val().lastMessage);
        console.log(roomSnapshot.val().users);

        firebase.database().ref('rooms/' + roomName + '/users').on('child_added', function (userSnapshot) {
          console.log('Room 멤버 : ' + userSnapshot.key + ' , ' + userSnapshot.val());
        });
      } else {
        console.error('방 정보 없음' + roomName);
      }
    });
  }).bind(this);
};

// rooms에서 내 id에 해당하는 것 다 불러온다

// Load the demo.
window.demo = new ChattingListFunc();
