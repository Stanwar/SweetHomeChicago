// Adapted from various Mike Bostock D3 examples https://github.com/mbostock
// Calling Function for Race Related Data
function passParameters(){

    // Get Drop Drop List to determine whether user wants to access district or community
    var dropSelect = document.getElementById("Chicago_Data");

    // Get Value of the drop down list
    var xdropSelect = dropSelect.options[dropSelect.selectedIndex].text;
    console.log("xdropSelect"+ xdropSelect);

   // onclick refresh div with new content
    document.getElementById('div1').innerHTML = "";

    document.getElementById('div21').innerHTML = "";
    document.getElementById('div23').innerHTML = "";


    document.getElementById('div31').innerHTML = "";
    document.getElementById('div33').innerHTML = "";
    
    document.getElementById('div41').innerHTML = "";
    document.getElementById('div43').innerHTML = "";
    

    // Run condition to selectively run the code for either communities or district
    if( xdropSelect == "Communities"){
        
        // picking data from respective dropdownlist to compare
        var dropDown1 = document.getElementById("dropDownList1");
        var xRegion1 = dropDown1.options[dropDown1.selectedIndex].text;

        var divValue21 = "div21";
        var divValue23 = "div23";

        // Call Function
        getRacePopulationCommunity(xRegion1,divValue21); 

        getCommunityAgeByRaceData(xRegion1,divValue23);

        var dropDown2 = document.getElementById("dropDownList2");
        var xRegion2 = dropDown2.options[dropDown2.selectedIndex].text;

        var divValue31 = "div31";
        var divValue33 = "div33";

        // Call Function
        getRacePopulationCommunity(xRegion2,divValue31); 
        getCommunityAgeByRaceData(xRegion2,divValue33); 


        var dropDown3 = document.getElementById("dropDownList3");
        var xRegion3 = dropDown3.options[dropDown3.selectedIndex].text;

        var divValue41 = "div41";
        var divValue43 = "div43";

        // Call Function
        getRacePopulationCommunity(xRegion3,divValue41); 
        getCommunityAgeByRaceData(xRegion3,divValue43); 

        document.getElementById('R1').innerHTML = xRegion1;
        document.getElementById('R2').innerHTML = xRegion2;
        document.getElementById('R3').innerHTML = xRegion3;

        getChicagoCommunityMap(xRegion1,xRegion2,xRegion3);


    }

    else if (xdropSelect == "Districts"){

        // picking data from respective dropdownlist to compare
        var dropDown1 = document.getElementById("distDropList1");
        var xRegion1 = dropDown1.options[dropDown1.selectedIndex].text;

        console.log("xRegion1" + xRegion1);

        var dataType1 = "Population";
        var dataType2 = "Age";

        var divValue21 = "div21";
        var divValue23 = "div23";

        // Call Function
        getRacePopulationDistrict(xRegion1,divValue21);
        getDistrictAgeByRaceData(xRegion1,divValue23);

        var dropDown2 = document.getElementById("distDropList2");
        var xRegion2 = dropDown2.options[dropDown2.selectedIndex].text;

                console.log("xRegion2" + xRegion2);

        var divValue31 = "div31";
        var divValue33 = "div33";

        // Call Function
        getRacePopulationDistrict(xRegion2,divValue31);
        getDistrictAgeByRaceData(xRegion2,divValue33);


        var dropDown3 = document.getElementById("distDropList3");
        var xRegion3 = dropDown3.options[dropDown3.selectedIndex].text;

        var divValue41 = "div41";
        var divValue43 = "div43";

        // Call Function
        getRacePopulationDistrict(xRegion3,divValue41);
        getDistrictAgeByRaceData(xRegion3,divValue43);

        document.getElementById('R1').innerHTML = xRegion1;
        document.getElementById('R2').innerHTML = xRegion2;
        document.getElementById('R3').innerHTML = xRegion3;

        getChicagoDistrictMap(xRegion1,xRegion2,xRegion3);
    }  
    else if (xdropSelect == "Chicago"){
        console.log("NOTHING");
    }
}

function getRacePopulationCommunity(CommunityName,DivValue) {

   console.log("getRacePopulationCommunity");

    // Defining variables for width and height
    //var margin = {top: 50, right: 50, bottom: 30, left: 50};

    var myCommunityName = CommunityName;

    var csvFile = "2010_community_race.csv";

    var myDivValue = DivValue;

    // Defining variables for width and height
    var margin = {top: 20, right: 30, bottom: 30, left: 70};
    var width  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var height = Math.round(document.getElementById(myDivValue).clientWidth/1.5) - margin.top - margin.bottom; 

    // Defining scales
    var xMainScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .25);

    var xSecondScale = d3.scale.ordinal();

    var yScale = d3.scale.linear()
            .range([height, 0]);

    var colorScale = d3.scale.ordinal()
        .range([ "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);

    // Defining d3 axis
    var xAxis = d3.svg.axis()
                .scale(xMainScale)
                .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left") 
                .tickFormat(d3.format(".2s"));

    // Taking the div for SVG creation
    myDivValue = "#" + myDivValue;

    console.log("second myDivValue " + myDivValue);

    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                //.attr("viewbox",'0,0,1200,800')
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        ; 

    // Calling csv file
    d3.csv(csvFile, function(error, unFilterData) {
     
        // Filtering data for a particular community
        var data = unFilterData.filter(function(d,i){

            if (d["community"] == myCommunityName )
            {
                return d;
            }

        });

        // Taking the header of the data except the community names 
        var races = d3.keys(data[0]).filter(function(key) { 
            return key !== "community"; 
        });

        // Creating the object array
        data.forEach(function(d) {
            d.races = races.map(function(name) { 
                return {name: name, value: + d[name]}; });
        });

        xMainScale.domain(data.map(function(d) { 
            return d.community; 
        }));

        // Defining domains
        xSecondScale.domain(races).rangeRoundBands([0, xMainScale.rangeBand()]);

        yScale.domain([0, d3.max(data, function(d) { 
            return d3.max(d.races, function(d) { return d.value; }); 
        })])
        ;

        //Displaying x axis
        var displayXaxis =
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis)
                            .append("text"); 

        // Add the text label for the x axis
        var displayLabel = svg.append("text")
       // .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
        .attr("transform","translate(" + (width/2) + " , 0 )") // added after deadline for scaling issue
        .style("text-anchor", "middle")
        .text("Race by Population ");
               
        // Displaying y Axis
        var displayYaxis =
                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 10)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text("No. of People");



        // Displaying the main scale based on the community value 
        var community = svg.selectAll(".community")
                          .data(data.filter(function(d){
                                    return d.community;
                                }))
                          .enter()
                          .append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { return "translate(" + xMainScale(d.community) + ",0)"; });

        // Displaying the bar by creating rect
        var displayRect = community.selectAll("rect")
                                .data(function(d) { return d.races; })
                                .enter()
                                .append("rect")
                                .attr("width", xSecondScale.rangeBand())
                                .attr("x", function(d) { 
                                    return xSecondScale(d.name); 
                                })
                                .attr("y", function(d) { 
                                    return yScale(d.value); 
                                })
                                .attr("height", function(d) { 
                                    return height - yScale(d.value); 
                                })
                                .style("fill", function(d) { 
                                    return colorScale(d.name); 
                                });

        var legend = svg.selectAll(".legend")
                      .data(races.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

        var displayLegendRec =
                            legend.append("rect")
                                  .attr("x", width - 10)
                                  .attr("width", 10)
                                  .attr("height", 10)
                                  .style("fill", colorScale);

        var displayLegendText =
                            legend.append("text")
                                  .attr("x", width - 24)
                                  .attr("y", 9)
                                  .attr("dy", ".35em")
                                  .style("text-anchor", "end")
                                  .text(function(d) { 
                                    return d; 
                                });

    });
}

