angular.module('YouyouWebapp').controller('GoogleMapController', function ($scope, $location) {

  function initialize() {
    //route flag
    $scope.posCount = 0;
    // floating button status
    $scope.floatingLocationStatus = false;
    $scope.floatingRouteStatus = false;
    $scope.uluru = {lat: 37.4286715, lng: 127.13100399999998};
    $scope.directionsService = new google.maps.DirectionsService;
    $scope.directionsDisplay = new google.maps.DirectionsRenderer;
    $scope.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: $scope.uluru
    });
    $scope.directionsDisplay.setMap($scope.map);
    getCurrentLocation();
    setMapTouchEvent();
    getParameters();
  }

  function calculateAndDisplayRoute(start, end) {
    console.log("start : " + start + " , " + "end : " + end);
    $scope.directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'TRANSIT' //
    }, function (response, status) {
      if (status === 'OK') {
        $scope.directionsDisplay.setDirections(response);
      } else {
        console.log("calculate FAIL : " + status);
      }
    });
  }

  function initializeWithShare(lat, lng) {
    // ?type=share&sx=37.213132&sy=127.324234234
    makeMarker({lat: lat, lng: lng});
  }

  function initializeWithRoute(startLat, startLng, endLat, endLng) {
    // ?type=route&sx=37.213132&sy=127.324234234&ex=37.1123123&ey=127.5647488
    calculateAndDisplayRoute({lat: startLat, lng: startLng}, {lat: endLat, lng: endLng});
  }

  function getParameters() {
    var urlParams = $location.search();

    console.log("getParameters => type :  " + urlParams.type +
      " , sx : " + urlParams.sx + " , " +
      " , sy : " + urlParams.sy + " , " +
      " , ex : " + urlParams.ex + " , " +
      " , ey : " + urlParams.ey + " , ");

    if (!urlParams.type) {
      console.log("null");
    } else if (urlParams.type == "share") {
      initializeWithShare(urlParams.sx, urlParams.sy);
    } else if (urlParams.type == "route") {
      initializeWithRoute(urlParams.sx, urlParams.sy, urlParams.ex, urlParams.ey);
    }
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(processLocation);
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  function processLocation(position) {
    $scope.myPostion = {lat: position.coords.latitude, lng: position.coords.longitude};
    console.log("myLocation = " + $scope.myPostion.lng + ' , ' + $scope.myPostion.lat);
    $scope.map.setCenter($scope.myPostion);
    newMarker($scope.myPostion);
  }

  function makeMarker(lonlat) {

    console.log("makeMarker : " + lonlat + " " + lonlat.toString() + " = " + $scope.posCount);
    if ($scope.posCount == 0) {
      $scope.startLonLat = lonlat;
      $scope.posCount = 1;
      $scope.$apply(function () {
        $scope.floatingLocationStatus = true;
      });
      $scope.floatingLocationPosition = 10;
    } else if ($scope.posCount == 1) {
      $scope.endLonLat = lonlat;
      $scope.$apply(function () {
        $scope.floatingRouteStatus = true;
      });
      calculateAndDisplayRoute($scope.startLonLat, $scope.endLonLat);
      $scope.posCount = 0;
    }
    newMarker(lonlat);
  }

  function newMarker(lonlat) {
    var image = '/youyou/img/like.svg';
    $scope.marker = new google.maps.Marker({
      position: lonlat,
      map: $scope.map,
      icon: image
    });

    $scope.marker.addListener('click', function (e) {
      this.setMap(null);
    });
  }

  function setMapTouchEvent() {
    $scope.map.addListener('click', function (e) {
      console.log("onclick => " + e.latLng);
      makeMarker(e.latLng);
    });
  }

  $scope.shareRoute = function () {
    console.log("start : " + $scope.startLonLat.toString() + " , end : " + $scope.endLonLat);
    // $location.path("chattingroom").search({
    //   type: "route",
    //   sx: $scope.startLonLat.lon,
    //   sy: $scope.startLonLat.lat,
    //   ex: $scope.endLonLat.lon,
    //   ey: $scope.endLonLat.lat
    // });
  }
  $scope.shareLocation = function () {
    console.log("start : " + $scope.startLonLat.toString());
    // $location.path("chattingroom").search({type: "share", sx: $scope.startLonLat.lon, sy: $scope.startLonLat.lat});
  }

  function setPositionWithMarker() {
    console.log("setPosition");
    newMarker($scope.myPostion);
    $scope.map.setCenter($scope.myPostion, 16);
  }

  initialize();

  $scope.touchClick = function (evt) {
    console.log("touchClick invoke : " + evt);
    if (evt == "location") {
      $scope.shareLocation();
    } else if (evt == "route") {
      $scope.shareRoute();
    } else if (evt == "myPosition") {
      setPositionWithMarker();
    }
  };
});
