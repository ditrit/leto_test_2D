<template>
  <q-page class="flex row flex-center column justify-start">
    <div id="svgTest" style="width: 800px" class="column full-height"></div>
    <div id="svgTest2" style="width: 800px" class="column full-height"></div>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted } from "vue";
import Parse from "parse";
import axios from "axios";
const d3 = require("d3");

export default defineComponent({
  name: "SVG",

  setup() {
    const username = computed(() => Parse.User.current());

    let data = {
      id: "obj1",
      primary_color: "#d3eaf2",
      secondary_color: "#bae0ed",
      width: 100,
      rels_height: 30,
      container_height: 20,
      instance_name: "Ursulle",
      type_name: "R2D2_6PO",
    };

    let data2 = {
      id: "obj2",
      primary_color: "#95ff00",
      secondary_color: "#82cc18",
      width: 200,
      rels_height: 30,
      container_height: 80,
      instance_name: "Corne Muze",
      type_name: "Bignou",
    };

    function instanciate(text, data) {
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
    }

    onMounted(async () => {
      const res = await axios.get("serveur_vars.svg");
      if (res.status == 200) {
        const domParser = new DOMParser();
        const svgVars = res.data;

        const svgTxt = instanciate(svgVars, data);
        const svgDom = domParser.parseFromString(svgTxt, "image/svg+xml");

        const svgTxt2 = instanciate(svgVars, data2);
        const svgDom2 = domParser.parseFromString(svgTxt2, "image/svg+xml");

        /*d3.select("#svgTest").node().append(svgDom.documentElement);
        console.log(svgDom.documentElement);
        d3.select("#obj1").attr(
          "transform",
          "scale(" + 0.5 + ")translate(" + [200, 50] + ")"
        );*/

        d3.select("#svgTest2").node().append(svgDom2.documentElement);
        console.log(document.getElementById("obj2"));
        var svg = d3.select("#svgTest2").append("svg").attr("id", "svg0");
        document
          .getElementById("svg0")
          .appendChild(document.getElementById("obj2"));
      }
      console.log(document.getElementById("svg0"));
      console.log(document.getElementById("svgTest2"));
      console.log(document.getElementById("1"));
      document
        .getElementById("svgTest2")
        .removeChild(document.getElementById("1"));
    });

    return {
      username,
    };
  },
});
</script>
<style></style>
