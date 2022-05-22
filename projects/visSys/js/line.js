/**
 *  This js file is to manage the title section
 * 
 */

let parseDate = d3.timeParse("%m/%d/%Y %H:%M");
let line_xScale, line_yScale;
const formatTime = d3.timeFormat("%m/%d/%Y %H:%M");
// console.log(formatTime);

/** Store the data for bar chart */
let line_data;

/** Set up line_canvas */
let line_margin = { top: 20, right: 30, bottom: 30, left: 30 };
let line_width = 600, line_height = 400;
let line_draw_width = line_width - line_margin.left - line_margin.right; 
let line_draw_height =  line_height - line_margin.top - line_margin.bottom;

let line_canvas = d3.select('.bottom-chart').append('svg')
    .attr('width', line_width)
    .attr('height', line_height)
    .append('g')
    .attr('transform', `translate(${line_margin.left}, ${line_margin.top})`);

let line_dialogBox =  d3.select('.bottom-chart').append('div')
                                .attr("class", 'lineDialog')
                                .style('opacity', 0);
                               
/** Set up text */
let line_SelectedArea =  line_canvas.append('text')
                                .attr('x', 390)
                                .attr('y', 20)
                                .style('font-family', 'Satisfy')
                                .style('font-size', 20)
                                .text('Selected: ');               

let line_SelectedText = line_canvas.append('text')
                                .attr('id', 'lineSelected')
                                .style('stroke', 'orange')
                                .attr('x', 470)
                                .attr('y', 19)
                                .text("Whole City");
                        
let descriptioin_line = line_canvas.append('text')
                                .attr('x', 10)
                                .attr('y', 20)
                                .style('font-family', 'Aldrich')
                                .style('font-size', 20)
                                .text('Avg Damage Over Time'); 

/** load dota to draw the line chat */
d3.json('./data/avgDemage.json').then( function (data) {

    /** convert date from str to obj */
    for ( key in data ) {
        data[key].forEach( function (d) {
            d.time = parseDate(d.time);
        })
    }

    line_data = data;
    // console.log(line_data);

    /** set up scales and axes */
    let xScale = d3.scaleTime()
                   .domain( d3.extent( data[0], function (d) { return d.time} ) )
                   .range([0, line_draw_width]);

    line_xScale = xScale;

    let yScale = d3.scaleLinear()
                   .domain([0,  10])
                   .range([line_draw_height, 0]);

    line_yScale = yScale;

    let xAxis = d3.axisBottom(xScale)
                .tickFormat( d3.timeFormat("%m/%d %H:%M") )
                .ticks(8);
    let yAxis = d3.axisLeft(yScale);

    /** line generator */
    let lineGen = d3.line()
                    .x( function (d) { return xScale(d.time); } )
                    .y( function (d) { return yScale(d.average_damage);} );

    /** draw the bar chart */
    line_canvas.selectAll('.line')
           .data([data[0]])
           .enter()
                .append('g')
                .append('path')
                .attr('class', 'line')
                .attr('d', lineGen)
                .attr('stroke', 'steelblue')
                .attr('fill', 'none');
    
    /** draw the axes */
    line_canvas.append('g')
              .attr('transform', 'translate(0,' + line_draw_height + ")")
              .call(xAxis);
    line_canvas.append('g')
              .call(yAxis);

    /** add event handler */
    d3.selectAll('.line')
        .on('mouseenter', function (actual, d) {

            let res = d.find( function (value, index, arr) { return Math.abs( (value.time - line_xScale.invert(actual.layerX - line_margin.left)) ) / (1000 * 60)  < 5  });
  
            line_dialogBox.style('opacity', 0.9);
            line_dialogBox.html(
                `
                time: ${formatTime(res.time)} <br/>
                avg_damage:  ${res.average_damage.toFixed(2)} <br/>
                buildings:  ${res.buildings.toFixed(2)} <br/> 
                medical:  ${res.medical.toFixed(2)} <br/>
                power:  ${res.power.toFixed(2)} <br/>
                roads_and_bridges: ${res.roads_and_bridges.toFixed(2)} <br/>
                sewer_and_water:  ${res.sewer_and_water.toFixed(2)}`
            )
                .style('left', actual.layerX + "px")
                .style('top', actual.layerY + "px");

            /** draw a selected circle */
            line_canvas.append('circle')
                        .attr('cx', actual.layerX - line_margin.left)
                        .attr('cy', actual.layerY - line_margin.top)
                        .attr('r', 5)
                        .attr('fill', 'none')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .style('opacity', 0.6)
                        .attr('class', 'lineCircle');

        })

        .on('mouseleave', function () {
            line_dialogBox.style('opacity', 0);

            /** change circle */
            d3.select(".lineCircle").remove();
        })
    
})


/** Update function for the line chart */
function updateLineChart (districtIndex) {

    /** remove all the previous elements */
    d3.selectAll(".line").remove();
    let data = line_data[districtIndex.toString()]; 

    /** build a new line chart */
    line_canvas.transition()
    .delay(200)
    .on('end', function() {

        /** line generator */
        let lineGen = d3.line()
            .x( function (d) { return line_xScale(d.time); } )
            .y( function (d) { return line_yScale(d.average_damage);} );

        line_canvas.selectAll('.line')
            .data([data])
            .enter()
                .append('g')
                .append('path')
                .attr('class', 'line')
                .attr('d', lineGen)
                .attr('stroke', 'steelblue')
                .attr('fill', 'none');
        
    /** add event handler */
    d3.selectAll('.line')
        .on('mouseenter', function (actual, d) {

            let res = d.find( function (value, index, arr) { return Math.abs( (value.time - line_xScale.invert(actual.layerX - line_margin.left)) ) / (1000 * 60)  < 15  });

            line_dialogBox.style('opacity', 0.9);
            // console.log(d);
            console.log(res);
            line_dialogBox.html(
                `
                time: ${formatTime(res.time)} <br/>
                avg_damage:  ${res.average_damage.toFixed(2)} <br/>
                buildings:  ${res.buildings.toFixed(2)} <br/> 
                medical:  ${res.medical.toFixed(2)} <br/>
                power:  ${res.power.toFixed(2)} <br/>
                roads_and_bridges: ${res.roads_and_bridges.toFixed(2)} <br/>
                sewer_and_water:  ${res.sewer_and_water.toFixed(2)}`
            )
                .style('left', actual.layerX + "px")
                .style('top', actual.layerY + "px");

            /** draw a selected circle */
            line_canvas.append('circle')
                        .attr('cx', actual.layerX - line_margin.left)
                        .attr('cy', actual.layerY - line_margin.top)
                        .attr('r', 5)
                        .attr('fill', 'none')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .style('opacity', 0.6)
                        .attr('class', 'lineCircle');

        })

        .on('mouseleave', function () {
            line_dialogBox.style('opacity', 0);

            /** change circle */
            d3.select(".lineCircle").remove();
        })

    })
} 