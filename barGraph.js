/* --------------------------------------------------------------------
File: barGraph.js
Contructs the Bar Graph using D3
----------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Define SVG. "g" means group SVG elements together.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE. 
var xScale = d3.scale.ordinal()
    .rangeRoundBands([0,width], 0.1);

var yScale = d3.scale.linear()
    .range([height,0]);

// Define X and Y AXIS
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5, "$");


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 



// data.csv contains the country name(key) and its GDP(value)
d3.csv("data.csv",function(error, data){
     data.forEach(function(d) {
        d.key = d.key;
        d.value = +d.value;
    });
    
    
/* Sorting function to sort data
    data.sort(function(a,b) {
        return b.value - a.value;
    });
*/
    
    
    // Return X and Y SCALES. See Chapter 7:Scales (Scott M.) 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr("height", 0)
        .attr("y", height)
        .transition().duration(1000)
        .style("opacity", 5)
        .delay( function(d,i) {
			return i * 200;
		})
        .attr({
            'x': function(d) { return xScale(d.key); },
            'y': function(d) { return yScale(d.value); },
            'width': xScale.rangeBand(),
            'height': function(d) { return  height - yScale(d.value); },
            'fill': function(d,i) { return 'rgb(0, 0, ' + ((i * 30)+ 120) + ')' }
        });
    
    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .transition().duration(1000)
        .style("opacity", 5)
        .delay( function(d,i) {
			return i * 200;
		})
        .text(function(d){
            return d.value;
        })
        .attr({
            'x': function(d){ return xScale(d.key) + xScale.rangeBand()/2; },                             'y': function(d){ return yScale(d.value)+ 12; },
            'font-family': 'sans-serif',
            'font-size': '13px',
            'font-weight': 'bold',
            'fill': 'white',
            'text-anchor': 'middle'
        });
    
      // Draw xAxis and Label
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)" )
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        
    
    // Draw yAxis and Lable
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -170)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("Trillions of US Dollars ($)");
      
});

        
    
