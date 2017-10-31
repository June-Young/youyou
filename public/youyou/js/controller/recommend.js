var app = angular.module('YouyouWebapp');


app.controller('RecommendMainController', function ($scope, $location, $http) {

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


  $scope.tomorrowSky = '/youyou/img/sunny.svg';
  $scope.todaySky = '/youyou/img/sunny.svg';
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {

    getWeatherInfo(position.coords.longitude, position.coords.latitude);
    getDustInfo(position.coords.longitude, position.coords.latitude);
    getCurrentWeather(position.coords.longitude, position.coords.latitude);
  }

  function getWeatherInfo(longtude, latitude) {
    var req = {
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/http://apis.skplanetx.com/weather/summary?version=1&lat=' + latitude + '&lon=' + longtude,
      headers: {
        'appKey': "54c99cf9-dd09-3934-9707-b60bf42f45be",
        'Accept': "application/json",
        'x-requested-with': "XMLHTTPREQUEST"
      }
    };
    console.log("getWeatherInfo req : " + req.url);
    $http(req).then(function (response) {

      console.info(response);
      $scope.myLocation=response.data.weather.summary[0].grid.city + ','+response.data.weather.summary[0].grid.county;
      // $scope.humidity = response.data;

      var today = weatherTextToImg(response.data.weather.summary[0].today.sky.code);
      if (today === 'sunny') {
        $scope.todaySky = '/youyou/img/sunny.svg';
      } else if (today === 'rain') {
        $scope.todaySky = '/youyou/img/rain.svg';
      } else if (today === 'snow') {
        $scope.todaySky = '/youyou/img/snow.svg';
      } else if (today === 'flash') {
        $scope.todaySky = '/youyou/img/flash.svg';
      } else if (today === 'cloud') {
        $scope.todaySky = '/youyou/img/sunny.svg';
      } else {
        $scope.todaySky = '/youyou/img/sunny.svg';
      }

      $scope.todayTemperatureMax = Math.round(response.data.weather.summary[0].today.temperature.tmax)+'℃';
      $scope.todayTemperatureMin = Math.round(response.data.weather.summary[0].today.temperature.tmin)+'℃';

      var tomorrow = weatherTextToImg(response.data.weather.summary[0].tomorrow.sky.code);
      if (tomorrow === 'sunny') {
        $scope.tomorrowSky = '/youyou/img/sunny.svg';
      } else if (tomorrow === 'rain') {
        $scope.tomorrowSky = '/youyou/img/rain.svg';
      } else if (tomorrow === 'snow') {
        $scope.tomorrowSky = '/youyou/img/snow.svg';
      } else if (tomorrow === 'flash') {
        $scope.tomorrowSky = '/youyou/img/flash.svg';
      } else if (tomorrow === 'cloud') {
        $scope.tomorrowSky = '/youyou/img/sunny.svg';
      } else {
        $scope.tomorrowSky = '/youyou/img/sunny.svg';
      }
    }, function () {
      console.info("hello");
    });
  }

  function weatherTextToImg(code) {

    if (code === 'SKY_A01' || code === 'SKY_A02') {
      return 'sunny';
    } else if (code === 'SKY_A04' || code === 'SKY_A06' || code === 'SKY_A08' || code === 'SKY_A10' || code === 'SKY_A12' || code === 'SKY_A13' || code === 'SKY_A14') {
      return 'rain';
    } else if (code === 'SKY_A05' || code === 'SKY_A09') {
      return 'snow';
    } else if (code === 'SKY_A11') {
      return 'flash';
    } else if (code === 'SKY_A03' || code === 'SKY_A07') {
      return 'cloud';
    }
  }

  function getCurrentWeather(longtude, latitude) {
    var req = {
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/http://apis.skplanetx.com/weather/current/minutely?version=1&lat=' + latitude + '&lon=' + longtude,
      headers: {
        'appKey': "54c99cf9-dd09-3934-9707-b60bf42f45be",
        'Accept': "application/json",
        'x-requested-with': "XMLHTTPREQUEST"
      }
    };

    console.log("getCurrentWeather req : " + req.url);
    $http(req).then(function (response) {

      console.info(response);
      // $scope.humidity = response.data;
      $scope.temperatureCurrent =  Math.round(response.data.weather.minutely[0].temperature.tc)+'℃';
      // $scope.weatherInfo = response.data;
    }, function () {
      console.info("hello");
    });
  }

  function getDustInfo(longtude, latitude) {
    var req = {
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/http://apis.skplanetx.com/weather/dust?version=1&lat=' + latitude + '&lon=' + longtude,
      headers: {
        'appKey': "54c99cf9-dd09-3934-9707-b60bf42f45be",
        'Accept': "application/json",
        'x-requested-with': "XMLHTTPREQUEST"
      }
    };

    console.log("getDustInfo req : " + req.url);
    $http(req).then(function (response) {

      console.info(response.data.weather.dust[0].pm10.value);
      console.info(response.data.weather.dust[0]);
      var dustValue=response.data.weather.dust[0].pm10.value;
      var dustState='';
      if(dustValue > 0 && dustValue <= 30){
        dustState='GOOD';
      }else if(dustValue > 30 && dustValue <= 80){
        dustState='NORMAL';
      }else if(dustValue > 80 && dustValue <= 300){
        dustState='POOR';
      }
      $scope.dustGrade = dustState

      // 0~30: 좋음, 31~80: 보통, 81~120: 약간나쁨, 121~200: 나쁨, 201~300: 매우나쁨
    }, function () {
      console.info("hello");
    });
  }

  getLocation();
});