function getRacePopulationDistrict(DistrictName,DivValue) {
    var myDistrictName = DistrictName;
    var myDivValue = DivValue;
    var csvFile = "2010_district_race.csv";

    console.log("getRacePopulationDistrict");

    // Defining variables for width and height
    var margin = {top: 20, right: 30, bottom: 30, left: 70};
    var width  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var height = Math.round(document.getElementById(myDivValue).clientWidth/1.5) - margin.top - margin.bottom; 

    // Defining scales
    var xMainScale = d3.scale.ordinal()
                     .rangeRoundBands([0, width], .25);

    var xSecondScale = d3.scale.ordinal();

    var yScale = d3.scale.linear()
                    .range([height, 0]);

    var colorScale = d3.scale.ordinal()
                       .range([ "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);


    var xAxis = d3.svg.axis()
                    .scale(xMainScale)
                    .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left") 
                .tickFormat(d3.format(".2s"));

    myDivValue = "#" + myDivValue;

    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                //.attr("viewbox",'2000,1200,1800,1200')
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        ; 

    d3.csv(csvFile, function(error, unFilterData) {
     
        var data = unFilterData.filter(function(d,i){

            if (d["district"] == myDistrictName )
            {
                return d;
            }

        });

        var races = d3.keys(data[0]).filter(function(key) { 
            return key !== "district"; });

        data.forEach(function(d) {
            d.races = races.map(function(name) { return {name: name, value: + d[name]}; });
        });

        xMainScale.domain(data.map(function(d) { 
            return d.district; }));

        xSecondScale.domain(races).rangeRoundBands([0, xMainScale.rangeBand()]);

        yScale.domain([0, d3.max(data, function(d) { return d3.max(d.races, function(d) { return d.value; }); })])
        ;


        var displayXaxis =
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);
        // Add the text label for the x axis
        var displayLabel = svg.append("text")
                                //.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
                                .attr("transform","translate(" + (width/2) + " , 0 )") // Added after deadline for scaling issue
                                .style("text-anchor", "middle")
                                .text("Race by Population ");

        var displayYaxis =
                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 10)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text("No. of People");


        var community = svg.selectAll(".community")
                          .data(data.filter(function(d){
                                    return d.district;
                                }))
                          .enter()
                          .append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { return "translate(" + xMainScale(d.district) + ",0)"; });

        var displayRect = community.selectAll("rect")
                                .data(function(d) { return d.races; })
                                .enter()
                                .append("rect")
                                .attr("width", xSecondScale.rangeBand())
                                .attr("x", function(d) { return xSecondScale(d.name); })
                                .attr("y", function(d) { return yScale(d.value); })
                                .attr("height", function(d) { return height - yScale(d.value); })
                                .style("fill", function(d) { return colorScale(d.name); });

        var legend = svg.selectAll(".legend")
                      .data(races.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

        var displayLegendRec =
                            legend.append("rect")
                                  .attr("x", width - 10)
                                  .attr("width", 10)
                                  .attr("height", 10)
                                  .style("fill", colorScale);

        var displayLegendText =
                            legend.append("text")
                                  .attr("x", width - 24)
                                  .attr("y", 9)
                                  .attr("dy", ".35em")
                                  .style("text-anchor", "end")
                                  .text(function(d) { 
                                    return d; 
                                });


    });
}


