'use strict';

angular.module('earthquakeApp').controller('MapCtrl', function ($scope) {
    $scope.timeframes = [
      { label: 'In the last hour', value: 60*60*1000 },
      { label: 'Today', value: 60*60*24*1000 },
      { label: 'Since Yesterday', value: 60*60*24*2*1000 },
      { label: 'This Week', value: 60*60*24*7*1000 },
      { label: 'Since Last Week', value: 60*60*24*7*2*1000 },
      { label: 'This Month', value: 60*60*24*7*4*1000 }
    ];

    $scope.timeframe = $scope.timeframes[1];

    $scope.totalQuakes = 0;
});
