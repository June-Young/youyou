// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/4.2.0/firebase-app.js');
importScripts('/__/firebase/4.2.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

/*
importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.2.0/firebase-messaging.js");
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDzRpXwVWLUCuJGtaz8gP4POWG07xAoUMM",
  authDomain: "youyou-2e8cf.firebaseapp.com",
  databaseURL: "https://youyou-2e8cf.firebaseio.com",
  projectId: "youyou-2e8cf",
  storageBucket: "youyou-2e8cf.appspot.com",
  messagingSenderId: "482759820475"
};
firebase.initializeApp(config);
*/

const messaging = firebase.messaging();