function getCommunityAgeByRaceData(CommunityName,DivValue){
    // Defining variables for width and height
    var margin = {top: 50, right: 50, bottom: 30, left: 40};

    var myCommunityName = CommunityName;

    var myDivValue = DivValue;

    console.log("getCommunityAgeByRaceData");

    console.log("myDivValue " + myDivValue);

    // Defining variables for width and height
    var margin = {top: 20, right: 30, bottom: 30, left: 70};
    var width  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var height = Math.round(document.getElementById(myDivValue).clientWidth/1.5) - margin.top - margin.bottom; 

    // Defining scales
    var xMainScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .25);

    var xSecondScale = d3.scale.ordinal();

    var yScale = d3.scale.linear()
                    .range([height, 0]);

    var colorScale = d3.scale.ordinal()
         .range([ "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);

    // Defining d3 axis
    var xAxis = d3.svg.axis()
                .scale(xMainScale)
                .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left") 
                .tickFormat(d3.format(".2s"));

    // Taking the div for SVG creation
    myDivValue = "#" + myDivValue;

    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height",height + margin.top + margin.bottom)
                //.attr("viewbox",'0,0,1200,800')
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        ; 

    // Calling csv file
    d3.csv("Age_by_Race_WWWTotal.csv", function(error, unFilterData) {
     
        // Filtering data for a particular community
        var data = unFilterData.filter(function(d,i){

            if (d["community"] == myCommunityName )
            {
                return d;
            }

        });

        // Taking the header of the data except the community names 
        var races = d3.keys(data[0]).filter(function(key) { 
            return key !== "community" && key != "group"; 
        });

        // Creating the object array
        data.forEach(function(d) {
            d.races = races.map(function(name) { 
                return {name: name, value: + d[name]}; });
        });

        xMainScale.domain(data.map(function(d) { 
            return d.group; 
        }));

        // Defining domains
        xSecondScale.domain(races).rangeRoundBands([0, xMainScale.rangeBand()]);

        yScale.domain([0, d3.max(data, function(d) { 
            return d3.max(d.races, function(d) { return d.value; }); 
        })])
        ;

        //Displaying x axis
        var displayXaxis =
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);


                // Add the text label for the x axis
        var displayLabel = svg.append("text")
                               // .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
                               .attr("transform","translate(" + (width/2) + " , 0 )") // Added after deadline for scaling issue
                                .style("text-anchor", "middle")
                                .text("Population by Age");
        // Displaying y Axis
        var displayYaxis =
                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y",3)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text("No. of People");

        // Displaying the main scale based on the community value 
        var community = svg.selectAll(".group")
                          .data(data.filter(function(d){
                                    return d.community;
                                }))
                          .enter()
                          .append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { return "translate(" + xMainScale(d.group) + ",0)"; });

        // Displaying the bar by creating rect
        var displayRect = community.selectAll("rect")
                                .data(function(d) { return d.races; })
                                .enter()
                                .append("rect")
                                .attr("width", xSecondScale.rangeBand())
                                .attr("x", function(d) { 
                                    return xSecondScale(d.name); 
                                })
                                .attr("y", function(d) { 
                                    return yScale(d.value); 
                                })
                                .attr("height", function(d) { 
                                    return height - yScale(d.value); 
                                })
                                .style("fill", function(d) { 
                                    return colorScale(d.name); 
                                });

        // Creating legend class to get legends
        var legend = svg.selectAll(".legend")
                      .data(races.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

        // Displaying the legend based
        var displayLegendRec =
                            legend.append("rect")
                                  .attr("x", width - 10)
                                  .attr("width", 10)
                                  .attr("height", 10)
                                  .style("fill", colorScale);

        // Displaying the legend text based on the subclass of the text displayed
        var displayLegendText =
                            legend.append("text")
                                  .attr("x", width - 12)
                                  .attr("y", 9)
                                  .attr("dy", ".35em")
                                  .style("text-anchor", "end")
                                  .text(function(d) { return d; });

    });
}

function getDistrictAgeByRaceData(DistrictName,DivValue){ 

    var myDistrictName = DistrictName;
    var myDivValue = DivValue; 

    console.log("getDistrictAgeByRaceData");

    // Defining variables for width and height
    var margin = {top: 20, right: 30, bottom: 30, left: 70};
    var width  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var height = Math.round(document.getElementById(myDivValue).clientWidth/1.5) - margin.top - margin.bottom; 

    // Define a ordinal range for our main xAxis
    var xMainScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .25);
    // Define an or
    var xSecondScale = d3.scale.ordinal();

    var yScale = d3.scale.linear()
                    .range([height, 0]);

    var colorScale = d3.scale.ordinal()
                     //.range([ "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);
                     //.range([ "#FF9900", "#CCCC00", "#009900", "#66FF66","#33CCFF", "#99CCFF"]);
                    .range(["#CC3300","#CC6600","#006699","#0066FF","#FF9966","#FF99FF"]);

    var xAxis = d3.svg.axis()
                .scale(xMainScale)
                .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left") 
                .tickFormat(d3.format(".2s"));

    myDivValue = "#" + myDivValue;

    var svg = d3.select(myDivValue).append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height",height + margin.top + margin.bottom)
                //.attr("viewbox",'0,0,800,800')
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        ; 

        d3.csv("Age_By_Race_DistrictWWWTotal.csv", function(error, unFilterData) {
     
        var data = unFilterData.filter(function(d,i){

            if (d["district"] == myDistrictName)
            {
                return d;
            }

        });

        var ageGroups = d3.keys(data[0]).filter(function(columnKey) { 
            return columnKey != "district" && columnKey != "group"; 
        });

        data.forEach(function(d) {
            d.ageGroups =   ageGroups.map(
                            function(name) { 
                                return {name: name, value: + d[name]}; 
                            });
        });

        xMainScale.domain(data.map(function(d) { 
            return d.group; 
            }));

        xSecondScale.domain(ageGroups).rangeRoundBands([0, xMainScale.rangeBand()]);

        yScale.domain([0, d3.max(data, function(d) { return d3.max(d.ageGroups, function(d) { return d.value; }); })])
        ;

        var displayXaxis =
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);
        // Add the text label for the x axis
        var displayLabel = svg.append("text")
                                //.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
                                .attr("transform","translate(" + (width/2) + " , 0 )") // Added after deadline for scaling issue
                                .style("text-anchor", "middle")
                                .text("Population by Age");

        var displayYaxis =
                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 3)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text("No. of People");

        var group = svg.selectAll(".group")
                          .data(data.filter(function(d){
                                    return d.group;
                                }))
                          .enter()
                          .append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { return "translate(" + xMainScale(d.group) + ",0)"; });

        var displayRect = group.selectAll("rect")
                                .data(function(d) { return d.ageGroups; })
                                .enter()
                                .append("rect")
                                .attr("width", xSecondScale.rangeBand())
                                .attr("x", function(d) { 
                                    return xSecondScale(d.name); 
                                })
                                .attr("y", function(d) { return yScale(d.value); })
                                .attr("height", function(d) { return height - yScale(d.value); })
                                .style("fill", function(d) { return colorScale(d.name); });

        var legend = svg.selectAll(".legend")
                      .data(ageGroups.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

        var displayLegendRec =
                            legend.append("rect")
                                  .attr("x", width - 10)
                                  .attr("width", 10)
                                  .attr("height", 10)
                                  .style("fill", colorScale);

        var displayLegendText =
                            legend.append("text")
                                  .attr("x", width - 12)
                                  .attr("y", 9)
                                  .attr("dy", ".35em")
                                  .style("text-anchor", "end")
                                  .text(function(d) { return d; });

    });
}

