<template>
  <div id="my_dataviz"></div>
</template>

<script>
import store from "src/store";
const d3 = require("d3");

export default {
  name: "Dthree",

  data() {
    return {
      arrowOutData: [
        { x: 490, y: 220 },
        { x: 520, y: 220 },
        { x: 530, y: 230 },
        { x: 520, y: 240 },
        { x: 490, y: 240 },
        { x: 490, y: 220 },
      ],
      arrowInData: [
        { x: 470, y: 270 },
        { x: 480, y: 260 },
        { x: 510, y: 260 },
        { x: 510, y: 280 },
        { x: 480, y: 280 },
        { x: 470, y: 270 },
      ],
    };
  },
  mounted() {
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("id", 0)
      .attr("width", 1000)
      .attr("height", 1000);

    function dragstarted() {
      d3.select(this).attr("stroke", "black");
    }

    function dragged(event, d) {
      if (this.tagName == "g") {
        d3.select(this)
          .raise()
          .attr("transform", "translate(" + [event.x, event.y] + ")");
      } else {
        d3.select(this).raise().attr("x", event.x).attr("y", event.y);
      }
    }

    function dragended(event, d) {
      d3.select(this).attr("stroke", null);
      var reDrawn = false;
      var parent = this.parentNode;
      var containerRect = parent.childNodes[0];
      var parentRect = containerRect.getBoundingClientRect();
      var component = this;

      if (this.getAttribute("class") != "main") {
        if (
          event.x > parentRect.x &&
          event.x < parentRect.x + parentRect.width &&
          event.y > parentRect.y &&
          event.y < parentRect.y + parentRect.height &&
          parent.tagName != "svg"
        ) {
          console.log("in his group");
        } else {
          console.log("out of his group");
          parent.removeChild(this);
          var groups = d3.selectAll("g");

          groups.each(function (groups, i) {
            var groupRect = this.getBoundingClientRect();
            console.log(groupRect);
            if (
              event.x > groupRect.x &&
              event.x < groupRect.x + groupRect.width &&
              event.y > groupRect.y &&
              event.y < groupRect.y + groupRect.height
            ) {
              console.log("in a new group");
              var clone = component.cloneNode(true);
              document
                .getElementById(this.getAttribute("id"))
                .appendChild(clone);
              d3.select(clone).call(drag).on("click", click);

              reDrawn = true;
            }
          });
          if (!reDrawn) {
            console.log("on svg");
            var clone = component.cloneNode(true);
            document.getElementById("0").appendChild(clone);
            d3.select(clone).call(drag).on("click", click);
          }
        }
      }
    }

    function click(event, d) {
      if (event.defaultPrevented) return; // dragged
      d3.select(this).transition().attr("fill", "black");
    }

    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    // prepare a helper function
    var lineFunc = d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    var group = svg
      .append("g")
      .attr("class", "main")
      .attr("id", 1)
      .call(drag)
      .on("click", click);

    var box = group
      .append("rect")
      .attr("width", 500)
      .attr("height", 500)
      .attr("x", 0)
      .attr("y", 0)
      .style("stroke", "black")
      .style("fill", "yellow");

    var title = group
      .append("text")
      .attr("x", 10)
      .attr("y", 5)
      .attr("dominant-baseline", "hanging")
      .text("DB Server");

    // Add the path using this helper function
    var arrowOut = group
      .append("path")
      .attr("d", lineFunc(this.arrowOutData))
      .attr("stroke", "black")
      .attr("fill", "blue");

    // Add the path using this helper function
    var arrowIn = group
      .append("path")
      .attr("d", lineFunc(this.arrowInData))
      .attr("stroke", "black")
      .attr("fill", "red");

    var lilgroup = group
      .append("g")
      .attr("id", 2)
      .call(drag)
      .on("click", click);

    var lilbox = lilgroup
      .append("rect")
      .attr("width", 200)
      .attr("height", 200)
      .attr("x", 50)
      .attr("y", 50)
      .attr("id", 12)
      .attr("parentId", 1)
      .style("stroke", "black")
      .style("fill", "orange");

    var liltitle = lilgroup
      .append("text")
      .attr("x", 60)
      .attr("y", 60)
      .attr("dominant-baseline", "hanging")
      .text("Data Base");

    //group.call(drag).on("click", click);
  },
  methods: {},
};
</script>
