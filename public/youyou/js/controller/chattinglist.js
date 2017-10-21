var app = angular.module('MobileAngularUiExamples');
app.controller('chattinglist', function ($scope) {

  var templete = '<div>' +
    '<div class="nickname"></div>' +
    '<div class="photoUrl"></div>' +
    '<div class="lastMessage"></div>' +
    '<div class="lastModified"></div>' +
    '<div class="uncheked"></div>' +
    '</div>';

  var aa =
    '<li>' +
    '    <div class="roomlist-container" style="background-color: #ffffff;width: 91.7%;height: 20%;border-radius: 80px;box-shadow: 0 15px 25px 0 rgba(15, 7, 45, 0.1);position: static;">' +
    '      <div class="photoUrl" style="position: relative;float:left; width:19.1%; height:64.3% ; top:20.4%;left:2.1%"></div>' +
    '      <div class="nickname" style="float:left;font-family: ProximaNovaSoft;font-size: 200%;font-weight: bold;text-align: left;color: #000000;width:30.8%;height:16.3%;position: relative; top:20.4%;left:7%">ggaburio</div>' +
    '      <div class="lastModified" style="float:left;font-family: Futura;color: #1a395f;opacity: 0.5;font-size: 200%;font-weight: bold;text-align: left;color: #000000;width:20.8%;height:16.3%;position: relative; top:20.4%;left:25%">2017-10-26</div>' +
    '      <div class="lastMessage" style="font-size:120%;opacity: 0.5;float:left;width:40%;height:27.6%;position:relative;top:46.9%;left:7%">Message</div>' +
    '      <div class="uncheked" style="width:7%;height:22%;float:left;position:relative;top:41.8%;left:25.9%;background-color:#ff7171;  border-radius: 100%;display:table"><p style="display: table-cell;vertical-align: middle;text-align: center;color:#ffffff">1</p></div>' +
    '    </div>' +
    '</li>';
  var messageList = document.getElementById('rooms');

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.$apply(function () {
        getRoomInfo(user.uid);
      });
    } else {
      console.log('NONE');
      // No user is signed in.
    }
  });

  let dynamicView = function (roomName) {
    var div = document.getElementById(roomName);
    // If an element for that message does not exists yet we create it.
    if (!div) {
      var container = document.createElement('div');
      console.log(container);
      container.innerHTML = aa;
      div = container.firstChild;
      console.log("div" + div);
      div.setAttribute('id', roomName);
      console.log(div);
      messageList.appendChild(div);
    }
    return div;
  };

  let getRoomInfo = function (uid) {


    // 방 정보 가져오기 시작
    var roomListRef = firebase.database().ref('roomList/' + uid);

    // Make sure we remove all previous listeners.
    roomListRef.off();

    setRoom = function (roomlist) {
      // 접속한 유저가 가지고 있는 방 리스트를 불러옴
      var roomName = roomlist.key;
      var modifiedTime = roomlist.val();

      console.log('Room Name : ' + roomName);

      firebase.database().ref('rooms/' + roomName).once('value').then(function (roomSnapshot) {
        // 방 정보를 가져온다.
        if (roomSnapshot.val()) {
          var res = roomName.split("-!-");
          if (res.length === 2) {
            var my;
            var target;
            if (res[0] === uid) {
              my = res[0];
              target = res[1];
            } else {
              my = res[1];
              target = res[0];
            }

            if (my && target) {

              var rv = roomSnapshot.val();
              var div = dynamicView(roomName);
              var nickname = div.querySelector('.nickname');
              var photoUrl = div.querySelector('.photoUrl');
              var lastMessage = div.querySelector('.lastMessage');
              var lastModified = div.querySelector('.lastModified');
              var uncheked = div.querySelector('.uncheked');

              lastMessage.innerHTML = rv.lastMessage;
              lastModified.innerHTML = modifiedTime;

              firebase.database().ref('users/' + target).once('value').then(function (userDetailSnapshot) {
                detail = userDetailSnapshot.val();
                if (detail) {
                  console.log("디스플레이" + detail.displayName);

                  nickname.innerHTML = detail.displayName;
                  console.log(detail.photoURL);
                  photoUrl.style.backgroundImage = 'url(' + detail.photoURL + ')';
                } else {
                  nickname.innerHTML = '알수없음';
                  photoUrl.style.backgroundImage = 'url("https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg")';
                }
              });

              firebase.database().ref('uncheked/' + my + '/' + roomName).on('value', function (unchekedSnapshot) {
                if (unchekedSnapshot.val()) {
                  uncheked.innerHTML = unchekedSnapshot.val();
                  console.log("언첵 val " + unchekedSnapshot.val());
                } else {
                  uncheked.innerHTML = 0;
                }
              });

            } else {
              console.error("roomname is invalid" + my);
            }
          } else {
            console.error("roomname is invalid" + res.length);
          }
        } else {
          console.error('방 정보 없음' + roomName);
        }
      });
    };

    roomListRef.orderByValue().limitToLast(30).on('child_added', setRoom);
    roomListRef.orderByValue().limitToLast(30).on('child_changed', setRoom);
  }
});
