'use strict';

// Initializes the ChattingListFunc.
function ChattingRoomFunc() {
  document.addEventListener('DOMContentLoaded', function() {
    // var firebase = require('firebase/app');
    // require('firebase/auth');
    // require('firebase/database');

// Leave out Storage
// require("firebase/storage");

/*    var config = {
      apiKey: 'AIzaSyDzRpXwVWLUCuJGtaz8gP4POWG07xAoUMM',
      authDomain: 'youyou-2e8cf.firebaseapp.com',
      databaseURL: 'https://youyou-2e8cf.firebaseio.com',
      projectId: 'youyou-2e8cf',
      storageBucket: 'youyou-2e8cf.appspot.com',
      messagingSenderId: '482759820475'
    };
    firebase.initializeApp(config);*/

    this.messageList = document.getElementById('messages');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message');
    this.submitButton = document.getElementById('submit');

    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));

    this.initFirebase();
    this.loadMessages();

  }.bind(this));
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
ChattingRoomFunc.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();

  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

ChattingRoomFunc.prototype.getCurrentTime = function() {
  return new Date().toLocaleString();
};
ChattingRoomFunc.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.

    console.log('save Message');
    this.messagesRef.push(
      {
        name: currentUser.displayName,
        photourl: currentUser.photoURL || '/images/profile_placeholder.png',
        text: this.messageInput.value,
        timestamp: this.getCurrentTime()
      }).then(function() {
      console.log('messages append 성공');
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    var postData = {
      lastModified: this.getCurrentTime(),
      lastMessage: this.messageInput.value
    };
    updates['/rooms/rk1'] = postData;
    this.database.ref().update(updates).then(function() {
      console.log('room 최신정보 업데이트 성공');
    }).catch(function (error) {
      console.error('Error updating to Firebase Database', error);
    });
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
ChattingRoomFunc.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  console.log('login please. : ' + data);
  return false;
};

// Triggered on Firebase auth state change.
ChattingRoomFunc.prototype.onAuthStateChanged = function(user) {
  if (user) {
    // console.log(user);
    // User is signed in.
    console.log(user.uid);
    this.currentUid = user.uid;
  } else {
    // No user is signed in.
  }
};

ChattingRoomFunc.prototype.loadMessages = function() {
  console.log('getMessages()');
  // rk1후에  방 네임 받아온 것으로 변경해야함
  this.messagesRef = this.database.ref('messages/rk1');
  // Make sure we remove all previous listeners.
  this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photourl, val.imageuri, val.timestamp);
  }.bind(this);

  // 체인지는 날리자
  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  // this.messagesRef.limitToLast(12).on('child_changed', setMessage);

};

// Template for messages.
ChattingRoomFunc.MESSAGE_TEMPLATE =
  '<div class="message-container">' +
  '<div class="spacing"><div class="pic"></div></div>' +
  '<div class="message"></div>' +
  '<div class="name"></div>' +
  '<div class="timestamp"></div>' +
  '</div>';

ChattingRoomFunc.prototype.displayMessage = function(key, name, text, picUrl, imageUri, timestamp) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = ChattingRoomFunc.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  div.querySelector('.timestamp').textContent = timestamp;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function () {
    div.classList.add('visible');
  }, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

ChattingRoomFunc.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// rooms에서 내 id에 해당하는 것 다 불러온다

// Load the demo.
window.demo = new ChattingRoomFunc();
