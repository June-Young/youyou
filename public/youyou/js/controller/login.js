'use strict';
var app = angular.module('YouyouWebapp');
app.controller('login', function ($scope, $location) {

  $scope.clickSubmit = function () {

    var id = $scope.edit_id;
    var pw = SHA256($scope.edit_pw);


    var userRef = firebase.database().ref('users/' + id);

    userRef.once('value').then(function (userInfo) {
      if (userInfo.val()) {
        console.log(userInfo.key);
        console.log(userInfo.val());
        if (pw === userInfo.val().password) {
          console.log("비밀번호가 일치합니다.");
          sessionStorage.setItem("myid", id);

          pageChange("home");
        } else {
          console.log("비밀번호가 틀립니다.");
          $scope.$apply(function () {
            $scope.state = "비밀번호가 틀립니다.";
          });
        }
      } else {
        console.log("회원 정보가 없습니다.");
        $scope.state = "회원 정보가 없습니다. 회원가입 합니다.";
        sessionStorage.setItem("myid", id);
        firebase.database().ref('users/' + id).set({password: pw, photoURL: '/youyou/img/profile_placeholder.png'});

        pageChange("nickname");
      }
    });
  };

  var pageChange = function (path) {
    $scope.$apply(function () {
      $location.path(path);
    });
  };

  function SHA256(s) {

    var chrsz = 8;
    var hexcase = 0;

    function safe_add(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    function S(X, n) {
      return ( X >>> n ) | (X << (32 - n));
    }

    function R(X, n) {
      return ( X >>> n );
    }

    function Ch(x, y, z) {
      return ((x & y) ^ ((~x) & z));
    }

    function Maj(x, y, z) {
      return ((x & y) ^ (x & z) ^ (y & z));
    }

    function Sigma0256(x) {
      return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
    }

    function Sigma1256(x) {
      return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
    }

    function Gamma0256(x) {
      return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
    }

    function Gamma1256(x) {
      return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
    }

    function core_sha256(m, l) {
      var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
      var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;

      m[l >> 5] |= 0x80 << (24 - l % 32);
      m[((l + 64 >> 9) << 4) + 15] = l;

      for (var i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        for (var j = 0; j < 64; j++) {
          if (j < 16) W[j] = m[j + i];
          else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

          T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
          T2 = safe_add(Sigma0256(a), Maj(a, b, c));

          h = g;
          g = f;
          f = e;
          e = safe_add(d, T1);
          d = c;
          c = b;
          b = a;
          a = safe_add(T1, T2);
        }

        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }

    function str2binb(str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
      }
      return bin;
    }

    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }

      return utftext;
    }

    function binb2hex(binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
          hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8  )) & 0xF);
      }
      return str;
    }

    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

  }

  /*
    $scope.signInGoogle = function () {


      var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithRedirect(provider).then(function () {
            console.log('signin google');
          });


    };
    $scope.signInFacebook = function () {
       var provider = new firebase.auth.FacebookAuthProvider();
       firebase.auth().signInWithRedirect(provider).then(function () {
         console.log('signin google');
       });
    };
  */


  /*firebase.auth().onAuthStateChanged(function (user) {
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
  });*/
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
  $scope.clickedJapanese = function () {
    var myid = sessionStorage.getItem("myid");
    console.log('language');
    console.log(myid);
    firebase.database().ref("users/" + myid).update({language: 'japanese'});
    //firebase에 업데이트하고
    $location.path("country")
  }
  $scope.clickedChinese = function () {
    var myid = sessionStorage.getItem("myid");
    console.log('language');
    console.log(myid);
    firebase.database().ref("users/" + myid).update({language: 'chinese'});
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

