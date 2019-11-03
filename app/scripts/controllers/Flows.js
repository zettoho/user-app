'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of MaterialApp
 */
angular.module('MaterialApp').controller('FlowsCtrl', function ($scope, Backend, pagination, $location, $state, $mdDialog, $mdToast, SharedPref) {
    SharedPref.updateTitle("Flows");
    $scope.pagination = pagination;
  $scope.settings = {
    page: 0
  };
  $scope.flows = [];
  $scope.load = function() {
    SharedPref.isLoading =true;
      pagination.changeUrl( "/flow/listFlows" );
      pagination.changePage( 1 );
      pagination.changeScope( $scope, 'flows' );
      pagination.loadData().then(function(res) {
      $scope.flows = res.data.data;
      SharedPref.endIsLoading();
    })
  }
  $scope.editFlow = function(flow) {
    SharedPref.changeRoute('flow-editor', {flowId: flow.id});
  }
  $scope.createFlow = function() {
    SharedPref.changeRoute('flow-editor', {flowId: "new"}); 
  }
  $scope.deleteFlow = function($event, flow) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this flow?')
          .textContent('This will permantely remove the flow and also unset the flow on numbers that have this flow attached to it')
          .ariaLabel('Delete flow')
          .targetEvent($event)
          .ok('Yes')
          .cancel('No');
    $mdDialog.show(confirm).then(function() {
      Backend.delete("/flow/deleteFlow/" + flow.id).then(function() {
           $mdToast.show(
          $mdToast.simple()
            .textContent('Flow deleted..')
            .position("top right")
            .hideDelay(3000)
        );
          $scope.load();

      })
    }, function() {
    });
  }

  $scope.load();
});