function getChicagoCommunityMap(xCommunity1,xCommunity2,xCommunity3){

    myDivValue = "div1";

    var xCommunity1 = xCommunity1;
    console.log("xCommunity1" + xCommunity1);
    var xCommunity2 = xCommunity2;
    var xCommunity3 = xCommunity3;
    // Defining variables for width and height
    var margin = {top: 50, right: 50, bottom: 30, left: 40};
    var map_width = document.getElementById(myDivValue).clientWidth;
    var map_height = Math.round(map_width)*1.2;

    myDivValue = "#" + myDivValue;
    var  svg = d3.select(myDivValue)
              .append("svg")
              .attr("width", map_width)
              .attr("height", map_height *1.2)
              ;


                      var displayLabel = svg.append("text")
                                //.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
                                .attr("transform","translate(" + (map_width/2) + " , "+ map_height/10 + ")") // Added after deadline for scaling issue
                                .style("text-anchor", "middle")
                                .text("City of Chicago")
                                .style("font-weight","bold")
                                .style("font-size",15+"px");

            var color = d3.scale.quantize()
                      .range(["rgb(250,29,5)",
                              "rgb(250,5,250)",
                              "rgb(101,201,136)",
                              "rgb(2,250,89)",
                              "rgb(250,188,2)",
                              "rgb(250,130,2)",
                              "rgb(213,250,13)",
                              "rgb(4,149,246)",
                              "rgb(186,138,164)"]);


          d3.csv("comm_chicago.csv", function(data) {
            //Set input domain for color scale
            color.domain([
              d3.min(data, function(d) { return d.community_value; }), 
              d3.max(data, function(d) { return d.community_value; })
            ]);

          d3.json("chicago_map.json", function(json) {
          //Loop through to merge data with Json File
                for (var i = 0; i < data.length; i++) {

                    //Grab community name
                    var dataCommunity = data[i].community;

                    //Grab data value, and convert from string to float
                    var dataValue = parseFloat(data[i].community_value);

                    //Find the corresponding community inside the Json file
                    for (var j = 0; j < json.features.length; j++) {

                        var jsonCommunity = json.features[j].properties.name;

                        // console.log("Coordinates" + json.features[j].geometry.coordinates);

                        if (dataCommunity == jsonCommunity) {

                            //Copy the data value into the JSON
                            json.features[j].properties.value = dataValue;

                            //Stop looking through the JSON
                            break;

                        }
                    }   
                }
            var center = d3.geo.centroid(json);
            var scale  = map_width * 135 ;
            var translateOffset = [map_width/8,map_height/1.5];

            var projection = d3.geo.mercator()
                              .scale(scale)
                              .center(center)
                              .translate(translateOffset);


            //Define path generator
            var path = d3.geo.path()
                     .projection(projection);

                     console.log("Before PAth ");

            svg.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("stroke","white")
               .style("fill", function(d) {
                //Get data value
                if ( d.properties.name == xCommunity1 || d.properties.name == xCommunity2 || d.properties.name == xCommunity3){
                                    var value = d.properties.value;
                }

                
                console.log("value" + value);
                if (value) {
                  //If value exists…
                  return color(value);
                } else {
                  //If value is undefined…
                  return "#D6D6C2";
                }
             });

               svg.selectAll("text")
               .data(json.features)
               .enter()
               .append("svg:text")
               .text(function(d){
                  return d.properties.name;
                })
               .attr("x", function(d){
                return path.centroid(d)[0];
                })
                .attr("y", function(d){
                return  path.centroid(d)[1];
                })
                .attr("text-anchor","middle")
                .attr("stroke","#222")
                 .style("font-size", function (d){
                    return map_width/100 + "px"; 
                    })
                .attr("text-anchor",function(d){
                     var regionName = d.properties.name;
                     if (regionName == "West Garfield Park"){
                       return "middle";
                   }
                   else if (regionName == "East Garfield Park"){
                       return "top";
                   }
                   else if ( regionName == "Hegewisch"){
                       return "bottom";
                   }
                   else if ( regionName =="Burnside"){
                   return "bottom";
                   }        
                   else if ( regionName == "West Englewood"){
                    return "bottom";
                   }
                      else if ( regionName == "Englewood"){
                    return "top";
                   }
                   else {
                       return "middle";
                   }
                    });
              ;

  })

    });
}

function getChicagoDistrictMap(xDistrict1,xDistrict2,xDistrict3){

    myDivValue = "div1";

    var xCommunity1 = xDistrict1;
    console.log("xCommunity1" + xCommunity1);
    var xCommunity2 = xDistrict2;
    var xCommunity3 = xDistrict3;
    // Defining variables for width and height
    var margin = {top: 50, right: 50, bottom: 30, left: 40};
    var map_width = document.getElementById(myDivValue).clientWidth;
    var map_height = Math.round(map_width)*1.2;

    myDivValue = "#" + myDivValue;
    var  svg = d3.select(myDivValue)
              .append("svg")
              .attr("width", map_width)
              .attr("height", map_height *1.2)
          //    .attr("viewBox", "0 " + " 0 " + 640 + " "+ 480)
          //    .attr("preserveAspectRatio","xMaxYmax")
              ;

                      var displayLabel = svg.append("text")
                                //.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
                                .attr("transform","translate(" + (map_width/2) + " , "+ map_height/10 + ")") // Added after deadline for scaling issue
                                .style("text-anchor", "middle")
                                .text("City of Chicago")
                                .style("font-weight","bold")
                                .style("font-size",15+"px");

            var color = d3.scale.quantize()
                      .range(["rgb(250,29,5)",
                              "rgb(250,5,250)",
                              "rgb(101,201,136)",
                              "rgb(2,250,89)",
                              "rgb(250,188,2)",
                              "rgb(250,130,2)",
                              "rgb(213,250,13)",
                              "rgb(4,149,246)",
                              "rgb(186,138,164)"]);


          d3.csv("comm_chicago.csv", function(data) {
            //Set input domain for color scale
            color.domain([
              d3.min(data, function(d) { return d.district_value; }), 
              d3.max(data, function(d) { return d.district_value; })
            ]);

          d3.json("chicago_map.json", function(json) {
          //Loop through to merge data with Json File
                for (var i = 0; i < data.length; i++) {

                    //Grab community name
                    var dataCommunity = data[i].community;

                    //Grab data value, and convert from string to float
                    var dataValue = parseFloat(data[i].district_value);

                    //Find the corresponding community inside the Json file
                    for (var j = 0; j < json.features.length; j++) {

                        var jsonCommunity = json.features[j].properties.name;

                        // console.log("Coordinates" + json.features[j].geometry.coordinates);

                        if (dataCommunity == jsonCommunity) {

                            //Copy the data value into the JSON
                            json.features[j].properties.value = dataValue;

                            //Stop looking through the JSON
                            break;

                        }
                    }   
                }
            var center = d3.geo.centroid(json);
            var scale  = map_width * 135 ;
            var translateOffset = [map_width/8,map_height/1.5];

            var projection = d3.geo.mercator()
                              .scale(scale)
                              .center(center)
                              .translate(translateOffset);


            //Define path generator
            var path = d3.geo.path()
                     .projection(projection);

                     console.log("Before PAth ");

            svg.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("stroke","white")
               .style("fill", function(d) {
                //Get data value
                var value = d.properties.value;
                if (value) {
                  //If value exists…
                  return color(value);
                } else {
                  //If value is undefined…
                  return "#333";
                }
             });

               svg.selectAll("text")
               .data(json.features)
               .enter()
               .append("svg:text")
               .text(function(d){
                  return d.properties.name;
                })
               .attr("x", function(d){
                return path.centroid(d)[0];
                })
                .attr("y", function(d){
                return  path.centroid(d)[1];
                })
                .attr("text-anchor","middle")
                .attr("stroke","black")
                .style("font-size", function (d){
                    return map_width/100 + "px"; 
                    })
                .attr("text-anchor",function(d){
                     var regionName = d.properties.name;
                     if (regionName == "West Garfield Park"){
                       return "middle";
                   }
                   else if (regionName == "East Garfield Park"){
                       return "top";
                   }
                   else if ( regionName == "Hegewisch"){
                       return "bottom";
                   }
                   else if ( regionName =="Burnside"){
                   return "bottom";
                   }        
                   else if ( regionName == "West Englewood"){
                    return "bottom";
                   }
                      else if ( regionName == "Englewood"){
                    return "top";
                   }
                   else {
                       return "middle";
                   }
                    });
              ;

  })

    });
}


