var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 200
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".container")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcareLow";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]),
      d3.max(data, d => d[chosenXAxis])
    ])
    .range([0, width]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var topAxis = d3.axisTop(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(topAxis);
  return yAxis;
}



// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  return circlesGroup;
}

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {
//   if (chosenXAxis === "Poverty") {
//     var label = "In Poverty(%):";
//   }
//   else {
//     var label = "Age Median:";
//   }
//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//     });
//   circlesGroup.call(toolTip);
//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });
//   return circlesGroup;
// }
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(povertyData) {
  console.log(povertyData);
  // parse data
  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcareLow = +data.healthcareLow;
    data.ageMoe = +data.ageMoe;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.income = +data.income;
  });
  // xLinearScale function above csv import
  var xLinearScale = xScale(povertyData, chosenXAxis);
  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.healthcareLow)])
    .range([height, 0]);
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
  chartGroup.append("g")
    .call(leftAxis);
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("opacity", ".9");
  // Create group for 3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageMedianLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

  var householdLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income(Median)")
  // append y axis





  // yLinearScale function above csv import
  var yLinearScale = yScale(povertyData, chosenYAxis);
  // Create initial axis functions
  // append y axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // append y axis
  chartGroup.append("g")
    .call(leftAxis);


  // // Create group for 3 x- axis labels
  // var labelsGroup = chartGroup.append("g")
  var healthcareLowLabel = labelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", -250 - (height / 2))
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .classed("active", true)
    .attr("value", "healthcareLow") // value to grab for event listener
    .text("Healthcare Low");

  var smokesLabel = labelsGroup.append("text")
  // .attr("transform", "rotate(-90)")
  .attr("y", -50 - margin.left)
  .attr("x", -250 - (height / 2))
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .classed("active", true)
  .attr("value", "smokes") // value to grab for event listener
  .text("Smokes");

  var obesityHighLabel = labelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", -100 - margin.left)
    .attr("x", -250 - (height / 2))
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .classed("active", true)
    .attr("value", "obesityHigh") // value to grab for event listener
    .text("Obesity High")

  // updateToolTip function above csv import
  //var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // Step 1: Append tooltip div
  var toolTip = d3.select("body")
    .append("div")
    .style("display", "none")
    .classed("tooltip", true);

  // Step 2: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.style("display", "block")
        .html(
          `<strong>${(d.abbr)}<strong><hr>${d.poverty}
      ToolTip`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
  })
    // Step 3: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function() {
      toolTip.style("display", "none");
    });
//
// });

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        console.log(chosenXAxis)
        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(povertyData, chosenXAxis);
        yLinearScale = yScale(povertyData, chosenYAxis);
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
      //  yAxis = renderAxes(yLinearScale, yAxis);
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        // changes classes to change bold text
                if (chosenXAxis === "age") {
                  ageMedianLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  householdLabel
                    .classed("active", false)
                    .classed("inactive", true);

                }
                else if (chosenXAxis === "poverty"){
                  ageMedianLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  householdLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                  ageMedianLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  householdLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }


                if (chosenYAxis === "healthcareLow") {
                  healthcareLowLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  obesityHighLabel
                    .classed("active", false)
                    .classed("inactive", true);

                }
                else if (chosenYAxis === "obesityHigh"){
                  healthcareLowLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                  obesityHighLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else {
                  healthcareLowLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                  obesityHighLabel
                    .classed("active", true)
                    .classed("inactive", false);
                }


      }
    });
});
