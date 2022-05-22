/**
 * This file is responsible for dealing with StHimark Map
 * 
 *
 */

 function resetVisSys () {

  /** reset bar chart */
  updateBarChart(0);
  bar_SelectedText.transition()
                  .delay(500)
                  .text('Whole City');
  /** reset line chart */
  updateLineChart(0);
  line_SelectedText.transition()
                  .delay(500)
                  .text('Whole City');
  /** reset map */
  d3.select('#dSelected')
              .text("");
  d3.select(".clicked")
                  .classed('clicked', false);
     
}



/** Set up colorScale for diff districts */
const tab20 = [
    "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78",
    "#2ca02c", "#98df8a", "#d62728", "#ff9896",
    "#9467bd", "#c5b0d5", "#8c564b", "#c49c94",
    "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7",
    "#bcbd22", "#dbdb8d", "#17becf","#9edae5"]
let colorScale = d3.scaleOrdinal(tab20);

/** Set up map_canvas */
let map_width = 600, map_height = 800;
let map_canvas = d3.select('.geo-map').append('svg')
    .attr('width', map_width)
    .attr('height', map_height)
    .append('g')
    .attr('tranform', 'translate(20, 20)');

/** load dota to draw the map */
d3.json('./data/StHimarkMap.json').then( function (data) {

    map_data = data;

    let projection = d3.geoMercator()
                        .scale(98000)
                        .center([-119, 0.08])
                        .translate([1750, 500]);
                    
    let pathGen = d3.geoPath().projection(projection);

    let group = map_canvas.selectAll('.district')
                .data(data.features)
                .enter()
                    .append('g')
                    .append('path')
                    .attr('d', pathGen)
                    .attr('class', 'district')
                    .attr('id', (d) => 'b' + d.properties.Id)
                    // .style('stroke', 'lightgrey')
                    .attr('fill', function (d) { return colorScale(d.properties.Nbrhood)});
    
    let TextArea = map_canvas.append('text')
                    .attr('x', 50)
                    .attr('y', 50)
                    .style('font-family', 'Arial')
                    .style('font-size', 20)
                    .text('District: ');
    let dynamicText = map_canvas.append('text')
                    .attr('id', 'dDisplay')
                    .style('stroke', 'green')
                    .attr('x', 140)
                    .attr('y', 49);
                   
    let SelectedArea =  map_canvas.append('text')
                            .attr('x', 400)
                            .attr('y', 50)
                            .style('font-family', 'Satisfy')
                            .style('font-size', 20)
                            .text('Selected: ');               
    
    let SelectedText = map_canvas.append('text')
                    .attr('id', 'dSelected')
                    .style('stroke', 'orange')
                    .attr('x', 490)
                    .attr('y', 49);

    let descriptioin_map = map_canvas.append('text')
                            .attr('x', 290)
                            .attr('y', 170)
                            .attr('text-anchor', 'middle')
                            .style('font-family', 'Aldrich')
                            .style('font-size', 20)
                            .text('City of St. Himark');   

    /** Add event handler */
    d3.selectAll('.district')
      .on('mouseenter', function (actual, d) {
            d3.select(this)
             .classed('hover', true);                    

            d3.select('#dDisplay')
             .text(d.properties.Nbrhood);


      })
                                            
      .on('mouseleave', function (actual, d) {
          // console.log(PointerEvent);
          // console.log(actual);
   
            d3.select(this)
                .classed('hover', false)
                .classed('district', true);
            d3.select('#dDisplay')
                .text("");
        
      })

      .on('click', function (actual, d) {
          /** Update map */
          d3.select('.clicked')
            .classed("clicked", false);
          d3.select(this)
            .classed("clicked", true);
          d3.select("#dSelected")
            .text(d.properties.Nbrhood);
          
          /** Call update functions for left charts */
          bar_SelectedText.text(d.properties.Nbrhood);
          updateBarChart(d.properties.Id);
          
          line_SelectedText.text(d.properties.Nbrhood);
          updateLineChart(d.properties.Id);

          
      })

})