function mainAgeParameters(){

    // Get Drop Drop List to determine whether user wants to access district or community
    var dropSelect = document.getElementById("Chicago_Data");

    // Get Value of the drop down list
    var xdropSelect = dropSelect.options[dropSelect.selectedIndex].text;

    console.log("xdropSelect"+ xdropSelect);

    // onclick refresh div with new content
    document.getElementById('div1').innerHTML = "";

    document.getElementById('div21').innerHTML = "";
    document.getElementById('div23').innerHTML = "";


    document.getElementById('div31').innerHTML = "";
    document.getElementById('div33').innerHTML = "";


    document.getElementById('div41').innerHTML = "";
    document.getElementById('div43').innerHTML = "";


    // Run condition to selectively run the code for either communities or district
    if( xdropSelect == "Communities"){
        
        // picking data from respective dropdownlist to compare
        var dropDown1 = document.getElementById("dropDownList1");
        var xRegion1 = dropDown1.options[dropDown1.selectedIndex].text;

        var divValue21 = "div21";
        var divValue22 = "div23";

        var Type1 = "Men";
        var Type2 = "Female";
        // Call Function
        getPieChart(xRegion1,xdropSelect,divValue21,Type1);

        getPieChart(xRegion1,xdropSelect,divValue22,Type2);

        var dropDown2 = document.getElementById("dropDownList2");
        var xRegion2 = dropDown2.options[dropDown2.selectedIndex].text;

        var divValue31 = "div31";
        var divValue32 = "div33";

        // Call Function
        getPieChart(xRegion2,xdropSelect,divValue31,Type1);

        getPieChart(xRegion2,xdropSelect,divValue32,Type2);


        var dropDown3 = document.getElementById("dropDownList3");
        var xRegion3 = dropDown3.options[dropDown3.selectedIndex].text;

        var divValue41 = "div41";
        var divValue42 = "div43";

        // Call Function
        getPieChart(xRegion3,xdropSelect,divValue41,Type1);

        getPieChart(xRegion3,xdropSelect,divValue42,Type2);

        document.getElementById('R1').innerHTML = xRegion1;
        document.getElementById('R2').innerHTML = xRegion2;
        document.getElementById('R3').innerHTML = xRegion3;

        getChicagoCommunityMap(xRegion1,xRegion2,xRegion3);

    }

    else if (xdropSelect == "Districts"){

          // picking data from respective dropdownlist to compare
        var dropDown1 = document.getElementById("distDropList1");
        var xRegion1 = dropDown1.options[dropDown1.selectedIndex].text;

        var divValue21 = "div21";
        var divValue22 = "div23";

        var Type1 = "Men";
        var Type2 = "Female";
        // Call Function
        getPieChart(xRegion1,xdropSelect,divValue21,Type1);

        getPieChart(xRegion1,xdropSelect,divValue22,Type2);

        var dropDown2 = document.getElementById("distDropList2");
        var xRegion2 = dropDown2.options[dropDown2.selectedIndex].text;

        var divValue31 = "div31";
        var divValue32 = "div33";

        // Call Function
        getPieChart(xRegion2,xdropSelect,divValue31,Type1);

        getPieChart(xRegion2,xdropSelect,divValue32,Type2);


        var dropDown3 = document.getElementById("distDropList3");
        var xRegion3 = dropDown3.options[dropDown3.selectedIndex].text;

        var divValue41 = "div41";
        var divValue42 = "div43";

        // Call Function
        getPieChart(xRegion3,xdropSelect,divValue41,Type1);

        getPieChart(xRegion3,xdropSelect,divValue42,Type2);

        document.getElementById('R1').innerHTML = xRegion1;
        document.getElementById('R2').innerHTML = xRegion2;
        document.getElementById('R3').innerHTML = xRegion3;

        getChicagoDistrictMap(xRegion1,xRegion2,xRegion3)

    }  
    else if (xdropSelect == "Chicago"){
        console.log("NOTHING");
    }
}

