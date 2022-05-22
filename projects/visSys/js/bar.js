/**
 * This file is responsible for dealing with bar chart
 * 
 *
 */          
            /** Store the data for bar chart */
            let bar_data;

            /** Set up colorScale for diff categories */
            let bar_colorScale = d3.scaleOrdinal(d3.schemeCategory10);
            let category_demage = ["sewer_and_water", "power", "roads_and_bridges", "medical",  "buildings", "average_damage"];

            /** Set up bar_canvas */
            let bar_margin = { top: 20, right: 30, bottom: 30, left: 30 };
            let bar_width = 600, bar_height = 400;
            let bar_draw_width = bar_width - bar_margin.left - bar_margin.right, bar_draw_height =  bar_height - bar_margin.top - bar_margin.bottom;


            let bar_canvas = d3.select('.top-chart').append('svg')
                .attr('width', bar_width)
                .attr('height', bar_height)
                .append('g')
                .attr('transform', `translate(${bar_margin.left}, ${bar_margin.top})`);

            /** Set up text */
            let bar_SelectedArea =  bar_canvas.append('text')
                    .attr('x', 390)
                    .attr('y', 20)
                    .style('font-family', 'Satisfy')
                    .style('font-size', 20)
                    .text('Selected: ');               

            let bar_SelectedText = bar_canvas.append('text')
                    .attr('id', 'barSelected')
                    .style('stroke', 'orange')
                    .attr('x', 470)
                    .attr('y', 19)
                    .text("Whole City");

            let descriptioin_bar = bar_canvas.append('text')
                    .attr('x', 10)
                    .attr('y', 20)
                    .style('font-family', 'Aldrich')
                    .style('font-size', 20)
                    .text('Categorial Damage');   
            /** set up scales and axes */
            let xScale = d3.scaleBand()
                            .domain(category_demage)
                            .range([0, bar_draw_width])
                            .padding(0.1);
            
            let yScale = d3.scaleLinear()
                            .domain([0,  10])
                            .range([bar_draw_height, 0]);

            let xAxis = d3.axisBottom(xScale);
            let yAxis = d3.axisLeft(yScale);
            
            /** load dota to draw the bar chat */
            d3.json('./data/category.json').then( function (data) {
                /** initialize the bar chart */
                bar_data = data;

                /** draw the bar chart */
                bar_canvas.selectAll('.bars')
                       .data(data[0])
                       .enter()
                            .append('rect')
                            .attr('class', 'bars')
                            .attr('x', function (d) { return xScale(d.key) } )
                            .attr('y', function (d) { return yScale(d.value) } )
                            .attr('width', xScale.bandwidth())
                            .attr('height', function (d) { return bar_draw_height - yScale(d.value) } )
                            .attr('fill', function (d) { return bar_colorScale(d.key) });
               
                /** draw the axes */
                bar_canvas.append('g')
                          .attr('transform', 'translate(0,' + bar_draw_height + ")")
                          .call(xAxis);
                bar_canvas.append('g')
                          .call(yAxis);

                /** add event handler */
                d3.selectAll('.bars')
                    .on('mouseenter', function (actual, d) {
                        // console.log(d);
                        /** make selected transparent */
                        d3.select(this)
                            .classed('bar-hover', true);    
                        /** update number on the bar */      
                        bar_canvas.append('text')     // make tooltip appear on the top of the bar
                            .attr('class', 'bar-number')
                            .attr('x',xScale(d.key) + xScale.bandwidth() / 2) // just tooltip to the right position
                            .attr('y', yScale(d.value) - 8)
                            .attr('text-anchor', 'middle')
                            .text(d.value.toFixed(2))
                            .style('stroke', 'steelblue')
                            .style('font-size', 20);     
                    })
                                                        
                    .on('mouseleave', function (actual, d) {
                        /** remove transparent */
                        d3.select(this)
                            .classed('bar-hover', false)
                        /** remove tooltip */  
                        d3.selectAll('.bar-number').remove();
                    })
            })

            /** Update function for the bar chart */
            function updateBarChart (districtIndex) {
                // console.log("I'm in updateBarChar func")
                /** remove all the previous elements */
                d3.selectAll(".bars").transition().duration(1000)
                .remove();
                let data = bar_data[districtIndex.toString()]; 

                /** build a new bar chart */
                bar_canvas.transition()
                .delay(200)
                .on('end', function() {
                    // console.log('hi, threre');
                    bar_canvas.selectAll('bars')
                        .data(data)
                        .enter()
                            .append('rect')
                            .attr('class', 'bars')
                            .attr('x', function (d) { return xScale(d.key) } )
                            .attr('y', function (d) { return yScale(d.value) } )
                            .attr('width', xScale.bandwidth())
                            .attr('height', function (d) { return bar_draw_height - yScale(d.value) } )
                            .attr('fill', function (d) { return bar_colorScale(d.key) });
                    
                    /** add event handler */
                    d3.selectAll('.bars')
                        .on('mouseenter', function (actual, d) {
                        // console.log(d);
                        /** make selected transparent */
                        d3.select(this)
                            .classed('bar-hover', true);    
                        /** update number on the bar */      
                        bar_canvas.append('text')     // make tooltip appear on the top of the bar
                            .attr('class', 'bar-number')
                            .attr('x',xScale(d.key) + xScale.bandwidth() / 2) // just bar-number to the right position
                            .attr('y', yScale(d.value) - 8)
                            .attr('text-anchor', 'middle')
                            .text(d.value.toFixed(2))
                            .style('stroke', 'steelblue')
                            .style('font-size', 20);
        
                    /** upodate selected text */
                    //   d3.select('#barDisplay')
                    //    .text(d.properties.Nbrhood);
        
                })
                                                    
                .on('mouseleave', function (actual, d) {
                    /** remove transparent */
                    d3.select(this)
                        .classed('bar-hover', false)
                    /** remove bar-number */  
                    d3.selectAll('.bar-number').remove();
                })
                    
                })
            } 