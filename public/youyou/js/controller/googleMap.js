angular.module('YouyouWebapp').controller('GoogleMapController', function ($scope, $location) {

  function initialize() {
    //search text
    $scope.isReserving = true;
    $scope.searchText = "";
    $scope.posCount = 0;
    // floating button status
    $scope.floatingLocationStatus = false;
    $scope.floatingRouteStatus = false;
    $scope.uluru = {lat: 37.498014271137265, lng: 127.02761650085449};
    $scope.directionsService = new google.maps.DirectionsService;
    $scope.directionsDisplay = new google.maps.DirectionsRenderer;

    $scope.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: $scope.uluru
    });

    $scope.infowindow = new google.maps.InfoWindow();
    $scope.service = new google.maps.places.PlacesService($scope.map);
    $scope.directionsDisplay.setMap($scope.map);
    getCurrentLocation();
    setMapTouchEvent();
    getParameters();
  }

  function calculateAndDisplayRoute(start, end) {
    // console.log("start : " + start + " , " + "end : " + end);
    $scope.directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'TRANSIT' //
    }, function (response, status) {
      if (status === 'OK') {
        $scope.directionsDisplay.setDirections(response);
      } else {
        // console.log("calculate FAIL : " + status);
      }
    });
  }

  function initializeWithShare(lat, lng) {
    // ?type=share&sx=37.43772510919332&sy=127.12713718414307
    // 37., 127.
    // console.log("lat = " + Number(lat) + " ,lng " + Number(lng));
    makeMarker({lat: Number(lat), lng: Number(lng)});
    $scope.map.setCenter({lat: Number(lat), lng: Number(lng)}, 16);
    $scope.startLonLat = {lat: Number(lat), lng: Number(lng)};
    showPositionShareButton();
  }

  function initializeWithRoute(startLat, startLng, endLat, endLng) {
    // ?type=route&sx=37.213132&sy=127.324234234&ex=37.1123123&ey=127.5647488
    // ?type=route&sx=37.213132&sy=127.324234234&ex=37.1123123&ey=127.5647488
    // route|127.13230848312378|37.43053485291865|127.13127851486206|37.43082452114461
    calculateAndDisplayRoute({lat: Number(startLat), lng: Number(startLng)}, {
      lat: Number(endLat),
      lng: Number(endLng)
    });
    $scope.map.setCenter({lat: Number(startLat), lng: Number(startLng)}, 16);
  }

  function getParameters() {
    var urlParams = $location.search();

    // console.log("getParameters => type :  " + urlParams.type +
    //   " , sx : " + urlParams.sx + " , " +
    //   " , sy : " + urlParams.sy + " , " +
    //   " , ex : " + urlParams.ex + " , " +
    //   " , ey : " + urlParams.ey + " , ");

    if (!urlParams.type) {
      // console.log("null");
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
    $scope.isReserving = false;
    $scope.myPostion = {lat: position.coords.latitude, lng: position.coords.longitude};
    // console.log("myPosition = " + $scope.myPostion);
  }

  function showPositionShareButton() {
    $scope.posCount = 1;
    if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
      $scope.floatingLocationStatus = true;
    } else {
      $scope.$apply(function () {
        $scope.floatingLocationStatus = true;
      });
    }
  }

  function makeMarker(lonlat) {

    // console.log("makeMarker : " + lonlat);

    if ($scope.posCount == 0) {
      $scope.startLonLat = lonlat;
      showPositionShareButton();
    } else if ($scope.posCount == 1) {
      $scope.endLonLat = lonlat;
      if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
        $scope.floatingRouteStatus = true;
      } else {
        $scope.$apply(function () {
          $scope.floatingRouteStatus = true;
        });
      }
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
      // console.log("onclick => " + e.latLng);
      makeMarker({lat: e.latLng.lat() , lng : e.latLng.lng()});
    });
  }

  $scope.shareRoute = function () {
    // console.log("start : " + $scope.startLonLat.lat + " , " + $scope.startLonLat.lng + " , end : " + $scope.endLonLat);
    $location.path("chattingroom").search({
      type: 'route',
      sx: $scope.startLonLat.lat,
      sy: $scope.startLonLat.lng,
      ex: $scope.endLonLat.lat,
      ey: $scope.endLonLat.lng
    });
  }
  $scope.shareLocation = function () {
    // console.log("start : " + $scope.startLonLat.lat + " , " + $scope.startLonLat.lng);
    $location.path("chattingroom").search({type: "share", sx: $scope.startLonLat.lat, sy: $scope.startLonLat.lng});
  }

  function setMyPositionWithMarker() {
    // console.log("setPosition");
    newMarker($scope.myPostion);
    $scope.map.setCenter($scope.myPostion, 16);
    $scope.startLonLat = $scope.myPostion;
    showPositionShareButton();
  }

  $scope.searchByText = function () {
    // console.log("searchText " + $scope.searchText);

    var query = {
      location: $scope.myPostion,
      radius: '500',
      query: $scope.searchText
    };

    $scope.service.textSearch(query, callback);

    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(results[i]);
        }
      } else {
        // console.log("status : " + status);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    // console.log("Name : " + place.name + " , placeLoc : " + placeLoc);

    var image = '/youyou/img/like-b.svg';
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: place.geometry.location,
      icon: image
    });

    google.maps.event.addListener(marker, 'click', function () {
      $scope.infowindow.setContent(place.name);
      $scope.infowindow.open($scope.map, this);
    });
  }

  initialize();

  $scope.touchClick = function (evt) {
    // console.log("touchClick invoke : " + evt);
    if (evt == "location") {
      $scope.shareLocation();
    } else if (evt == "route") {
      $scope.shareRoute();
    } else if (evt == "myPosition") {
      setMyPositionWithMarker();
    }
  };
});