function getPieChart(CommunityName,RegionType,DivValue,Type){
    // Defining variables for width and height
    var myCommunityName = CommunityName;

    console.log("myCommunityName " + myCommunityName);

    var myDivValue = DivValue;

    console.log("myCommunityName " + myCommunityName);
    console.log("myDivValue " + myDivValue);

    var csvType = Type;

        console.log("csvType " + csvType);
    var regionType = RegionType;

        console.log("regionType " + regionType);
    var csvFile = "";

    if (csvType =="Men" && regionType == "Communities"){
        csvFile = "PieDataMenCommunity.csv";
    }
    else if (csvType =="Men" && regionType == "Districts"){
        csvFile = "PieDataMenDistrict.csv";

    }
    else if (csvType =="Female" && regionType == "Communities"){
        csvFile = "PieDataFemaleCommunity.csv";
    }
    else if (csvType =="Female" && regionType == "Districts"){
        csvFile = "PieDataFemaleDistrict.csv";
    }

    console.log("csvFile " + csvFile);
    console.log("width " + document.getElementById(myDivValue).offsetWidth);

    // Parameters for Scaling
    var height = 600;
    var width = 1200;

    var AreaWidth = 1200;
    var AreaHeight = 600;


    // Define radius of the PieChart
    var radius = Math.min(width, height) / 2.5;

    var margin = {top: 50, right: 50, bottom: 30, left: 40};

    var SVGwidth  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;

    console.log("SVGwidth" + SVGwidth);

    var SVGheight = Math.round(document.getElementById(myDivValue).clientWidth/1.5) - margin.top - margin.bottom; 

    var xPieSize= AreaWidth + margin.left+margin.right;
    // Define radius of the PieChart
    var radius = Math.min(width, height) / 2;
    console.log("radius " + radius);

    // Taking the color range to show data according to RGB Colors
    var colorScale = d3.scale.ordinal()
                        .range(["#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);

    // Defining Arc of the Pie
    var arc = d3.svg.arc()
              .outerRadius(radius - 20)
              .innerRadius(0);

    var pieData = d3.layout.pie()
                  .sort(null)
                  .value(function(d) { return d[myCommunityName]; });


    myDivValue = "#"  + myDivValue;

    // Creating the SVG Container for displaying the pie chart. Creating this inside body and translating it to the middle of the page
    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width", SVGwidth)
                .attr("height", SVGheight)
                .attr("viewBox", "" + -margin.left + " 0 " + xPieSize + " " + AreaHeight)
                .append("g")
                .attr("transform", "translate(" + (width/3) +  "," + (height / 2) + ")");

    //Calling csv function of d3 to access pie data
    d3.csv(csvFile, function(error, data) {

        // Parsing data as numbers from csv
        data.forEach(function(d) {
            console.log(d[myCommunityName]);
            d[myCommunityName] = +d[myCommunityName];

        });

                   // Creating group tags for each arc 
            var g = svg.selectAll(".arc")
                      .data(pieData(data))
                      .enter()
                      .append("g")
                      .attr("class", "arc");

            // Displaying the arc and coloring it according to the colorScale
            var displayArc = 
                    g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return colorScale(d.data.labels); });


             var displayTextLabel =
                    g.append("text")
                    .attr("transform", function(d){
                            var c = arc.centroid(d),
                                x = c[0],
                                y = c[1],
                            h = Math.sqrt(x*x + y*y);
                            return "translate(" + (x/h * radius) +  ',' +
                            (y/h * radius) +  ")"; // Taken from stack overflow
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", function(d){
                        return (d.endAngle + d.startAngle)/2 > Math.PI ?
                                "end" : "start";
                    })
                    .text(function(d) { 
                        return d.value; 
                    })
                    .style("font-size",30+"px");

            // Displaying the legend for each community
            var legend = svg.selectAll("legend")
                          .data(pieData(data))
                          .enter()
                          .append("g")
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

            var displayLegendRec =
                        legend.append("rect")
                              .attr("x", 600)
                              .attr("y", -10)
                              .attr("width", 25 )
                              .attr("height", 25)
                              .style("fill", function(d) { return colorScale(d.data.labels); });

            var displayLegendText =
                        legend.append("text")
                              .attr("x", 590)
                              .attr("y", 0)
                              .attr("dy", ".35em")
                              .style("text-anchor", "end")
                              .style("font-size",40 + "px")
                              .style("font-weight","bold")
                              .text(function(d) { return d.data.labels; });



        if (csvType == "Men"){
             svg.append("text")
              .attr("x", (width/50))             
              .attr("y", 360)
              .attr("text-anchor", "middle")  
              .style("font-size", "30px") 
              .style("text-decoration", "underline")  
              .text("AGE GROUPS - MEN");
        }

        else if (csvType =="Female") {
             svg.append("text")
              .attr("x", (width/50))             
              .attr("y", 360)
              .attr("text-anchor", "middle")  
              .style("font-size", "30px") 
              .style("text-decoration", "underline")  
              .text("AGE GROUPS - WOMEN");
        }


    });

}

// Calling function for Place of Origin Data
function getPlaceOfOrigin(){

    // Get Drop Drop List to determine whether user wants to access district or community
    var dropSelect = document.getElementById("Chicago_Data");

    // Get Value of the drop down list
    var xdropSelect = dropSelect.options[dropSelect.selectedIndex].text;
    console.log("xdropSelect"+ xdropSelect);

   // onclick refresh div with new content
    document.getElementById('div1').innerHTML = "";

    document.getElementById('div21').innerHTML = "";
    document.getElementById('div23').innerHTML = "";


    document.getElementById('div31').innerHTML = "";
    document.getElementById('div33').innerHTML = "";
    
    document.getElementById('div41').innerHTML = "";
    document.getElementById('div43').innerHTML = "";
    

    // Run condition to selectively run the code for either communities or district
    if( xdropSelect == "Communities"){
        
        // picking data from respective dropdownlist to compare
        var dropDown1 = document.getElementById("dropDownList1");
        var xRegion1 = dropDown1.options[dropDown1.selectedIndex].text;

        var divValue21 = "div21";
        var divValue23 = "div23";

        // Call Function
        getPlaceOfOriginBarChartCommunity(xRegion1,divValue21);
        getPlaceOfOriginPieChart(xRegion1,xdropSelect,divValue23);


        var dropDown2 = document.getElementById("dropDownList2");
        var xRegion2 = dropDown2.options[dropDown2.selectedIndex].text;

        var divValue31 = "div31";
        var divValue33 = "div33";

        // Call Function
        getPlaceOfOriginBarChartCommunity(xRegion2,divValue31);
        getPlaceOfOriginPieChart(xRegion2,xdropSelect,divValue33);


        var dropDown3 = document.getElementById("dropDownList3");
        var xRegion3 = dropDown3.options[dropDown3.selectedIndex].text;

        var divValue41 = "div41";
        var divValue43 = "div43";

        // Call Function
        getPlaceOfOriginBarChartCommunity(xRegion3,divValue41);
        getPlaceOfOriginPieChart(xRegion3,xdropSelect,divValue43);

                document.getElementById('R1').innerHTML = xRegion1;
        document.getElementById('R2').innerHTML = xRegion2;
        document.getElementById('R3').innerHTML = xRegion3;

        getChicagoCommunityMap(xRegion1,xRegion2,xRegion3);

    }

    else if (xdropSelect == "Districts"){

        // picking data from respective dropdownlist to compare
        var dropDown1 = document.getElementById("distDropList1");
        var xRegion1 = dropDown1.options[dropDown1.selectedIndex].text;

        console.log("xRegion1" + xRegion1);

        var divValue21 = "div21";
        var divValue23 = "div23";

        // Call Function
        getPlaceOfOriginBarChartDistrict(xRegion1,divValue21);
        getPlaceOfOriginPieChart(xRegion1,xdropSelect,divValue23);

        var dropDown2 = document.getElementById("distDropList2");
        var xRegion2 = dropDown2.options[dropDown2.selectedIndex].text;

                console.log("xRegion2" + xRegion2);

        var divValue31 = "div31";
        var divValue33 = "div33";

        // Call Function
        getPlaceOfOriginBarChartDistrict(xRegion2,divValue31);
        getPlaceOfOriginPieChart(xRegion2,xdropSelect,divValue33);


        var dropDown3 = document.getElementById("distDropList3");
        var xRegion3 = dropDown3.options[dropDown3.selectedIndex].text;

        var divValue41 = "div41";
        var divValue43 = "div43";

        // Call Function
        getPlaceOfOriginBarChartDistrict(xRegion3,divValue41);
        getPlaceOfOriginPieChart(xRegion3,xdropSelect,divValue43);

        // Displaying the region under investigation
        document.getElementById('R1').innerHTML = xRegion1;
        document.getElementById('R2').innerHTML = xRegion2;
        document.getElementById('R3').innerHTML = xRegion3;


        getChicagoDistrictMap(xRegion1,xRegion2,xRegion3);
    }  
    else if (xdropSelect == "Chicago"){
        console.log("NOTHING");
    }
}

