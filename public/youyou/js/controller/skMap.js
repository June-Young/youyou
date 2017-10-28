angular.module('MobileAngularUiExamples').controller('SkMapController', ['$scope', '$http', function ($scope) {
  $scope.posCount = 0;
  function init() {
    $scope.map = new Tmap.Map({div: "map_div", width: '100%', height: '100%'});
    $scope.markerLayer = new Tmap.Layer.Markers();
    $scope.map.addLayer($scope.markerLayer);
    $scope.map.setLanguage("EN", false); // 영문
    $scope.map.setCenter(new Tmap.LonLat(14135016.577353, 4518074.1072027), 16);
    //default : City hall station
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
    console.log("latitude : " + position.coords.latitude + " , longtitude : " + position.coords.longitude);
    $scope.myLonLat = transformLonLat(position.coords.longitude, position.coords.latitude);
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
      getRouteFromMarker($scope.startLonLat, $scope.endLonLat);
      $scope.posCount = 0;
    }

    console.log("makeMarker : " + lonlat + " , " + $scope.posCount);

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

    marker.events.register("click", marker, onMouseMarkerEvent);
    marker.events.register("mouseover", marker, onMouseMarkerEvent);
    marker.events.register("mouseout", marker, onMouseMarkerEvent);
  }

  function getTourInfoFromFireBase() {
    //todo
  }

  function addMarkerPlaceToGo() {
    $scope.tourList = getTourInfoFromFireBase();

    for (var index = 0; index < $scope.tourList.length; index++) {
      setMarker($scope.tourList[index].lonlat);
    }

  }

  function setMarker(lonlat) {
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
    marker.events.register("click", marker, onMouseMarkerEvent);
    marker.events.register("touchend", marker, onMouseMarkerEvent);
    marker.events.register("mouseover", marker, onMouseMarkerEvent);
    marker.events.register("mouseout", marker, onMouseMarkerEvent);
  }

  function transformLonLat(lontitude, latitude) {
    // Transform(원본좌표계, 변환할 좌표계) 함수를 사용하여 좌표를 변환해 줍니다.
    var pr_3857 = new Tmap.Projection("EPSG:3857");
    var pr_4326 = new Tmap.Projection("EPSG:4326"); // wgs84

    var resultLonLat = new Tmap.LonLat(lontitude, latitude).transform(pr_4326, pr_3857);
    console.log("resultLonLat :  " + resultLonLat.toString());
    return resultLonLat;
  }

  function addMapEvent() {
    // $scope.map.events.register("click", $scope.map, onClickMap);
    $scope.map.events.register("touchstart", $scope.map, onTouchStart);
    $scope.map.events.register("touchend", $scope.map, onTouchEnd);
    $scope.map.events.register("touchmove", $scope.map, onTouchMove);
    $scope.map.events.register("touchcancel", $scope.map, onTouchCancel);
  }

  function onTouchCancel(evt) {
    console.log("onTouchCancel event location " + evt);
  }

  function onTouchStart(evt) {
    console.log("onTouchStart event location " + evt);
  }

  $scope.touchMoveCount = 0;
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

  function getLonLatFromMapLocation(clientX, clientY) {
    // it will return Tmap.LonLat
    return $scope.map.getLonLatFromPixel(
      new Tmap.Pixel(clientX, clientY));
  }

  function onMouseMarkerEvent(evt) {
    console.log("evt type : " + evt.type);
    if (evt.type == "mouseover") {
    } else if (evt.type == "click") {
      $scope.markerFlag = false;
      this.destroy();
      if ($scope.posCount == 1) $scope.posCount = 0;
      else if ($scope.posCount == 2) $scope.posCount = 1;
      console.log("onMouseMarkerEvent");
    } else if (evt.type == "mouseout") {
    }
  }

  function getRouteFromMarker(startLonLat, endLonLat) {
    routeLayerInit();

    var tData = new Tmap.TData();

    tData.getRoutePlan(startLonLat, endLonLat);
    tData.events.register("onComplete", tData, onComplete);
    tData.events.register("onProgress", tData, onProgress);
    tData.events.register("onError", tData, onError);
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

  function popupTest(index, lonlat) {
    var popup = new Tmap.Popup("p1", lonlat, new Tmap.Size(100, 150),
      "<div id='popupID'>index" +
      "<button onclick='popupProxyMethod1()'>Button1</button><br/>" +
      "<button ng-click='proxyMethod()'>Button4</button></div>"
    );
    $scope.map.addPopup(popup);
    popup.show();
  }

  function onProgress() {
    console.log("onProgress");
  }

  function onError() {
    console.log("onError");
  }

  function addEventExample() {
    console.log("addEventExample()");
    var popup = new Tmap.Popup("p1",
      new Tmap.LonLat(14152157.580944417, 4499026.955219546),
      new Tmap.Size(100, 150),
      "<div id='popupID'>1<button onclick='popButtonClick()'>Button</button></div>"
    );
    $scope.map.addPopup(popup);
  }

  init();
  getCurrentLocation($scope.map);
  addMapEvent();

  $scope.proxyMethod = function () {
    $scope.markerFlag = false;
    console.log("proxy Method Call . ");
  }

  $scope.proxyMethod = function (eventName) {
    $scope.markerFlag = false;
    console.log("proxy Method Call : " + eventName);
  }
}]);

function popupProxyMethod1() {
  console.log("popupButtonClick1 : " + this);
  angular.element(document.getElementById('popupID')).scope().proxyMethod("popupButtonClick1");
}
function popupProxyMethod2() {
  console.log("popupButtonClick2 : " + this);
  angular.element(document.getElementById('popupID')).scope().proxyMethod("popupButtonClick2");
}
function popupProxyMethod3() {
  console.log("popupButtonClick3: " + this);
  angular.element(document.getElementById('popupID')).scope().proxyMethod("popupButtonClick3");
}


