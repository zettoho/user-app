'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('PortNumbersCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, $shared, $q) {
    $shared.updateTitle("Ported Numbers");
    $scope.pagination = pagination;
  $scope.numbers = [];
  $scope.load = function() {
    return $q(function(resolve, reject) {
      $shared.isLoading = true;
      pagination.resetSearch();
      pagination.changeUrl( "/port/listNumbers" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'numbers' );
      pagination.loadData().then(function(res) {
      $scope.numbers = res.data.data;
      $shared.endIsLoading();
      resolve();
    }, reject);
  });
  }
  $scope.portNumber = function() {
    $state.go('port-create', {});
  }
  $scope.editNumber = function(number) {
    $state.go('port-edit', {numberId: number.public_id});
  }
  $scope.deleteNumber = function($event, number) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this number?')
          .textContent('If you delete this number you will not be able to call it anymore')
          .ariaLabel('Delete number')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      $shared.isLoading = true;
      Backend.delete("/port/deleteNumber/" + number.id).then(function() {
          $scope.load().then(function() {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Number deleted..')
                .position("top right")
                .hideDelay(3000)
            );
          });

      })
    }, function() {
    });
  }

  $scope.load();
});

