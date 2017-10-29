angular.module('YouyouWebapp').controller('TourApiController', ['$scope', '$http', function ($scope, $http) {

  var xhr = new XMLHttpRequest();
  var url = 'http://api.visitkorea.or.kr/openapi/service/rest/EngService/areaBasedList';
  /*URL*/
  // var queryParams = '?' + encodeURIComponent('ServiceKey=HhrECqzufRXVG0eu29dQiHlsLbE81HPYzQyl8cNQx7RVbo7EtZH9xoi01%2Fz6eaoyD4Nw75zT%2B1%2FpxYMY%2FOAAFA%3D%3D');
  /*Service Key*/
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent('HhrECqzufRXVG0eu29dQiHlsLbE81HPYzQyl8cNQx7RVbo7EtZH9xoi01%2Fz6eaoyD4Nw75zT%2B1%2FpxYMY%2FOAAFA%3D%3D');
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('999');
  queryParams += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('AND');
  queryParams += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('youyou');
  queryParams += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent('78'); /*관광타입(관광지, 숙박 등) ID*/
  queryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent('4'); /*지역코드*/
  queryParams += '&' + encodeURIComponent('sigunguCode') + '=' + encodeURIComponent('4'); /*시군구코드(areaCode 필수)*/
  xhr.open('GET', url + queryParams);
  http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList
    // ?ServiceKey=ABCDEFGHIJKLMN3D%3D&MobileOS=ETC&MobileApp=AppTest&numOfRows=99999&areaCode=1&sigunguCode=1

  console.log("url : " + url);
  console.log("queryParam : " + queryParams);
  console.log("full :" + url+queryParams);

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      console.log('Status: ' + this.status + ' Headers: ' + JSON.stringify(this.getAllResponseHeaders()) + ' Body: ' + this.responseText);
    }
  };

  xhr.send('');
}]);
