<template>
  <div id="my_dataviz" style="height: 100ch; width: 150ch"></div>
</template>

<script>
//const Cytoscape = require("cytoscape");
const d3 = require("d3");

export default {
  name: "Dthree",
  event,

  data() {
    return {
      nodes: [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
        { id: 3, name: "C" },
        { id: 4, name: "D" },
        { id: 5, name: "E" },
      ],
      links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 1, target: 4 },
        { source: 1, target: 5 },
        { source: 2, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
        { source: 3, target: 4 },
        { source: 3, target: 5 },
        { source: 4, target: 5 },
      ],
    };
  },
  mounted() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 400 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the nodes
    var node = svg
      .selectAll("rect")
      .data(this.nodes)
      .enter()
      .append("rect")
      .attr("width", 40)
      .attr("height", 40)
      //.attr("r", 20)
      .style("fill", "#69b3a2");

    // Initialize the links
    var link = svg
      .selectAll("line")
      .data(this.links)
      .enter()
      .append("line")
      .style("stroke", "black")
      .style("stroke-width", 3);

    // Let's list the force we wanna apply on the network
    var simulation = d3
      .forceSimulation(this.nodes) // Force algorithm is applied to data.nodes
      .force(
        "link",
        d3
          .forceLink() // This force provides links between nodes
          .id(function (d) {
            return d.id;
          }) // This provide  the id of a node
          .links(this.links) // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-5000)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .on("tick", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
      link
        .attr("x1", function (d) {
          return d.source.x + 20;
        })
        .attr("y1", function (d) {
          return d.source.y + 20;
        })
        .attr("x2", function (d) {
          return d.target.x + 20;
        })
        .attr("y2", function (d) {
          return d.target.y + 20;
        });

      node
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        });
    }

    function dragstarted() {
      d3.select(this).attr("stroke", "black");
    }

    function dragged(event, d) {
      d3.select(this)
        .raise()
        .attr("x", (d.x = event.x))
        .attr("y", (d.y = event.y));
    }

    function dragended() {
      d3.select(this).attr("stroke", null);
    }

    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    node.call(drag).on("click", click);

    function click(event, d) {
      if (event.defaultPrevented) return; // dragged
      d3.select(this)
        .transition()
        .attr("fill", "black")
        .attr("r", 40)
        .transition()
        .attr("r", 20)
        .attr("fill", d3.schemeCategory10[d.index % 10]);
    }
  },
  methods: {},
};
</script>
