'use strict';

/**
 * @ngdoc function
 * @name dianApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the dianApp
 */
angular.module('dianApp')
    .config(["$stateProvider", function($stateProvider){
        $stateProvider
            .state('restaurant', {
                url: "/restaurant",
                controller: "RestaurantCtrl",
                templateUrl: "views/restaurant.html"
            })

    }])

    .controller('RestaurantCtrl', ['$scope', '$http', 'fileUpload', function ($scope, $http, fileUpload) {
        $http({url: config.api_url + '/restaurant/uptoken-restaurant/', method: 'GET'})
            .success(function (data, status, headers, config) {
                $scope.uptoken = data.uptoken;
            });

        $http({url: config.api_url + '/restaurant/qiniu-domain/', method: 'GET'})
            .success(function (data, status, headers, config) {
                $scope.qiniu_domain = data.domain;
            });

        $scope.restaurant_update = {};

        $scope.save = function () {
        };

        $scope.update = function () {

          // 上传文件部分
          var file = $scope.background;
          var uploadUrl = "http://upload.qiniu.com/";
          var key = 'restaurant-'+$scope.$parent.restaurant.id;
          fileUpload.uploadFileToUrl(file, uploadUrl, $scope.uptoken, key, function () {
            console.log('upload completed');
            // 数据库中的file_key字段或许应该在此处回调
          });

          // 跟新数据库部分
          $scope.restaurant_update['restaurant_id'] = $scope.$parent.restaurant.id;
          $http({
            method: 'PUT',
            url: config.api_url + '/restaurant/update-restaurant/',
            data: $.param($scope.restaurant_update),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          })
          .success(function (data, status, headers, config) {
            console.log(data);
            console.log(status);
          })
          .error(function (data, status, headers, config) {
            // Handle errors here
            console.log('error!!!!!!');
            console.log(data);
            console.log(status);
          });

        };

    }]);
