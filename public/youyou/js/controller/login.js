'use strict';
var app = angular.module('YouyouWebapp');
app.controller('login', function ($scope, $location) {
  $scope.signInGoogle = function () {


    var google = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google).then(function () {
      console.log('signin google');
    });

  };
  $scope.signInFacebook = function () {

    var facebook = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebook).then(function () {
      console.log('signin facebook');
    });
  };

  var pageChange = function (path) {
    $scope.$apply(function () {
      $location.path(path);
    });
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

      var uid = user.uid;
      var userRef = firebase.database().ref('users/' + uid);
      console.log("login. " + uid);
      //정보 가져오거나 넣거나해야지

      userRef.once('value').then(function (data) {
        var info = data.val();
        if (info) {
          sessionStorage.setItem("myid", uid);
          pageChange("home");

          //가입된 유저
        } else {
          //신규유저.
          sessionStorage.setItem("myid", uid);
          userRef.set({displayName: user.displayName, photoURL: user.photoURL});
          pageChange("nickname");
        }
      });
    }
  });
});

app.controller('nickname', function ($scope, $location) {

  $scope.clickSubmit = function () {
    if ($scope.edit) {
      if ($scope.edit.length > 0) {
        //firebase로 submit
        var myid = sessionStorage.getItem("myid");
        firebase.database().ref("users/" + myid).update({displayName: $scope.edit});
        $location.path("language");
      }
    } else {
      console.log("닉네임을 입력하고 누르세요.");
    }

  }
});

