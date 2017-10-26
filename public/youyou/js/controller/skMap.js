angular.module('MobileAngularUiExamples').controller('SkMapController', ['$scope', '$http', function ($scope, $http, $event) {
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
      // x.innerHTML = "Geolocation is not supported by this browser.";
      alert("Geolocation is not supported by this browser");
    }
  }

  function processLocation(position) {

    console.log("latitude : " + position.coords.latitude + " , longtitude : " + position.coords.longitude);
    $scope.myLonLat = transformLonLat(position.coords.longitude, position.coords.latitude);
    // makeMarker($scope.myLonLat);
    // addEventExample();
    popupTest($scope.myLonLat);
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

  // map.setCenter(new Tmap.LonLat(14135893.887852, 4518348.1852606), 14);

  function addPolyLine() {
    var pointList = [];
    pointList.push(new Tmap.Geometry.Point(14132077.76641, 4520441.6071475));
    pointList.push(new Tmap.Geometry.Point(14133147.884806, 4519180.3961808));
    pointList.push(new Tmap.Geometry.Point(14134982.373485, 4519132.6230381));
    pointList.push(new Tmap.Geometry.Point(14136644.87885, 4519209.0600664));
    pointList.push(new Tmap.Geometry.Point(14136797.752907, 4517603.8824724));
    pointList.push(new Tmap.Geometry.Point(14134533.305944, 4516906.3945893));
    pointList.push(new Tmap.Geometry.Point(14134370.877259, 4515377.6540236));
    pointList.push(new Tmap.Geometry.Point(14134370.877259, 4514919.0318539));
    pointList.push(new Tmap.Geometry.Point(14132498.170066, 4513476.282945));

    var lineString = new Tmap.Geometry.LineString(pointList);

    var style_bold = {strokeWidth: 6};
    var mLineFeature = new Tmap.Feature.Vector(lineString, null, style_bold);

    var vectorLayer = new Tmap.Layer.Vector("vectorLayerID");
    $scope.map.addLayer(vectorLayer);

    vectorLayer.addFeatures([mLineFeature]);

  }

  function addMapEvent() {
    $scope.map.events.register("click", $scope.map, onClickMap)
  }

  function onClickMap(evt) {
    console.log("click event location : " + evt.clientX, evt.clientY);
    if (evt.type == "click") {
      makeMarker(getLonLatFromMapLocation(evt.clientX, evt.clientY));
    }
  }

  function getLonLatFromMapLocation(clientX, clientY) {
    // it will return Tmap.LonLat
    return $scope.map.getLonLatFromPixel(
      new Tmap.Pixel(clientX, clientY));
  }

  function onMouseMarkerEvent(evt) {

    if (evt.type == "mouseover") {
      // this.show();
    } else if (evt.type == "click") {
      $scope.markerFlag = false;
      // addEventExample();
      this.destroy();
      if ($scope.posCount == 1) $scope.posCount = 0;
      else if ($scope.posCount == 2) $scope.posCount = 1;
      console.log("onMouseMarkerEvent");
    } else if (evt.type == "mouseout") {
      // this.hide();
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
    // 여기서 return 된 feature 들을 vector layer 에 출력
    // console.log("response : " + response);
    // jQuery('#loading').css('display', "block");
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
      "<button onclick='popupProxyMethod2()'>Button2</button><br/>" +
      "<button onclick='popupProxyMethod3()'>Button3</button></div>"
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
    // popup.show();
    // popup.hide();
  }

  init();
  getCurrentLocation($scope.map);
  addMapEvent();

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


