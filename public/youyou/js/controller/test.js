angular.module('MobileAngularUiExamples').controller('TestController', function ($scope) {

  $scope.name = "Select Files to Upload";
  $scope.images = [];
  $scope.display = $scope.images[$scope.images.length - 1];

  $scope.shareImage = function(){
    console.log("shareImage");
    for( var index = 0 ; index < $scope.images.length ; index ++){
      console.log($scope.images[index]);
    }
  }
  $scope.setImage = function (ix) {
    $scope.display = $scope.images[ix];
  }
  $scope.clearAll = function () {
    $scope.display = '';
    $scope.images = [];
  }
  $scope.upload = function (obj) {
    var elem = obj.target || obj.srcElement;
    for (i = 0; i < elem.files.length; i++) {
      var file = elem.files[i];
      var reader = new FileReader();

      reader.onload = function (e) {
        $scope.images.push(e.target.result);
        $scope.display = e.target.result;
        $scope.$apply();
      }
      reader.readAsDataURL(file);
    }
  }


});