function getPlaceOfOriginPieChart(specificRegion,typeRegion,DivValue){
 

    // Defining variables for width and height
    var myCommunityName = specificRegion;

    var regionType = typeRegion;
    var myDivValue = DivValue;

    var csvFile = "";

    if (regionType == "Districts"){
        csvFile = "Place_of_origin_district.csv";
    }
    else if (regionType == "Communities"){
        csvFile = "Place_of_origin_community.csv"
    }
    // Parameters for Scaling
    var height = 300;
    var width = 900;

    var AreaWidth = 500;
    var AreaHeight = 200;

    // Define radius of the PieChart
    var radius = Math.min(width, height) / 2.5;

    var margin = {top: 50, right: 50, bottom: 30, left: 40};

    var SVGwidth  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var SVGheight = Math.round(document.getElementById(myDivValue).clientWidth/1.2) - margin.top - margin.bottom; 

    var xPieSize= AreaWidth + margin.left+margin.right;
    // Define radius of the PieChart
    var radius = Math.min(width, height) / 2.5;

    // Taking the color range to show data according to RGB Colors
    var colorScale = d3.scale.ordinal()
                            .range(["#4D4D4D", "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);

    // Defining Arc of the Pie
    var arc = d3.svg.arc()
              .outerRadius(radius - 5)
              .innerRadius(0);

    var pieData = d3.layout.pie()
                  .sort(null)
                  .value(function(d) { return d[myCommunityName]; });

    myDivValue = "#" + myDivValue;

    // Creating the SVG Container for displaying the pie chart. Creating this inside body and translating it to the middle of the page
    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width", SVGwidth)
                .attr("height", SVGheight)
                .attr("viewBox", "" + -margin.left + " 0 " + xPieSize + " " + AreaHeight)
                .append("g")
                .attr("transform", "translate(" + (width/8) +  "," + (height / 3) + ")");

    //Calling csv function of d3 to access pie data
    d3.csv( csvFile, function(error, data) {

        // Parsing data as numbers from csv
        data.forEach(function(d) {
            d[myCommunityName] = +d[myCommunityName];

        });

                // Creating group tags for each arc 
            var g = svg.selectAll(".arc")
                      .data(pieData(data))
                      .enter()
                      .append("g")
                      .attr("class", "arc");

            // Displaying the arc and coloring it according to the colorScale
            var displayArc = 
                    g.append("path")
                    .attr("d", arc)
                    .style("fill", function(d) { return colorScale(d.data.labels); });


             var displayTextLabel =
                    g.append("text")
                    .attr("transform", function(d){
                            var c = arc.centroid(d),
                                x = c[0],
                                y = c[1],
                            h = Math.sqrt(x*x + y*y);
                            return "translate(" + (x/h * radius) +  ',' +
                            (y/h * radius) +  ")"; // Taken from stack overflow
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", function(d){
                        return (d.endAngle + d.startAngle)/2 > Math.PI ?
                                "end" : "start";
                    })
                    .text(function(d) { 
                        return d.value; 
                    });

            // Displaying the legend for each community
            var legend = svg.selectAll("legend")
                          .data(pieData(data))
                          .enter()
                          .append("g")
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            var displayLegendRec =
                        legend.append("rect")
                              .attr("x", 400)
                              .attr("y", -10)
                              .attr("width", 20 )
                              .attr("height", 20)
                              .style("fill", function(d) { return colorScale(d.data.labels); });

            var displayLegendText =
                        legend.append("text")
                              .attr("x", 390)
                              .attr("y", 0)
                              .attr("dy", ".35em")
                              .style("text-anchor", "end")
                              .style("font-size","20px")
                              .style("font-weight","bold")
                              .text(function(d) { return d.data.labels; });


             svg.append("text")
              .attr("x", (width/50))             
              .attr("y", 200)
              .attr("text-anchor", "middle")  
              .style("font-size", "20px") 
              .style("text-decoration", "underline")  
              .text("Major 8 Countries");

    });

}

function getPlaceOfOriginBarChartCommunity(CommunityName,DivValue) {
     // Defining variables for width and height
    var margin = {top: 50, right: 50, bottom: 30, left: 40};

    var myCommunityName = CommunityName;

    var myDivValue = DivValue;
    console.log("myDivValue " + myDivValue);

    // Defining variables for width and height
    var margin = {top: 20, right: 30, bottom: 30, left: 70};
    var width  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var height = document.getElementById(myDivValue).clientWidth/1.5 - margin.top - margin.bottom; 

    // Defining scales
    var xMainScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .25);

    var xSecondScale = d3.scale.ordinal();

    var yScale = d3.scale.linear()
            .range([height, 0]);

    var colorScale = d3.scale.ordinal()
        .range([ "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);

    // Defining d3 axis
    var xAxis = d3.svg.axis()
                .scale(xMainScale)
                .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left") 
                .tickFormat(d3.format(".2s"));

    // Taking the div for SVG creation
    myDivValue = "#" + myDivValue;


    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height",height + margin.top + margin.bottom)
               // .attr("viewbox",'0,0,1200,800')
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        ; 

    // Calling csv file
    d3.csv("Place_of_origin_bar_community.csv", function(error, unFilterData) {
     
        // Filtering data for a particular community
        var data = unFilterData.filter(function(d,i){

            if (d["community"] == myCommunityName )
            {
                return d;
            }

        });

        // Taking the header of the data except the community names 
        var regions = d3.keys(data[0]).filter(function(key) { 
            return key !== "community"; 
        });

        // Creating the object array
        data.forEach(function(d) {
            d.regions = regions.map(function(name) { 
                return {name: name, value: + d[name]}; });
        });

        xMainScale.domain(data.map(function(d) { 
            return d.community; 
        }));

        // Defining domains
        xSecondScale.domain(regions).rangeRoundBands([0, xMainScale.rangeBand()]);

        yScale.domain([0, d3.max(data, function(d) { 
            return d3.max(d.regions, function(d) { return d.value; }); 
        })])
        ;

        //Displaying x axis
        var displayXaxis =
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

        // Add the text label for the x axis
        var displayLabel = svg.append("text")
                               // .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")") // Commented after deadline
                               .attr("transform","translate(" + (width/2) + " , 0 )")  // Changed label after deadline
                                .style("text-anchor", "middle")
                                .text("Place of Origin By Region");
        // Displaying y Axis
        var displayYaxis =
                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 10)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text("No. of People");

        // Displaying the main scale based on the community value 
        var community = svg.selectAll(".community")
                          .data(data.filter(function(d){
                                    return d.community;
                                }))
                          .enter()
                          .append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { 
                            return "translate(" + xMainScale(d.community) + ",0)"; 
                        });

        // Displaying the bar by creating rect
        var displayRect = community.selectAll("rect")
                                .data(function(d) { return d.regions; })
                                .enter()
                                .append("rect")
                                .attr("width", xSecondScale.rangeBand())
                                .attr("x", function(d) { 
                                    return xSecondScale(d.name); 
                                })
                                .attr("y", function(d) { 
                                    return yScale(d.value); 
                                })
                                .attr("height", function(d) { 
                                    return height - yScale(d.value); 
                                })
                                .style("fill", function(d) { 
                                    return colorScale(d.name); 
                                });

        // Creating legend class to get legends
        var legend = svg.selectAll(".legend")
                      .data(regions.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

        // Displaying the legend based
        var displayLegendRec =
                            legend.append("rect")
                                  .attr("x", width + 15)
                                  .attr("width", 10)
                                  .attr("height", 10)
                                  .style("fill", colorScale);

        // Displaying the legend text based on the subclass of the text displayed
        var displayLegendText =
                            legend.append("text")
                                  .attr("x", width + 13)
                                  .attr("y", 9)
                                  .attr("dy", ".35em")
                                  .style("text-anchor", "end")
                                  .text(function(d) { return d; });

    });

}

function getPlaceOfOriginBarChartDistrict(DistrictName,DivValue) {

    var myDistrictName = DistrictName;
    var myDivValue = DivValue;

    // Defining variables for width and height
    var margin = {top: 50, right: 50, bottom: 30, left: 40};
    var width  = document.getElementById(myDivValue).clientWidth - margin.left - margin.right;
    var height = Math.round(document.getElementById(myDivValue).clientWidth/1.5) - margin.top - margin.bottom; 

    // Defining scales
    var xMainScale = d3.scale.ordinal()
                     .rangeRoundBands([0, width], .25);

    var xSecondScale = d3.scale.ordinal();

    var yScale = d3.scale.linear()
                    .range([height, 0]);

    var colorScale = d3.scale.ordinal()
                       .range([ "#5DA5DA", "#FAA43A", "#60BD68", "#B276B2","DECF3F", "#d0743c", "#F15854"]);


    var xAxis = d3.svg.axis()
                    .scale(xMainScale)
                    .orient("bottom");

    var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left") 
                .tickFormat(d3.format(".2s"));

    myDivValue = "#" + myDivValue;

    var svg = d3.select(myDivValue)
                .append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height",height + margin.top + margin.bottom)
               // .attr("viewbox",'0,0,800,800')
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")")
        ; 

    d3.csv("Place_of_origin_bar_district.csv", function(error, unFilterData) {
     
        var data = unFilterData.filter(function(d,i){

            if (d["district"] == myDistrictName )
            {
                return d;
            }

        });

        var regions = d3.keys(data[0]).filter(function(key) { return key !== "district"; });

        data.forEach(function(d) {
            d.regions = regions.map(function(name) { return {name: name, value: + d[name]}; });
        });

        xMainScale.domain(data.map(function(d) { 
            return d.district; 
        }));

        xSecondScale.domain(regions).rangeRoundBands([0, xMainScale.rangeBand()]);

        yScale.domain([0, d3.max(data, function(d) { return d3.max(d.regions, function(d) { return d.value; }); })])
        ;


        var displayXaxis =
                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

        // Add the text label for the x axis
        var displayLabel = svg.append("text")
                                //.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")  Comment-- Added after Deadline
                                .attr("transform","translate(" + (width/2) + " , 0 )")  // Added after deadline
                                .style("text-anchor", "middle")
                                .text("Place of Origin by Region");

        var displayYaxis =
                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 10)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text("No. of People");


        var community = svg.selectAll(".district")
                          .data(data.filter(function(d){
                                    return d.district;
                                }))
                          .enter()
                          .append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { return "translate(" + xMainScale(d.district) + ",0)"; });

        var displayRect = community.selectAll("rect")
                                .data(function(d) { return d.regions; })
                                .enter()
                                .append("rect")
                                .attr("width", xSecondScale.rangeBand())
                                .attr("x", function(d) { return xSecondScale(d.name); })
                                .attr("y", function(d) { return yScale(d.value); })
                                .attr("height", function(d) { return height - yScale(d.value); })
                                .style("fill", function(d) { return colorScale(d.name); });

        // Creating legend class to get legends
        var legend = svg.selectAll(".legend")
                      .data(regions.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 10 + ")"; });

        // Displaying the legend based
        var displayLegendRec =
                            legend.append("rect")
                                  .attr("x", width + 15)
                                  .attr("width", 10)
                                  .attr("height", 10)
                                  .style("fill", colorScale);

        // Displaying the legend text based on the subclass of the text displayed
        var displayLegendText =
                            legend.append("text")
                                  .attr("x", width + 13)
                                  .attr("y", 9)
                                  .attr("dy", ".35em")
                                  .style("text-anchor", "end")
                                  .text(function(d) { return d; });

     //   var footer = svg.selectAll(".footer")
       //                 .data("Population Density of Different Races")



    });
}