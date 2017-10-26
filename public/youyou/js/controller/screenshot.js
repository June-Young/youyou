// angular.module('MobileAngularUiExamples').controller('ScreenController', ['$scope', function ($scope) {
//   var self = this;
//   self.target1Options = {
//     filename: 'target1.png',
//     downloadText: 'Download me',
//     cancelText: 'Close it!'
//   };
// }]);

'use strict';
(function () {
  angular.module('MobileAngularUiExamples', ['angular-screenshot'])
    .controller('ScreenController', ['$scope']);
  function appController($scope) {
    var self = this;
    self.target1Options = {
      filename: 'target1.png',
      downloadText: 'Download me',
      cancelText: 'Close it!'
    };
  }
})()
