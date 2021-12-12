// APIs
let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

// Initialization of variables globally
let countyData; let educationData;

let colorScale = ['rgb(155, 200, 155)', 'rgb(130, 200, 130)', 'rgb(105, 200, 105)',
                    'rgb(80, 200, 80)', 'rgb(55, 200, 55)', 'rgb(30, 200, 30)',
                    'rgb(15, 200, 15)', 'rgb(0, 200, 0)']

let criteria= [1,2,3,4,5,6,7,8].map(d => d*(60/8))

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')
let rects = d3.selectAll('.legs')
                .attr('fill', (d, i) => colorScale[i])


let drawMap = () => {

        canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', cd => {
                let id = cd['id']
                let eduId = educationData.find(d => d.fips == id)

                if (eduId['bachelorsOrHigher'] <= 7.5) {return colorScale[0]}
                else if (eduId['bachelorsOrHigher'] <= 15) {return colorScale[1]}
                else if (eduId['bachelorsOrHigher'] <= 22.5) {return colorScale[2]}
                else if (eduId['bachelorsOrHigher'] <= 30) {return colorScale[3]}
                else if (eduId['bachelorsOrHigher'] <= 37.5) {return colorScale[4]}
                else if (eduId['bachelorsOrHigher'] <= 45) {return colorScale[5]}
                else if (eduId['bachelorsOrHigher'] <= 52.5) {return colorScale[6]}
                else{return colorScale[7]}
            })
            .attr('data-fips', d => d.id)
            .attr('data-education', d => educationData.find(item => d.id === item.fips).bachelorsOrHigher)
            .on('mouseover', d => {
                d = d.srcElement.__data__
                d = educationData.find(item => item.fips === d.id)
                tooltip.transition()
                        .style('visibility', 'visible')
                tooltip.text(d.area_name+', '+d.state+': '+d.bachelorsOrHigher)
                tooltip.attr('data-education', d.bachelorsOrHigher)
            })
            .on('mouseout', d => {
                tooltip.transition()
                    .style('visibility', 'hidden')
            })

            
}; 

d3.json(countyURL).then(
    (data, error) => {
        if (error) {console.log(log)}
        else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {console.log(log)}
                    else {
                        educationData = data
                        drawMap()
                    }
                }
            )
        }
    }
)
