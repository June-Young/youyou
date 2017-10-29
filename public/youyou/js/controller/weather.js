'use strict';

angular.module('YouyouWebapp').controller('WeatherController', ['$scope', '$http', function ($scope, $http) {

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      // x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    console.log("latitude : " + position.coords.latitude + " , longtitude : " + position.coords.longitude);
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
        'x-requested-with' : "XMLHTTPREQUEST"
      }
    }

    console.log("getWeatherInfo req : "+ req.url);
    $http(req).then(function (response) {

      console.info(response);
      // $scope.humidity = response.data;
      $scope.todaySky = response.data.weather.summary[0].today.sky.name;
      $scope.todayTemperatureMax = response.data.weather.summary[0].today.temperature.tmax;
      $scope.todayTemperatureMin = response.data.weather.summary[0].today.temperature.tmin;
      $scope.tomorrowSky = response.data.weather.summary[0].tomorrow.sky.name;
      // $scope.weatherInfo = response.data;
    }, function () {
      console.info("hello");
    });
  }

  function getCurrentWeather(longtude, latitude) {
    var req = {
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/http://apis.skplanetx.com/weather/current/minutely?version=1&lat=' + latitude + '&lon=' + longtude,
      headers: {
        'appKey': "54c99cf9-dd09-3934-9707-b60bf42f45be",
        'Accept': "application/json",
        'x-requested-with' : "XMLHTTPREQUEST"
      }
    }
    console.log("getCurrentWeather req : "+ req.url);
    $http(req).then(function (response) {

      console.info(response);
      // $scope.humidity = response.data;
      $scope.temperatureCurrent = response.data.weather.minutely[0].temperature.tc;
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
        'x-requested-with' : "XMLHTTPREQUEST"
      }
    }

    console.log("getDustInfo req : "+ req.url);
    $http(req).then(function (response) {

      console.info(response.data);
      $scope.dustGrade = response.data.weather.dust[0].pm10.grade;
    }, function () {
      console.info("hello");
    });
  }

  getLocation();
}]);
