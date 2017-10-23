angular.module('MobileAngularUiExamples').controller('SkMapController', ['$scope', '$http', function ($scope, $http) {

  var map = new Tmap.Map({div: "map_div", width: '100%', height: '100%'});

  // map.setCenter(new Tmap.LonLat(14135893.887852, 4518348.1852606), 14);
  var markerLayer = new Tmap.Layer.Markers();
  map.addLayer(markerLayer);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    console.log("latitude : " + position.coords.latitude + " , longtitude : " + position.coords.longitude);

    var lonlat = new Tmap.LonLat(position.coords.longitude, position.coords.latitude);
    var pr_3857 = new Tmap.Projection("EPSG:3857");
    var pr_4326 = new Tmap.Projection("EPSG:4326"); // wgs84

    // Transform(원본좌표계, 변환할 좌표계) 함수를 사용하여 좌표를 변환해 줍니다.
    // var lonlat2 = new Tmap.LonLat(position.coords.longitude, position.coords.latitude).transform(pr_3857, pr_4326);
    var lonlat2 = new Tmap.LonLat(position.coords.longitude, position.coords.latitude).transform(pr_4326, pr_3857);
    console.log("lonlat2 :  " + lonlat2.toString());
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
    markerLayer.addMarker(marker);
    // 위처럼 소스를 입력하면 마커가 생김
    // 아래 소스를 넣으면 센터 위치변경
    // map.setCenter(new Tmap.LonLat(14135893.887852,4518348.1852606), 16);

    addEventExample(map, marker);
  }

  function addPolyLine(map) {
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
    map.addLayer(vectorLayer);

    vectorLayer.addFeatures([mLineFeature]);

  }

  function addEventExample(map, marker) {
    var popup;
    popup = new Tmap.Popup("p1",
      new Tmap.LonLat(14135893.887852, 4518348.1852606),
      new Tmap.Size(100, 20),
      "<div>This is Popup Content</div>"
    );
    map.addPopup(popup);
    popup.hide();
    marker.events.register("click", marker, onMouseMarker);
    marker.events.register("mouseover", popup, onMouseMarker);
    marker.events.register("mouseout", popup, onMouseMarker);

    function onMouseMarker(evt) {
      if (evt.type == "mouseover") {
        this.show();
      } else if (evt.type == "click") {
        this.destroy();
      } else if (evt.type == "mouseout") {
        this.hide();
      }
    }
  }

  getLocation(map);
  addPolyLine(map);
//pr_3857 인스탄스 생성.
  var pr_3857 = new Tmap.Projection("EPSG:3857");

//pr_4326 인스탄스 생성.
  var pr_4326 = new Tmap.Projection("EPSG:4326");

  function get3857LonLat(coordX, coordY) {
    return new Tmap.LonLat(coordX, coordY).transform(pr_4326, pr_3857);
  }

  function get4326LonLat(coordX, coordY) {
    return new Tmap.LonLat(coordX, coordY).transform(pr_3857, pr_4326);
  }
}]);

