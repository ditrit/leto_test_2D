<template>
  <!-- <q-drawer
    v-model="drawerLeft"
    show-if-above
    :width="200"
    :breakpoint="700"
    style="background-color: white"
  >
    <q-item-label header> Models </q-item-label>
    <q-scroll-area class="fit">
      <div id="drawerContent"></div>
    </q-scroll-area> </q-drawer
  >-->
  <div id="my_dataviz"></div>
</template>

<script>
const d3 = require("d3");

export default {
  name: "Dthree",

  data() {
    return {
      arrowOutData: [
        { x: 275, y: 220 },
        { x: 320, y: 220 },
        { x: 330, y: 230 },
        { x: 320, y: 240 },
        { x: 275, y: 240 },
        { x: 275, y: 220 },
      ],
      arrowInData: [
        { x: 275, y: 270 },
        { x: 285, y: 260 },
        { x: 330, y: 260 },
        { x: 330, y: 280 },
        { x: 285, y: 280 },
        { x: 275, y: 270 },
      ],
      lilarrowOutData: [
        { x: 175, y: 120 },
        { x: 220, y: 120 },
        { x: 230, y: 130 },
        { x: 220, y: 140 },
        { x: 175, y: 140 },
        { x: 175, y: 120 },
      ],
      lilarrowInData: [
        { x: 175, y: 170 },
        { x: 185, y: 160 },
        { x: 230, y: 160 },
        { x: 230, y: 180 },
        { x: 185, y: 180 },
        { x: 175, y: 170 },
      ],
    };
  },
  mounted() {
    //Create SVG element on the center page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("id", "svg0")
      .attr("width", 1000)
      .attr("height", 1000);

    //Create SVG element in the drawer
    var modelsWorkshop = d3
      .select("#drawerContent")
      .append("svg")
      .attr("id", "svg1")
      .attr("width", 200)
      .attr("height", 500);

    // Define drag and drop functions ----------------------------------------
    function dragstarted() {
      d3.select(this).attr("stroke", "black");
    }

    function dragged(event, d) {
      if (this.tagName == "g") {
        d3.select(this)
          .raise()
          .attr("transform", "translate(" + [event.x, event.y] + ")");
        event.sourceEvent.stopPropagation();
      } else {
        d3.select(this).raise().attr("x", event.x).attr("y", event.y);
        event.sourceEvent.stopPropagation();
      }

      var groups = d3.selectAll("g");

      groups.each(function (groups, i) {
        var groupRect = this.childNodes[0].getBoundingClientRect();
        //console.log(groupRect);
        if (
          event.x > groupRect.x - 30 &&
          event.x < groupRect.x + groupRect.width - 30 &&
          event.y > groupRect.y + 10 &&
          event.y < groupRect.y + groupRect.height + 10
        ) {
          console.log("dragover" + this.getAttribute("id"));
          //d3.select(this.childNodes[0]).style("stroke-width", 5);
        } else {
          /*var groupArray = d3.selectAll("g");
          groupArray.forEach((element) => {
            this.childNodes[0].style("stroke-width", 2);
          });
          */
        }
      });
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
          event.x > parentRect.x - 30 &&
          event.x < parentRect.x + parentRect.width - 30 &&
          event.y > parentRect.y + 10 &&
          event.y < parentRect.y + parentRect.height + 10 &&
          parent.tagName != "svg"
        ) {
          console.log("in his group");
        } else {
          console.log("out of his group");
          console.log(parent.getAttribute("id"));

          parent.removeChild(this);

          var groups = d3.selectAll("g");

          groups.each(function (groups, i) {
            var groupRect = this.childNodes[0].getBoundingClientRect();
            //console.log(groupRect);
            if (
              event.x > groupRect.x - 30 &&
              event.x < groupRect.x + groupRect.width - 30 &&
              event.y > groupRect.y + 10 &&
              event.y < groupRect.y + groupRect.height + 10
            ) {
              console.log("in a new group");
              console.log(this.getAttribute("id"));

              var clone = component.cloneNode(true);
              d3.select(clone).attr("x", groupRect.x).attr("y", groupRect.y);

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
            document.getElementById("svg0").appendChild(clone);
            d3.select(clone).call(drag).on("click", click);
          }
        }
      }
    }
    //End of drag and drop functions -------------------------------------------

    //Click event
    function click(event, d) {
      if (event.defaultPrevented) return; // dragged
      d3.select(this).transition().attr("fill", "black");
    }

    function click_model(event, d) {
      console.log("clicked");
      d3.select(this).transition().attr("fill", "black");
      var clone = this.cloneNode(true);
      document.getElementById("svg0").appendChild(clone);
      d3.select(clone.childNodes[0])
        .attr("width", clone.childNodes[0].getAttribute("width") * 2)
        .attr("height", clone.childNodes[0].getAttribute("height") * 2);
      d3.select(clone).attr("id", Date.now()).call(drag).on("click", click);
    }

    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    //Create some svg items

    // Helper func to draw the arrows
    var lineFunc = d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    // Draw some svg items -------------------------------------------------------

    var group = modelsWorkshop
      .append("g")
      .attr("class", "main")
      .attr("id", "model1")
      .attr("transform", "translate(0, 0)")
      .on("click", click_model);

    var box = group
      .append("rect")
      .attr("width", 150)
      .attr("height", 250)
      .attr("x", 10)
      .attr("y", 150)
      .style("stroke", "black")
      .style("fill", "yellow");

    var title = group
      .append("text")
      .attr("x", 50)
      .attr("y", 155)
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
    group
      .append("svg:image")
      .attr("x", 30)
      .attr("y", 180)
      .attr("width", 50)
      .attr("height", 50)
      .attr(
        "xlink:href",
        "https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-server-miscellaneous-kiranshastry-lineal-kiranshastry.png"
      );

    /*var handle = group
      .append("rect")
      .data([
        {
          // Position of the rectangle
          x: 0,
          y: 0,
        },
      ])
      .attr("class", "draghandle")
      .attr("x", 5)
      .attr("y", 145)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", "blue")
      .style("opacity", 1)
      .attr("cursor", "move")
      .call(
        d3.drag().on("drag", function (d) {
          console.log("yep");
          d.x += d3.event.dx;
          d.y += d3.event.dy;

          // Move handle rect
          d3.select(this)
            .attr("x", function (d) {
              return d.x;
            })
            .attr("y", function (d) {
              return d.y;
            });

          // Move Group
          d3.select("#group1").attr(
            "transform",
            "translate(" + [d.x, d.y] + ")"
          );
        })
      );*/

    var grp2 = modelsWorkshop
      .append("g")
      .attr("id", "model2")
      .on("click", click_model);

    grp2
      .append("rect")
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", 10)
      .attr("y", 10)
      .style("stroke", "black")
      .style("fill", "orange");

    grp2
      .append("text")
      .attr("x", 30)
      .attr("y", 20)
      .attr("dominant-baseline", "hanging")
      .text("Data Base");

    // Add the path using this helper function
    var arrowOut = grp2
      .append("path")
      .attr("d", lineFunc(this.lilarrowOutData))
      .attr("stroke", "black")
      .attr("fill", "blue");

    // Add the path using this helper function
    var arrowIn = grp2
      .append("path")
      .attr("d", lineFunc(this.lilarrowInData))
      .attr("stroke", "black")
      .attr("fill", "red");

    grp2
      .append("svg:image")
      .attr("x", 30)
      .attr("y", 50)
      .attr("width", 40)
      .attr("height", 40)
      .attr("xlink:href", "https://img.icons8.com/ios/50/000000/database.png");

    /*var lilhandle = grp2
      .append("rect")
      .data([
        {
          // Position of the rectangle
          x: 0,
          y: 0,
        },
      ])
      .attr("class", "draghandle")
      .attr("x", 5)
      .attr("y", 5)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", "blue")
      .style("opacity", 1)
      .attr("cursor", "move")
      .call(
        d3.drag().on("drag", function (d) {
          console.log("yep");
          d.x += d3.event.dx;
          d.y += d3.event.dy;

          // Move handle rect
          d3.select(this)
            .attr("x", function (d) {
              return d.x;
            })
            .attr("y", function (d) {
              return d.y;
            });

          // Move Group
          d3.select("#model1").attr(
            "transform",
            "translate(" + [d.x, d.y] + ")"
          );
        })
      );*/

    //----------------------------------------------------------------------------
  },
  methods: {},
};
</script>
