angular.module('earthquakeApp').directive('earthquakeMap', function ($window) {
  return {
    restrict: 'E',
    scope: {
      timeframe: '=',
      total: '='
    },
    link: function (scope, element) {
      var firebase = new Firebase('https://publicdata-earthquakes.firebaseio.com/by_continent/'),
          width = angular.element($window).width(),
          height = 500,
          now = (new Date()).getTime(),
          projection, svg, path, g, zoom,
          quakes;

      projection = d3.geo.mercator()
        .center([0, 5])
        .scale(200)
        .rotate([-180, 0]);

      svg = d3.select(element[0]).append('svg')
        .attr('width', width)
        .attr('height', height);

      path = d3.geo.path()
        .projection(projection);

      g = svg.append('g');

      d3.json('/world.json', function (error, topology) {
        g.selectAll('path')
          .data(topojson.object(topology, topology.objects.countries).geometries)
          .enter()
          .append('path')
          .attr('d', path);
      });

      zoom = d3.behavior.zoom()
        .on('zoom', function () {
          g.attr('transform', 'translate(' +
            d3.event.translate.join(',') +
            ')scale(' +
            d3.event.scale +')');
          g.selectAll('circle')
            .attr('d', path.projection(projection));
          g.selectAll('path')
            .attr('d', path.projection(projection));
        });
      svg.call(zoom);


      var quakeAdd = function (quake) {
        quake = quake.val();
        if ( (now - (scope.timeframe.value) - quake.time) < 0){
          scope.total++;
          quakes.push(quake);
          g.selectAll('circle')
            .data(quakes)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
              return projection([d.location.lng, d.location.lat])[0];
            })
            .attr('cy', function (d) {
              return projection([d.location.lng, d.location.lat])[1];
            })
            .attr('r', function (d) { return d.mag })
            .attr('fill', 'red');
            scope.$apply(); // dangerous, should handle this differently
        }
      };

      var continents = ['europe','asia', 'africa', 'north_america', 'south_america', 'antartica', 'oceanic'],
          i, j;
      scope.$watch('timeframe', function () {
        scope.total = 0;
        g.selectAll('circle').remove();
        quakes = [];
        for (i = 0; i < continents.length; i++) {
          var continent = continents[i];
          for (mag = 0; mag < 10; mag++) {
            firebase.child(continent)
              .child(mag.toString())
              .endAt()
              .limit(1000)
              .on('child_added', quakeAdd);
          }
        }
      });

    }
  }
});