app.controller('LanguageController', function ($scope, $location) {

  $scope.clickedEnglish = function () {
    var myid = sessionStorage.getItem("myid");
    console.log('language');
    console.log(myid);
    firebase.database().ref("users/" + myid).update({language: 'english'});
    //firebase에 업데이트하고
    $location.path("country")
  }
});
app.controller('CountryController', function ($scope, $location) {
  $scope.selected = function () {
    // console.log($scope.countrySelect);
    var selected = $scope.countrySelect;
    var myid = sessionStorage.getItem("myid");
    firebase.database().ref("users/" + myid).update({country: selected});
    $location.path("welcome");
  };
  $scope.countries = [
    {country: 'Afghanistan'},
    {country: 'Albania'},
    {country: 'Algeria'},
    {country: 'Andorra'},
    {country: 'Angola'},
    {country: 'Antigua and Barbuda'},
    {country: 'Argentina'},
    {country: 'Armenia'},
    {country: 'Australia'},
    {country: 'Austria'},
    {country: 'Azerbaijan'},
    {country: 'Bahamas'},
    {country: 'Bahrain'},
    {country: 'Bangladesh'},
    {country: 'Barbados'},
    {country: 'Belarus'},
    {country: 'Belgium'},
    {country: 'Belize'},
    {country: 'Benin'},
    {country: 'Bhutan'},
    {country: 'Bolivia'},
    {country: 'Bosnia and Herzegovina'},
    {country: 'Botswana'},
    {country: 'Brazil'},
    {country: 'Brunei'},
    {country: 'Bulgaria'},
    {country: 'Burkina Faso'},
    {country: 'Burundi'},
    {country: 'Cabo Verde'},
    {country: 'Cambodia'},
    {country: 'Cameroon'},
    {country: 'Canada'},
    {country: 'Central African Republic (CAR)'},
    {country: 'Chad'},
    {country: 'Chile'},
    {country: 'China'},
    {country: 'Colombia'},
    {country: 'Comoros'},
    {country: 'Democratic Republic of the Congo'},
    {country: 'Republic of the Congo'},
    {country: 'Costa Rica'},
    {country: 'Cote d`Ivoire'},
    {country: 'Croatia'},
    {country: 'Cuba'},
    {country: 'Cyprus'},
    {country: 'Czech Republic'},
    {country: 'Denmark'},
    {country: 'Djibouti'},
    {country: 'Dominica'},
    {country: 'Dominican Republic'},
    {country: 'Ecuador'},
    {country: 'Egypt'},
    {country: 'El Salvador'},
    {country: 'Equatorial Guinea'},
    {country: 'Eritrea'},
    {country: 'Estonia'},
    {country: 'Ethiopia'},
    {country: 'Fiji'},
    {country: 'Finland'},
    {country: 'France'},
    {country: 'Gabon'},
    {country: 'Gambia'},
    {country: 'Georgia'},
    {country: 'Germany'},
    {country: 'Ghana'},
    {country: 'Greece'},
    {country: 'Grenada'},
    {country: 'Guatemala'},
    {country: 'Guinea'},
    {country: 'Guinea-Bissau'},
    {country: 'Guyana'},
    {country: 'Haiti'},
    {country: 'Honduras'},
    {country: 'Hungary'},
    {country: 'Iceland'},
    {country: 'India'},
    {country: 'Indonesia'},
    {country: 'Iran'},
    {country: 'Iraq'},
    {country: 'Ireland'},
    {country: 'Israel'},
    {country: 'Italy'},
    {country: 'Jamaica'},
    {country: 'Japan'},
    {country: 'Jordan'},
    {country: 'Kazakhstan'},
    {country: 'Kenya'},
    {country: 'Kiribati'},
    {country: 'Kosovo'},
    {country: 'Kuwait'},
    {country: 'Kyrgyzstan'},
    {country: 'Laos'},
    {country: 'Latvia'},
    {country: 'Lebanon'},
    {country: 'Lesotho'},
    {country: 'Liberia'},
    {country: 'Libya'},
    {country: 'Liechtenstein'},
    {country: 'Lithuania'},
    {country: 'Luxembourg'},
    {country: 'Macedonia (FYROM)'},
    {country: 'Madagascar'},
    {country: 'Malawi'},
    {country: 'Malaysia'},
    {country: 'Maldives'},
    {country: 'Mali'},
    {country: 'Malta'},
    {country: 'Marshall Islands'},
    {country: 'Mauritania'},
    {country: 'Mauritius'},
    {country: 'Mexico'},
    {country: 'Micronesia'},
    {country: 'Moldova'},
    {country: 'Monaco'},
    {country: 'Mongolia'},
    {country: 'Montenegro'},
    {country: 'Morocco'},
    {country: 'Mozambique'},
    {country: 'Myanmar (Burma)'},
    {country: 'Namibia'},
    {country: 'Nauru'},
    {country: 'Nepal'},
    {country: 'Netherlands'},
    {country: 'New Zealand'},
    {country: 'Nicaragua'},
    {country: 'Niger'},
    {country: 'Nigeria'},
    {country: 'North Korea'},
    {country: 'Norway'},
    {country: 'Oman'},
    {country: 'Pakistan'},
    {country: 'Palau'},
    {country: 'Palestine'},
    {country: 'Panama'},
    {country: 'Papua New Guinea'},
    {country: 'Paraguay'},
    {country: 'Peru'},
    {country: 'Philippines'},
    {country: 'Poland'},
    {country: 'Portugal'},
    {country: 'Qatar'},
    {country: 'Romania'},
    {country: 'Russia'},
    {country: 'Rwanda'},
    {country: 'Saint Kitts and Nevis'},
    {country: 'Saint Lucia'},
    {country: 'Saint Vincent and the Grenadines'},
    {country: 'Samoa'},
    {country: 'San Marino'},
    {country: 'Sao Tome and Principe'},
    {country: 'Saudi Arabia'},
    {country: 'Senegal'},
    {country: 'Serbia'},
    {country: 'Seychelles'},
    {country: 'Sierra Leone'},
    {country: 'Singapore'},
    {country: 'Slovakia'},
    {country: 'Slovenia'},
    {country: 'Solomon Islands'},
    {country: 'Somalia'},
    {country: 'South Africa'},
    {country: 'South Korea'},
    {country: 'South Sudan'},
    {country: 'Spain'},
    {country: 'Sri Lanka'},
    {country: 'Sudan'},
    {country: 'Suriname'},
    {country: 'Swaziland'},
    {country: 'Sweden'},
    {country: 'Switzerland'},
    {country: 'Syria'},
    {country: 'Taiwan'},
    {country: 'Tajikistan'},
    {country: 'Tanzania'},
    {country: 'Thailand'},
    {country: 'Timor-Leste'},
    {country: 'Togo'},
    {country: 'Tonga'},
    {country: 'Trinidad and Tobago'},
    {country: 'Tunisia'},
    {country: 'Turkey'},
    {country: 'Turkmenistan'},
    {country: 'Tuvalu'},
    {country: 'Uganda'},
    {country: 'Ukraine'},
    {country: 'United Arab Emirates (UAE)'},
    {country: 'United Kingdom (UK)'},
    {country: 'United States of America (USA)'},
    {country: 'Uruguay'},
    {country: 'Uzbekistan'},
    {country: 'Vanuatu'},
    {country: 'Vatican City (Holy See)'},
    {country: 'Venezuela'},
    {country: 'Vietnam'},
    {country: 'Yemen'},
    {country: 'Zambia'},
    {country: 'Zimbabwe'}
  ]
});

app.controller('LogoutController', function ($scope, $location) {

  var unsubscirbe = firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      firebase.auth().signOut();
    } else {
    }
  });
  unsubscirbe();
});
app.controller('WelcomeController', function ($scope, $location) {
  setTimeout(function () {
    $scope.$apply(function () {
      $location.path("home")
    });
  }, 2000);
});

app.directive('watcher', [function () {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var btn = document.getElementById("smbtn");
      scope.$watch(attrs.ngModel, function (v) {
        if (v) {
          btn.style.opacity = 1;
        } else {
          btn.style.opacity = 0.5;
        }
      });
    }
  }
}]);

