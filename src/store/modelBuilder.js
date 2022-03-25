const d3 = require("d3");

export function buildModel(object, svg, ctx) {
  // Compute the Height of each rectangle -----------------------------------------------------------------------------------------

  // Starts at the h pos of the main rect
  var mainRectY = 81.5; //Fixed Y pos of the component

  var topRectY = mainRectY + 1; // Add a space of 1 between the main rect and the top rect
  var topRectH = 30; //Top rect H never changes

  var middleRectY = topRectH + topRectY + 1; // Add a space between end of top rect and head of middle rect
  var middleRectH =
    10 * Math.max(object.requirements.length, object.capabilities.length); //middle Rect H depends on the nb of capa and require

  var bottomRectY = middleRectY + middleRectH + 1; // Add a space between end of middle rect and head of bottom rect
  var bottomRectH;
  if (object.containerHeight < 14.2) {
    bottomRectH = 14.2;
  } else {
    bottomRectH = 14.2 + object.containerHeight;
  }

  var mainRectH = topRectH + middleRectH + bottomRectH + 4; // Main rect h is the addtion of all rect h and the spaces

  // -----------------------------------------------------------------------------------------------------------------------------

  // Drawing the SVG

  var g = d3
    .select(svg)
    .append("g")
    .attr("class", object.class)
    .attr("id", object.id);

  g.append("rect") //Main rectangle
    .attr("class", "mainRect")
    .attr("x", 43.1)
    .attr("y", 81.5)
    .attr("width", 121)
    .attr("height", mainRectH)
    .attr("ry", 3.19)
    .attr("fill", "none")
    .style("stroke-linejoin", "round")
    .style("stroke-width", 0.503)
    .style("stroke", "black")
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  g.append("path")
    .attr("class", "topTrapeze") // Top trapeze
    .attr("d", "m77.2 68.8h53l31.5 12.7-116 .1z")
    .attr("style", "fill:#bae0ed;stroke-width:.5;stroke:#000")
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  g.append("rect") // Bottom Rect (Children container)
    .attr("class", "bottomRect")
    .attr("x", 44)
    .attr("y", bottomRectY)
    .attr("width", 119)
    .attr("height", bottomRectH)
    .attr("ry", 2.16)
    .attr(
      "style",
      "fill:#d3eaf2;stroke-linejoin:round;stroke-miterlimit:43.5;stroke-width:.5;stroke:#000"
    )
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  g.append("rect") // Top rect (Name, logo and icon container)
    .attr("class", "topRect")
    .attr("x", 44)
    .attr("y", 82.5)
    .attr("width", 119)
    .attr("height", 30)
    .attr("ry", 2.33)
    .attr("style", "fill:#d3eaf2;stroke-width:.5;stroke:#000")
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  g.append("rect") //White logo container (to be replaced by a logo)
    .attr("x", 49.9)
    .attr("y", 85.9)
    .attr("width", 24.1)
    .attr("height", 22.7)
    .attr(
      "style",
      "fill:#fff;fill-rule:evenodd;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:.715;paint-order:stroke fill markers"
    )
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  var txt1 = g //Instance Name
    .append("text")
    .attr("x", 108.97618)
    .attr("y", 93.299805)
    .attr(
      "style",
      "font-family:Alef;font-size:7.06px;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;letter-spacing:0px;line-height:1.25;stroke-width:.37;text-align:center;text-anchor:middle;word-spacing:0px"
    )
    .attr("xml:space", "preserve")
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");
  txt1
    .append("tspan")
    .attr("x", 108.97618)
    .attr("y", 93.299805)
    .attr(
      "style",
      "font-family:Alef;font-size:7.06px;font-style:italic;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal"
    )
    .text(object.name)
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  var txt2 = g //Type Name
    .append("text")
    .attr("x", 89.237282)
    .attr("y", 105.40365)
    .attr(
      "style",
      "fill:#000000;font-family:sans-serif;font-size:10.6px;line-height:1.25;stroke-width:.265"
    )
    .attr("xml:space", "preserve")
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");
  txt2
    .append("tspan")
    .attr("x", 89.237282)
    .attr("y", 105.40365)
    .attr(
      "style",
      "font-family:sans-serif;font-size:6.35px;font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-weight:bold;stroke-width:.265"
    )
    .text(object.typeName)
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  g.append("rect") // Middle rectangle (inputs and outputs container)
    .attr("class", "middleRect")
    .attr("x", 44)
    .attr("y", middleRectY)
    .attr("width", 119)
    .attr("height", middleRectH)
    .attr("ry", 2.17)
    .attr("style", "fill:#d3eaf2;stroke-width:.5;stroke:#000")
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  // ------------------------------------------  Outputs and inputs --------------------------------------------

  for (let i = 0; i < object.requirements.length; i++) {
    var path;
    if (i == 0) {
      path =
        "m38.8 115 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0234-2.52l-2.47-1.99z";
    } else if (i == 1) {
      path =
        "m38.8 122 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0234-2.52l-2.47-1.99z";
    } else if (i == 2) {
      path =
        "m38.8 129 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0234-2.52l-2.47-1.99z";
    } else if (i == 3) {
      path =
        "m38.8 136 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0234-2.52l-2.47-1.99z";
    }
    g.append("path") //Input arrow
      .attr("d", path)
      .attr(
        "style",
        "fill-rule:evenodd;fill:#f2f507;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:.259;stroke:#000"
      )
      .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

    var txt3 = g // Input  Name
      .append("text")
      .attr("x", 69)
      .attr("y", 122 + i * 7)
      .attr(
        "style",
        "font-family:Alef;font-size:5.29px;font-variant-ligatures:none;letter-spacing:0px;line-height:1.25;stroke-width:.265;text-anchor:middle;word-spacing:0px"
      )
      .attr("xml:space", "preserve")
      .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");
    txt3
      .append("tspan")
      .attr("x", 69)
      .attr("y", 122 + i * 7)
      .attr("style", "stroke-width:.265")
      .text(object.requirements[i].name)
      .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");
  }

  for (let i = 0; i < object.capabilities.length; i++) {
    var path;
    if (i == 0) {
      path =
        "m155 115 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0233-2.52l-2.47-1.99z";
    } else if (i == 1) {
      path =
        "m155 122 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0233-2.52l-2.47-1.99z";
    } else if (i == 2) {
      path =
        "m155 129 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0233-2.52l-2.47-1.99z";
    } else if (i == 3) {
      path =
        "m155 136 4.01 3.22-4.01 3.4h9.98l2.5-2.12c1.45-1.08.735-1.8-.0233-2.52l-2.47-1.99z";
    }
    g.append("path") // Ouput
      .attr("d", path)
      .attr(
        "style",
        "fill-rule:evenodd;fill:#12ed00;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:.259;stroke:#000"
      )
      .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

    var txt6 = g //Output Name
      .append("text")
      .attr("x", 139)
      .attr("y", 122 + i * 7)
      .attr(
        "style",
        "font-family:Alef;font-size:5.29px;font-variant-ligatures:none;letter-spacing:0px;line-height:1.25;stroke-width:.265;text-anchor:middle;word-spacing:0px"
      )
      .attr("xml:space", "preserve")
      .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");
    txt6
      .append("tspan")
      .attr("x", 139)
      .attr("y", 122 + i * 7)
      .attr("style", "stroke-width:.265")
      .text(object.capabilities[i].name)
      .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");
  }

  // --------------------------------------------------- End of Outputs and Inputs ------------------------------------------------------

  g.append("svg:image") // Type Icon
    .attr("class", "icon")
    .attr("x", 140)
    .attr("y", 87.8)
    .attr("width", 20)
    .attr("height", 20)
    .attr("xlink:href", object.icon)
    .attr("transform", "scale(" + ctx.modelArea.levels[object.level] + ")");

  //g.attr("transform", "translate(" + [-43, -81] + ")");

  return g;
}
