angular.module('MobileAngularUiExamples').controller('SkMapController', function ($scope, $location) {

  function initialize() {
    //route flag
    $scope.posCount = 0;

    $scope.map = new Tmap.Map({div: "map_div", width: '100%', height: '100%'});
    $scope.markerLayer = new Tmap.Layer.Markers();
    $scope.map.addLayer($scope.markerLayer);
    $scope.map.setLanguage("EN", false); // 영문
    $scope.map.setCenter(new Tmap.LonLat(14135016.577353, 4518074.1072027), 16);
    getCurrentLocation();
    setMapTouchEvent();
    getParameters();
  }

  function initializeWithShare(startX, startY) {
    // ?type=share&sx=14152221.255693141&sy=4496551.406476195
    // makeMarker(new Tmap.LonLat(startX, startY));
    shareParam1();
  }

  function initializeWithRoute(startX, startY, endX, endY) {
    // ?type=route&sx=14152221.255693141&sy=4496551.406476195&ex=14135016.577353&ey=4518074.1072027
    // getRouteWithLocations(new Tmap.LonLat(startX, startY), new Tmap.LonLat(endX, endY));
    shareParam2();
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

  function removePreviousRouteLay() {
    if ($scope.kmlLayer != null) {
      $scope.map.removeLayer($scope.kmlLayer);
      $scope.kmlLayer = null;
    }
  }

  function setMarkerLayerIndex() {
    $scope.map.setLayerIndex($scope.markerLayer, 2);
    $scope.map.setLayerIndex($scope.kmlLayer, 1);
  }

  function routeLayerInit() {
    removePreviousRouteLay();
    var style = new Tmap.Style({
      pointRadius: 5,
      fillColor: "#FFAAAA",
      fillOpacity: 1,
      strokeColor: "#FF0000",
      strokeWidth: 3,
      strokeOpacity: 1
    });
    var v_option = {renderers: ['Canvas', 'SVG', 'VML'], styleMap: style};
    $scope.kmlLayer = new Tmap.Layer.Vector("kml", v_option);
    $scope.map.addLayer($scope.kmlLayer);
    setMarkerLayerIndex();
  }


  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(processLocation);
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  function processLocation(position) {
    $scope.myLonLat = transformLonLat(position.coords.longitude, position.coords.latitude);
    // $scope.map.setCenter($scope.myLonLat, 16);
    console.log("myLocation = " + $scope.myLonLat.toString());
  }

  function makeMarker(lonlat) {
    if ($scope.markerFlag == false) {
      $scope.markerFlag = true;
      return;
    }

    if ($scope.posCount == 0) {
      $scope.startLonLat = lonlat;
      $scope.posCount = 1;
    } else if ($scope.posCount == 1) {
      $scope.endLonLat = lonlat;
      getRouteWithLocations($scope.startLonLat, $scope.endLonLat);
      $scope.posCount = 0;
    }

    console.log("makeMarker : " + lonlat.toString + " , " + $scope.posCount);

    var size = new Tmap.Size(24, 38);
    var offset = new Tmap.Pixel(-(size.w / 2), -(size.h / 2));
    /*
     marker에 표시할 icon객체는 'https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png'의 경로에 있는 png파일을 가리키는데
     24픽셀 세로 38픽셀의 크기를 가지고 원래 위치에서 x축으로 -24/2만큼, y축으로 -38만큼 움직여서 표시하라 는 코드 입니다.
     */
    var icon = new Tmap.Icon('https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png', size, offset);
    // image src 는 이렇게 ~
    // var icon = new Tmap.IconHtml("<img src= 'https://developers.skplanetx.com/upload/tmap/marker/pin_b_m_a.png'></img>", size, offset);

    var marker = new Tmap.Marker(lonlat, icon);
    $scope.currentMarker = marker;
    $scope.markerLayer.addMarker(marker);
    // 위처럼 소스를 입력하면 마커가 생김
    // 아래 소스를 넣으면 센터 위치변경
    $scope.map.setCenter(lonlat, 16);

    marker.events.register("touchend", marker, onMouseMarkerEvent);
    marker.events.register("touchstart", marker, onMouseMarkerEvent);
  }

  function getTourInfoFromFireBase() {
    //todo
  }

  function addMarkerPlaceToGo() {
    $scope.tourList = getTourInfoFromFireBase();

    for (var index = 0; index < $scope.tourList.length; index++) {
      // setMarker($scope.tourList[index].lonlat);
    }
  }

  function transformLonLat(lontitude, latitude) {
    // Transform(원본좌표계, 변환할 좌표계) 함수를 사용하여 좌표를 변환해 줍니다.
    var pr_3857 = new Tmap.Projection("EPSG:3857");
    var pr_4326 = new Tmap.Projection("EPSG:4326"); // wgs84

    var resultLonLat = new Tmap.LonLat(lontitude, latitude).transform(pr_4326, pr_3857);
    console.log("resultLonLat :  " + resultLonLat.toString());
    return resultLonLat;
  }

  function setMapTouchEvent() {
    $scope.touchMoveCount = 0;
    $scope.map.events.register("touchstart", $scope.map, onTouchStart);
    $scope.map.events.register("touchend", $scope.map, onTouchEnd);
    $scope.map.events.register("touchmove", $scope.map, onTouchMove);
    $scope.map.events.register("touchcancel", $scope.map, onTouchCancel);

    function onTouchCancel(evt) {
      console.log("onTouchCancel event location " + evt);
    }

    function onTouchStart(evt) {
      console.log("onTouchStart event location " + evt);
    }

    function onTouchMove(evt) {
      console.log("onTouchMove event location : " + evt);
      $scope.touchMoveCount++;
    }

    function onTouchEnd(evt) {
      console.log("onTouchEnd event location : " + evt.xy.x + ", " + evt.xy.y);
      if ($scope.touchMoveCount > 3) {
        console.log("it might just move action");
      } else {
        makeMarker(getLonLatFromMapLocation(evt.xy.x, evt.xy.y));
      }
      $scope.touchMoveCount = 0;
    }
  }

  function getLonLatFromMapLocation(clientX, clientY) {
    return $scope.map.getLonLatFromPixel(
      new Tmap.Pixel(clientX, clientY));
  }

  function onMouseMarkerEvent(evt) {
    console.log("evt type : " + evt.type);
    if (evt.type == "touchstart") {
    } else if (evt.type == "touchend") {
      $scope.markerFlag = false;
      this.destroy();
      if ($scope.posCount == 1) $scope.posCount = 0;
      else if ($scope.posCount == 2) $scope.posCount = 1;
      console.log("onMouseMarkerEvent");
    }
  }

  function getRouteWithLocations(startLonLat, endLonLat) {
    routeLayerInit();

    var tData = new Tmap.TData();
    tData.getRoutePlan(startLonLat, endLonLat);
    tData.events.register("onComplete", tData, onComplete);
    tData.events.register("onProgress", tData, onProgress);
    tData.events.register("onError", tData, onError);

    function onProgress() {
      console.log("onProgress");
    }

    function onError() {
      console.log("onError");
    }

    function onComplete() {
      routeLayerInit();
      var kmlForm = new Tmap.Format.KML().read(this.responseXML);
      for (var i = 0; i < kmlForm.length; i++) {
        console.log("kmlForm[ " + i + " ]  : " + kmlForm[i].data.distance + " , description = " + kmlForm[i].data.name + " , " + kmlForm[i].data.description);
        $scope.kmlLayer.addFeatures([kmlForm[i]]);
      }
      setTimeout(stop, 500)
    }
  }

  function shareParam1() {
    $location.path("chattingroom").search({type: "share", sx: 14152221.255693141, sy: 4496551.406476195});
  }

  function shareParam2() {
    $location.path("chattingroom").search({
      type: "route",
      sx: 14152221.255693141,
      sy: 4496551.406476195,
      ex: 14135016.577353,
      ey: 4518074.1072027
    });
  }

  function popupTest(index, lonlat) {
    var popup = new Tmap.Popup("p1", lonlat, new Tmap.Size(100, 150),
      "<div id='popupID'>index" +
      "<button onclick='popupProxyMethod1()'>Button1</button><br/>" +
      "<button data-ng-click='popupProxyMethod1()'>Button1</button><br/>" +
      "<button data-ng-click='touchClick()'>Button4</button></div>"
    );
    $scope.map.addPopup(popup);
    popup.show();
  }

  $scope.proxyMethod = function () {
    $scope.markerFlag = false;
    console.log("proxy Method Call . ");
  }

  $scope.proxyMethod = function (eventName) {
    $scope.markerFlag = false;
    console.log("proxy Method Call : " + eventName);
  }

  initialize();
  $scope.touchClick = function () {
    console.log("touchClick invoke");
  };


});

function popupProxyMethod1() {
  console.log("popupButtonClick1 : " + this);
  angular.element(document.getElementById('popupID')).scope().proxyMethod("popupButtonClick1");
}
