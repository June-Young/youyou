var app = angular.module('YouyouWebapp');


app.controller('chattinglist', function ($scope, $compile, $location) {
  $scope.clickRoom = function (event) {
    sessionStorage.setItem("roomName", event);
    $location.path("chattingroom");
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

  var templete =
    '<div> ' +
    '    <div class="roomlist-container" ng-style="backStyle"> ' +
    '      <div> ' +
    '        <div class="imgSection"> ' +
    '          <div class="photoUrl"><img class="imgUrl" src=\'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg\'></div> ' +
    '        </div> ' +
    '        <div class="otherSection"> ' +
    '          <div class="name-modified"> ' +
    '            <div class="nickname" ng-style="fontStyle"></div> ' +
    '            <div class="lastModified" ng-style="fontStyle"></div> ' +
    '          </div> ' +
    '          <div class="message-uncheked"> ' +
    '            <div class="lastMessage" ng-style="fontStyle"></div> ' +
    '            <div class="uncheked"><p class="uncheked-val"></p></div> ' +
    '          </div> ' +
    '        </div> ' +
    '      </div> ' +
    '    </div> ' +
    '  </div>';


  var messageList = document.getElementById('rooms');


  let dynamicView = function (roomName) {
    var div = document.getElementById(roomName);
    // If an element for that message does not exists yet we create it.
    if (!div) {
      var container = document.createElement('div');
      console.log(container);
      container.innerHTML = templete;
      div = container.firstChild;
      div.setAttribute('id', roomName);
      // div.setAttribute('data-ng-click', 'backStyle={"background-color":"#fee050","box-shadow": "10 15px #666"};fontStyle={"color":"#ffffff"};clickRoom("' + roomName + '")');
      div.setAttribute('data-ng-click', 'clickRoom("' + roomName + '")');
      $compile(div)($scope);
      messageList.appendChild(div);
    }
    return div;
  };

  let timeFormat = function (time) {
    var yyyy = time.substring(0, 4);
    var mm = time.substring(4, 6);
    var dd = time.substring(6, 8);
    return yyyy + '-' + mm + '-' + dd;
  };
  let getRoomInfo = function (uid) {
    // 방 정보 가져오기 시작
    var roomListRef = firebase.database().ref('roomList/' + uid);
    console.log('mymy hiroom  . '+uid);
    // Make sure we remove all previous listeners.
    roomListRef.off();

   /* roomListRef.once('value').then(function (rooms) {
      rooms.forEach(function (room) {

        var roomName=room.key;
        var lastModified = room.val();
      });
    });*/

    loadRoom = function (roomlist) {
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
              console.log(div);
              var nickname = div.querySelector('.nickname');
              var photoUrl = div.querySelector('.imgUrl');
              var lastMessage = div.querySelector('.lastMessage');
              var lastModified = div.querySelector('.lastModified');
              var uncheked = div.querySelector('.uncheked-val');
              var unchekedDiv = div.querySelector('.uncheked');

              lastMessage.innerHTML = rv.lastMessage;
              lastModified.innerHTML = timeFormat(modifiedTime);
              firebase.database().ref('users/' + target).once('value').then(function (userDetailSnapshot) {
                detail = userDetailSnapshot.val();
                if (detail) {
                  nickname.innerHTML = detail.displayName;
                  console.log(detail.photoURL);
                  photoUrl.src = detail.photoURL;
                } else {
                  nickname.innerHTML = '알수없음';
                  photoUrl.src = '"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"';
                }
              });

              firebase.database().ref('uncheked/' + my + '/' + roomName).on('value', function (unchekedSnapshot) {
                var count = unchekedSnapshot.val();
                if (count === 0) {
                  console.log('hidden' + count);
                  unchekedDiv.style.visibility = "hidden";
                } else {
                  unchekedDiv.style.visibility = "visible";
                  uncheked.innerHTML = count;
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

    roomListRef.orderByValue().on('child_added', loadRoom);
    roomListRef.orderByValue().on('child_changed', loadRoom);
  };

  // var user = firebase.auth().currentUser;
  var user = sessionStorage.getItem("myid");
  if (user) {
    console.log('user id!! '+user);
    getRoomInfo(user);
  } else {
    console.error("인가되지 않은 유저입니다. 로그인 해주세요.");
    $location.path("login");
  }
});
