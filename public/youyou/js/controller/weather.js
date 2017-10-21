'use strict';

angular.module('MobileAngularUiExamples').controller('WeatherController', ['$scope', '$http', function ($scope, $http) {

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
  }

  function getWeatherInfo(longtude, latitude) {
    var req = {
      method: 'GET',
      url: 'http://apis.skplanetx.com/weather/current/minutely?version=1&lat=' + latitude + '&lon=' + longtude,
      headers: {
        'appKey': "54c99cf9-dd09-3934-9707-b60bf42f45be",
        'Accept': "application/json"
      }
    }

    $http(req).then(function (response) {

      console.info(response);
      console.info("Test[0]   " + response.data.weather.minutely[0].humidity);
      console.info("Test[0]   " + response.data.weather.minutely[0].sky.name);
      console.info("Test[0]   " + response.data.weather.minutely[0].temperature.tmax);
      console.info("Test[0]   " + response.data.weather.minutely[0].temperature.tmin);

      $scope.humidity = response.data.weather.minutely[0].humidity;
      $scope.sky = response.data.weather.minutely[0].sky.name;
      $scope.tmax = response.data.weather.minutely[0].temperature.tmax;
      $scope.tmin = response.data.weather.minutely[0].temperature.tmin;
      $scope.weatherInfo = response.data;
    }, function () {
      console.info("hello");
    });
  }
  getLocation();
}]);
