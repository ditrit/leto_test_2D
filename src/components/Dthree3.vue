<template>
  <div id="my_dataviz"></div>
</template>

<script>
import { min } from "d3";
import { date, Loading } from "quasar";
import { defineComponent, computed, onMounted } from "vue";
import Parse from "parse";
import axios from "axios";
import * as modelBuilder from "src/assets/drawers/modelBuilder";
const d3 = require("d3");
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useSvgStore } from "src/store/svgStore.js";

export default {
  name: "Dthree",

  computed: {
    // gives access to this.svgVars inside the component

    ...mapState(useSvgStore, ["svgVars"]),
    ...mapState(useSvgStore, ["loading"]),
  },

  data() {
    return {
      colors: {
        concrete: "bleu clair",
        abstract: "vert clair",
        service: "violet clair",
      },

      panel: {
        /*dbServer: {
          name: "DB Server",
          icon: "https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-server-miscellaneous-kiranshastry-lineal-kiranshastry.png",
          color: "yellow",
          kind: "concrete",
          requirements: [
            {
              name: "data source",
              typeof: "connects to",
            },
            {
              name: "data source 2",
              typeof: "connects to",
            },
          ],
          capabilities: [
            {
              name: "Output",
              typeof: "connects to",
            },
          ],
        },
        db: {
          name: "DataBase",
          icon: "https://img.icons8.com/ios/50/000000/database.png",
          color: "orange",
          kind: "abstract",
          requirements: [],
          capabilities: [
            {
              name: "Output",
              typeof: "connects to",
            },
          ],
        },*/
        apache: {
          //name: "Apache",
          width: 120,
          rels_height: 30,
          container_height: 20,
          instance_name: "Ursulle",
          type_name: "R2D2_6PO",
          icon: "https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-server-miscellaneous-kiranshastry-lineal-kiranshastry.png",
          //color: "blue",
          primary_color: "#d3eaf2",
          secondary_color: "#bae0ed",
          kind: "service",
          requirements: [
            {
              name: "data source",
              typeof: "connects to",
            },
            {
              name: "data source 2",
              typeof: "connects to",
            },
            {
              name: "Input",
              typeof: "connects to",
            },
          ],
          capabilities: [
            {
              name: "Output",
              typeof: "connects to",
            },
            {
              name: "Output",
              typeof: "connects to",
            },
            {
              name: "Output",
              typeof: "connects to",
            },
            {
              name: "Output",
              typeof: "connects to",
            },
          ],
        },
      },
      modelArea: {
        levels: [2.75, 2.5, 2.25, 2, 1.75, 1.5, 1.25, 1, 0.75, 0.5],
        data: [],
      },
      obj1: {
        id: "obj1",
        primary_color: "#d3eaf2",
        secondary_color: "#bae0ed",
        width: 100,
        rels_height: 30,
        container_height: 20,
        instance_name: "Ursulle",
        type_name: "R2D2_6PO",
      },
    };
  },
  methods: {
    ...mapActions(useSvgStore, ["loadSVGs"]),

    instanciate(text, data) {
      function matchTxt(m, op, found, s) {
        let valParts = found.split(",");
        let res;
        if (op == "N") {
          res = valParts.reduce((x, y) => {
            const val = data[y] ? data[y] : y;
            return x + Number(val);
          }, 0);
        } else {
          res = valParts.reduce((x, y) => {
            const val = data[y] ? data[y] : y;
            return x + val;
          }, "");
        }
        return res;
      }

      return text.replace(/([TN]){{([^}]*)}}/g, matchTxt);
    },
  },
  beforeCreate() {},
  async mounted() {
    let ctx = this;
    await this.loadSVGs();
    //const res = await axios.get("svg_vars/serveur_vars.svg");

    const res = this.svgVars[0];
    console.log(this.loading);

    if (res.status != 200) {
      return;
    }
    const domParser = new DOMParser();
    const svgData = res.data;

    function drawSvg(svgData, object) {
      if (!ctx.loading) {
        const svgTxt = ctx.instanciate(svgData, object);
        const svgDom = domParser.parseFromString(svgTxt, "image/svg+xml");
        var newSvg = d3.select("#svg0").node().append(svgDom.documentElement);
        document
          .getElementById("svg0")
          .appendChild(document.getElementById(object.id));

        document
          .getElementById("svg0")
          .removeChild(document.getElementById("1"));
        return document.getElementById(object.id);
      } else {
        console.log("wait for loading");
      }
    }

    var zoom = 1;

    //Create SVG element on the center page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("id", "root")
      .attr("width", 2000)
      .attr("height", 2000)
      .call(
        d3
          .zoom()
          .scaleExtent([0.25, 2])
          .on("zoom", function (event) {
            console.log(event.transform);
            zoom = event.transform.k;
            svg.attr("transform", event.transform);
          })
      )
      .append("g")
      .attr("id", "svg0");

    // Define drag and drop functions ----------------------------------------
    function dragstarted(event, d) {
      let currentID = parseInt(this.getAttribute("id"));
      var currentModel = this;
      var currentLevel;
      var parent = this.parentNode;
      for (let el0 of ctx.modelArea.data) {
        if (el0.id === currentID) {
          currentLevel = 0;
          ctx.modelArea.data.splice(ctx.modelArea.data.indexOf(el0), 1);
          break;
        }
        for (let el1 of el0.content) {
          if (el1.id === currentID) {
            currentLevel = 1;
            el0.content.splice(el0.content.indexOf(el1), 1);
            break;
          }
          for (let el2 of el1.content) {
            if (el2.id === currentID) {
              currentLevel = 2;
              el1.content.splice(el1.content.indexOf(el2), 1);
              break;
            }
            for (let el3 of el2.content) {
              if (el3.id === currentID) {
                currentLevel = 3;
                el2.content.splice(el2.content.indexOf(el3), 1);
                break;
              }
            }
          }
        }
      }
      if (currentModel.parentNode.getAttribute("id") != "svg0") {
        function resizeContainer(child, level, removedComponent) {
          var removedComponentH = parseFloat(
            removedComponent.getBoundingClientRect().height
          );
          if (child.parentNode.getAttribute("id") != "svg0") {
            var currentBottomRectH = child.parentNode
              .getElementsByClassName("bottomRect")[0]
              .getBoundingClientRect().height;
            var newBottomRectH =
              parseFloat(currentBottomRectH) -
              parseFloat(
                child.parentNode
                  .getElementsByClassName("middleRect")[0]
                  .getBoundingClientRect().height
              ) -
              removedComponentH;
            d3.select(child.parentNode)
              .select("#container")
              .select(".bottomRect")
              .attr("height", newBottomRectH / zoom);
            var newMainRectH =
              parseFloat(
                child.parentNode
                  .getElementsByClassName("mainRect")[0]
                  .getBoundingClientRect().height
              ) -
              parseFloat(
                child.parentNode
                  .getElementsByClassName("middleRect")[0]
                  .getBoundingClientRect().height
              ) -
              removedComponentH;
            d3.select(child.parentNode)
              .select(".mainRect")
              .attr("height", newMainRectH / zoom);
            resizeContainer(child.parentNode, level - 1, removedComponent);
          }
        }
        resizeContainer(this, currentLevel, this);
        parent.removeChild(currentModel);
        document.getElementById("svg0").appendChild(currentModel);
        d3.select(currentModel).call(drag).on("click", click);

        function replaceComponents(group, level) {
          var scale =
            ctx.modelArea.levels[level] / ctx.modelArea.levels[level - 1];
          var height =
            (group.getElementsByClassName("topRect")[0].getBoundingClientRect()
              .height +
              group
                .getElementsByClassName("middleRect")[0]
                .getBoundingClientRect().height +
              group
                .getElementsByClassName("topTrapeze")[0]
                .getBoundingClientRect().height) /
            zoom;
          for (const prop in group.childNodes) {
            if (group.childNodes[prop].tagName == "g") {
              if (
                group.childNodes[prop].getAttribute("class") == "model" &&
                group.childNodes[prop].getAttribute("id") != "svg0"
              ) {
                d3.select(group.childNodes[prop])
                  .attr(
                    "transform",
                    "scale(" +
                      ctx.modelArea.levels[level] /
                        ctx.modelArea.levels[level - 1] +
                      ")translate(" +
                      [
                        ((ctx.modelArea.levels[level - 1] -
                          ctx.modelArea.levels[level]) *
                          d3.select(group).select(".mainRect").attr("width")) /
                          2 -
                          8 * scale,
                        height +
                          (group.childNodes[prop]
                            .getElementsByClassName("topTrapeze")[0]
                            .getBoundingClientRect().height *
                            2 +
                            4 / scale) /
                            zoom,
                      ] +
                      ")"
                  )
                  .call(drag)
                  .on("click", click);

                height +=
                  (group.childNodes[prop]
                    .getElementsByClassName("topTrapeze")[0]
                    .getBoundingClientRect().height *
                    2 +
                    group.childNodes[prop]
                      .getElementsByClassName("mainRect")[0]
                      .getBoundingClientRect().height) /
                  zoom;
              }
            }
          }
          if (group.parentNode.getAttribute("id") != "svg0") {
            replaceComponents(group.parentNode, level - 1);
          }
        }

        replaceComponents(parent, currentLevel);
      }
      console.log(ctx.modelArea.data);
    }
    function dragged(event, d) {
      var currentGroup = this;
      var coord = d3.pointer(event);
      var headerRect = document
        .getElementById("header")
        .getBoundingClientRect();
      if (
        this.className.baseVal == "model" &&
        this.getAttribute("id") != "svg0"
      ) {
        d3.select(this)
          .raise()
          .attr(
            "transform",
            "translate(" +
              [
                event.x -
                  this.getElementsByClassName("mainRect")[0].getAttribute("x") *
                    ctx.modelArea.levels[0],
                event.y -
                  this.getElementsByClassName("mainRect")[0].getAttribute("y") *
                    ctx.modelArea.levels[0],
              ] +
              ")"
          );
      }
      var groups = d3.selectAll(".model");
      groups.each(function (groups, i) {
        if (this.getAttribute("id") != "svg0") {
          var groupRect =
            this.getElementsByClassName("mainRect")[0].getBoundingClientRect();
          if (
            coord[0] > groupRect.x &&
            coord[0] < groupRect.x + groupRect.width &&
            coord[1] > groupRect.y &&
            coord[1] < groupRect.y + groupRect.height &&
            currentGroup != this
          ) {
            console.log("dragover" + this.getAttribute("id"));
          } else {
          }
        }
      });
    }
    function dragended(event, d) {
      var currentGroup = this;
      var panelObject;
      console.log(d3.select(this).selectAll("text")._groups[0][1].textContent);
      for (const prop in ctx.panel) {
        if (
          ctx.panel[prop].type_name ==
          d3.select(this).selectAll("text")._groups[0][1].textContent
        ) {
          panelObject = ctx.panel[prop];
        }
      }
      var currentObj = {
        typeName: d3.select(this).selectAll("text")._groups[0][1].textContent,
        name: d3.select(this).select("text")._groups[0][0].textContent,
        class: this.getAttribute("class"),
        id: parseInt(this.getAttribute("id")),
        //icon: d3.select(this).select(".icon").attr("xlink:href"),
        //color: this.childNodes[0].getAttribute("fill"),
        level: 0,
        containerHeight: 0,
        content: [],
        requirements: panelObject.requirements,
        capabilities: panelObject.capabilities,
      };
      for (let element = 0; element < this.childNodes; element++) {
        if (
          currentGroup.childNodes[element].className.baseVal == "model" &&
          currentGroup.childNodes[element].getAttribute("id") != "svg0"
        ) {
          currentObj.content.push(element);
        }
      }
      var coord = d3.pointer(event);
      var reDrawn = false;
      var component = this;
      var minWidth = 350;
      var minGroup;
      var groups = d3.selectAll(".model");
      console.log(groups._groups[0]);
      groups.each(function (groups, i) {
        //For each group on the window but the main container
        if (this.getAttribute("id") != "svg0") {
          var groupRect =
            this.getElementsByClassName("mainRect")[0].getBoundingClientRect(); //Get the rect of the group
          if (
            //Test if the cursor is inside the group
            coord[0] > groupRect.x &&
            coord[0] < groupRect.x + groupRect.width &&
            coord[1] > groupRect.y &&
            coord[1] < groupRect.y + groupRect.height &&
            this != currentGroup
          ) {
            if (groupRect.width < minWidth) {
              console.log(this.getAttribute("id") + " " + groupRect.width);
              minGroup = this;
            }
          }
        }
      });
      if (minGroup != null && minGroup != this) {
        console.log("in a new group" + minGroup.getAttribute("id"));

        var minGroupRect = minGroup.getBoundingClientRect();
        for (let el0 of ctx.modelArea.data) {
          console.log(el0.id);
          if (el0.id == parseInt(minGroup.getAttribute("id"))) {
            currentObj.level = 1;
            el0.content.push(currentObj);
            break;
          }
          for (let el1 of el0.content) {
            if (el1.id === parseInt(minGroup.getAttribute("id"))) {
              currentObj.level = 2;
              el1.content.push(currentObj);
              break;
            }
            for (let el2 of el1.content) {
              if (el2.id === parseInt(minGroup.getAttribute("id"))) {
                currentObj.level = 3;
                el2.content.push(currentObj);
                break;
              }
              for (let el3 of el2.content) {
                if (el3.id === parseInt(minGroup.getAttribute("id"))) {
                  currentObj.level = 4;
                  el3.content.push(currentObj);
                  break;
                }
              }
            }
          }
        }
        //Clone and paste the component in his new group
        var cloneComponent = component.cloneNode(true);

        //var clone = modelBuilder.buildModel(currentObj, currentGroup, ctx);
        //var cloneComponent = clone._groups[0][0];
        component.parentNode.removeChild(component);
        document
          .getElementById(minGroup.getAttribute("id"))
          .appendChild(cloneComponent);

        function resizeContainer(child, level, addedComponent) {
          var addedComponentH = parseFloat(
            addedComponent.getBoundingClientRect().height
          );
          if (
            child.parentNode.className.baseVal == "model" &&
            child.parentNode.getAttribute("id") != "svg0"
          ) {
            var currentBottomRectH = child.parentNode
              .getElementsByClassName("bottomRect")[0]
              .getBoundingClientRect().height;
            var newBottomRectH =
              parseFloat(currentBottomRectH) +
              parseFloat(
                child.parentNode
                  .getElementsByClassName("middleRect")[0]
                  .getBoundingClientRect().height
              ) +
              addedComponentH;
            d3.select(child.parentNode)
              .select("#container")
              .select(".bottomRect")
              .attr("height", newBottomRectH / zoom);
            var newMainRectH =
              parseFloat(
                child.parentNode
                  .getElementsByClassName("mainRect")[0]
                  .getBoundingClientRect().height
              ) +
              parseFloat(
                child.parentNode
                  .getElementsByClassName("middleRect")[0]
                  .getBoundingClientRect().height
              ) +
              addedComponentH;
            d3.select(child.parentNode)
              .select(".mainRect")
              .attr("height", newMainRectH / zoom);
            resizeContainer(child.parentNode, level - 1, addedComponent);
          }
        }
        resizeContainer(cloneComponent, currentObj.level, cloneComponent);

        function replaceComponents(group, level) {
          var scale =
            ctx.modelArea.levels[level] / ctx.modelArea.levels[level - 1];
          var calcul =
            group.childNodes[3].getBoundingClientRect().height /
            d3.select(group).select("#infos").select(".topRect").attr("height");
          console.log(
            group
              .getElementsByClassName("topTrapeze")[0]
              .getBoundingClientRect().height
          );
          var i = 0;
          var height =
            (group.getElementsByClassName("topRect")[0].getBoundingClientRect()
              .height +
              group
                .getElementsByClassName("middleRect")[0]
                .getBoundingClientRect().height +
              group
                .getElementsByClassName("topTrapeze")[0]
                .getBoundingClientRect().height) /
            zoom;

          for (const prop in group.childNodes) {
            if (group.childNodes[prop].tagName == "g") {
              if (
                group.childNodes[prop].className.baseVal == "model" &&
                group.childNodes[prop].getAttribute("id") != "svg0"
              ) {
                i++;
                /*var currentScale =
                  group.childNodes[prop].childNodes[3].getBoundingClientRect()
                    .height /
                  d3
                    .select(group.childNodes[prop])
                    .select("#infos")
                    .select(".topRect")
                    .attr("height");*/

                d3.select(group.childNodes[prop])
                  .attr(
                    "transform",
                    "scale(" +
                      ctx.modelArea.levels[level] /
                        ctx.modelArea.levels[level - 1] +
                      ")translate(" +
                      [
                        ((ctx.modelArea.levels[level - 1] -
                          ctx.modelArea.levels[level]) *
                          d3.select(group).select(".mainRect").attr("width")) /
                          2 -
                          8 * scale,
                        height +
                          (group.childNodes[prop]
                            .getElementsByClassName("topTrapeze")[0]
                            .getBoundingClientRect().height *
                            2 +
                            4 / scale) /
                            zoom,
                      ] +
                      ")"
                  )
                  .call(drag)
                  .on("click", click);

                height +=
                  (group.childNodes[prop]
                    .getElementsByClassName("topTrapeze")[0]
                    .getBoundingClientRect().height *
                    2 +
                    group.childNodes[prop]
                      .getElementsByClassName("mainRect")[0]
                      .getBoundingClientRect().height) /
                  zoom;
              }
            }
          }
          if (
            group.parentNode.className.baseVal == "model" &&
            group.parentNode.getAttribute("id") != "svg0"
          ) {
            replaceComponents(group.parentNode, level - 1);
          }
        }

        replaceComponents(minGroup, currentObj.level);

        reDrawn = true;
      }
      if (!reDrawn) {
        console.log("on svg");
        ctx.modelArea.data.push(currentObj);
      }
      console.log(ctx.modelArea.data);
    }
    //End of drag and drop functions -------------------------------------------
    //Click event
    function click(event, d) {
      if (event.defaultPrevented) return; // dragged
      console.log("click");
      var root = document.getElementById("svg0").getBoundingClientRect();
      var headerRect = document
        .getElementById("header")
        .getBoundingClientRect();
      var btnRect = document.getElementById("hideD33").getBoundingClientRect();
      var x0 = this.getBoundingClientRect().x;
      var x1 = x0 + this.getBoundingClientRect().width;
      var y0 = this.getBoundingClientRect().y;
      var y1 = y0 + this.getBoundingClientRect().height;

      d3.select("#svg0").attr(
        "transform",
        "translate(" + [-x0, -y0 + headerRect.height + btnRect.height] + ")"
      );
      zoom = 1;
    }

    function click_model(event, d) {
      console.log("clicked");
      d3.select(this).transition().attr("fill", "black");
      var panelObject;
      for (const prop in ctx.panel) {
        if (
          ctx.panel[prop].type_name ==
          d3.select(this).select("text")._groups[0][0].textContent
        ) {
          panelObject = ctx.panel[prop];
        }
      }

      var currentObj = {
        type_name: panelObject.type_name,
        instance_name: panelObject.instance_name,
        class: this.getAttribute("class"),
        id: Date.now(),
        width: panelObject.width,
        rels_height: panelObject.rels_height,
        container_height: panelObject.container_height,

        icon: panelObject.icon,
        primary_color: panelObject.primary_color,
        secondary_color: panelObject.secondary_color,
        level: 0,
        containerHeight: 0,
        content: [],
        requirements: panelObject.requirements,
        capabilities: panelObject.capabilities,
      };

      var drawnModel = drawSvg(svgData, currentObj);

      d3.select(drawnModel)

        .call(drag)
        .on("click", click);

      /*
      var gr = modelBuilder.buildModel(
        currentObj,
        document.getElementById("svg0"),
        ctx
      );
      // Add the drag behavior
      d3.select(gr._groups[0][0]).call(drag).on("click", click);
      console.log(gr._groups[0][0].getBoundingClientRect());*/
      ctx.modelArea.data.push(currentObj);
      console.log(ctx.modelArea.data);
    }
    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
    // Draw some svg items in the drawer -------------------------------------------------------
    Object.values(this.panel).forEach((element) => {
      var drawerItem = d3
        .select("#drawerContent")
        .append("svg")
        .attr("id", "svg1")
        .attr("width", 150)
        .attr("height", 150);
      var group = drawerItem
        .append("g")
        .attr("class", "container0")
        .on("click", click_model);
      var box = group
        .append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .style("stroke", "black")
        .attr("fill", element.primary_color);
      var title = group
        .append("text")
        .attr("x", 20)
        .attr("y", 5)
        .attr("dominant-baseline", "hanging")
        .text(element.type_name);
      group
        .append("svg:image")
        .attr("class", "icon")
        .attr("x", 10)
        .attr("y", 40)
        .attr("width", 50)
        .attr("height", 50)
        .attr("xlink:href", element.icon);
    });

    //----------------------------------------------------------------------------
  },
};
</script>
