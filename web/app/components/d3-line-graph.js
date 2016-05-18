import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({
  lineData: Ember.computed('data', function() {
    return d3.nest()
      .key(function(d) { return d.label; })
      .entries(this.get('data'));
  }),

  voronoiData: Ember.computed('lineData', function() {
    var lineData = this.get('lineData'),
        x = this.get('x'),
        y = this.get('y');

    return d3.nest()
      .key(function(d) { return x(d.time) + "," + y(d.value); })
      .rollup(function(v) { return v[0]; })
      .entries(d3.merge(lineData.map(function(d) { return d.values; })))
      .map(function(d) { return d.values; });
  }),

  margin: { top: 20, right: 20, bottom: 30, left: 50 },
  width: Ember.computed(function() {
    return 1000 - this.get('margin.left') - this.get('margin.right');
  }),
  height: Ember.computed(function() {
    return 400 - this.get('margin.top') - this.get('margin.bottom');
  }),

  x: Ember.computed(function() {
    return d3.time.scale()
      .range([0, this.get('width')]);
  }),
  y: Ember.computed(function() {
    return d3.scale.linear()
      .range([this.get('height'), 0]);
  }),

  color: d3.scale.category20(),

  xAxis: Ember.computed(function() {
    return d3.svg.axis().scale(this.get('x')).orient("bottom");
  }),
  yAxis: Ember.computed(function() {
    return d3.svg.axis().scale(this.get('y')).orient("left");
  }),

  line: Ember.computed(function() {
    var x = this.get('x'),
        y = this.get('y');

    return d3.svg.line()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.value); });
  }),

  voronoi: Ember.computed(function() {
    var x = this.get('x'),
        y = this.get('y'),
        margin = this.get('margin'),
        width = this.get('width'),
        height = this.get('height');

    return d3.geom.voronoi()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.value); })
      .clipExtent([[-margin.left, -margin.top],
                   [width + margin.right, height + margin.bottom]]);
  }),

  didInsertElement() {
    this._super(...arguments);

    var data = this.get('data');
    var lineData = this.get('lineData');
    var voronoiData = this.get('voronoiData');

    var width = this.get('width'),
        margin = this.get('margin'),
        height = this.get('height');

    var x = this.get('x'),
        y = this.get('y');

    var voronoi = this.get('voronoi');
    var line = this.get('line');

    var color = this.get('color');

    var svg = d3.select("#chart-" + this.get('id')).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) { return d.time; } ));
    y.domain(d3.extent(data, function(d) { return d.value; }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(this.get('xAxis'));

    svg.append("g")
      .attr("class", "y axis")
      .call(this.get('yAxis'));

    /**
     * Sensor lines
     */
    var sensor = svg.selectAll(".sensor")
          .data(lineData)
          .enter()
          .append("g")
          .attr("class", "sensor")
          .attr("id", function(d) { return d.key; } );

    sensor.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.key); } )
      .attr("fill", "none");

    /**
     * On mouseover Voronoi diagram
     */
    var focus = svg.append("g")
          .attr("transform", "translate(-100,-100)")
          .attr("class", "focus");

    focus.append("circle")
      .attr("r", 3.5);

    focus.append("text")
      .attr("y", -10);

    var voronoiGroup = svg.append("g")
          .attr("class", "voronoi");

    voronoiGroup.selectAll('path')
      .data(voronoi(voronoiData)).enter()
      .append('path')
      .attr('d', function(d) { return "M" + d.join("L") + "Z"; })
      .datum(function(d) { return d.point; })
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('click', click);

    function mouseover(d) {
      focus.attr("transform",
                 "translate(" + x(d.time) + "," + y(d.value) + ")");
      focus.select("text").text(d.label);
    }

    function mouseout(d) {
      focus.attr("transform", "translate(-100,-100)");
    }

    function click(d) {
      console.log(new Date(d.time));
    }

    /**
     * Current time line
     */
    var currTime = svg.append('g')
          .attr('class', 'currTime');

    currTime.append('svg:line')
      .attr('class', 'line')
      .attr('y1', 0)
      .attr('y2', height)
      .style('stroke', 'red')
      .style('stroke-width', 2);
  },

  willUpdate() {
    this._super(...arguments);

    var currTime = this.get('currTime');

    var x = this.get('x');

    var svg = d3.select("#chart-" + this.get('id')).transition();

    svg.select('.currTime line')
      // .duration(750)
      .attr('x1', x(currTime))
      .attr('x2', x(currTime));
  }
});
