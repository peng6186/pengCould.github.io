/**
 *  This js file is to manage the title section
 * 
 */

let title_margin = { top: 20, right: 0, bottom: 20, left: 60 };
let title_width = 1200;
let title_height = 100;

/** The canvas of the title section */
let title_svg = d3.select('.title').append('svg')
                    .attr('width', title_width)
                    .attr('height', title_height);

/** text for title */
let title_text = title_svg.append('text')
        .attr('x', -10)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('class', 'myheading')
        .style('font-family', 'Sancreek')
        .attr('font-size', 30)
        .text("Dynamic Visual System");

/** text for team */
let team_text = title_svg.append("text")
        .attr('x', 1300)
        .attr('y', 80)
        .attr('font-family', 'Arvo')
        .attr('font-size', 20)
        .text("Author: Peng (pengcheng.xu@tufts.edu)");

/** Add some animation */
title_text.transition()
          .delay(1000)
          .duration(2000)
          .attr('x', title_width / 2)
          .attr('y', title_height / 2)
          .on('end', function () {
                  team_text.transition()
                        .duration(1500)
                        .attr('x', 800)
                        .attr('y', 80);
          })