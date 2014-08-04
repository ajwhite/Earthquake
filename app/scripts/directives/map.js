angular.module('earthquakeApp').directive('earthquakeMap', function ($window) {
  return {
    restrict: 'E',
    link: function (scope, element) {
      var width = angular.element($window).width(),
          height = 500,
          projection,
          svg,
          path,
          g,
          zoom;

      projection = d3.geo.mercator()
        .center([0, 5])
        .scale(200)
        .rotate([-180, 0]);

      svg = d3.select('body').append('svg')
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
    }
  }
});
