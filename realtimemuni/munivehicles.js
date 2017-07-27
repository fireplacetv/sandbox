
function findVehicles() {
  var VEHICLE_LOCATIONS_URL = 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni';
  var VEHICLE_TAG = 'vehicle';
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET',VEHICLE_LOCATIONS_URL,false);
  xmlHttp.send(null);
  var parser = new DOMParser();
  xmlDoc = parser.parseFromString(xmlHttp.responseText, 'text/xml');
  var vehicleDoms = xmlDoc.getElementsByTagName(VEHICLE_TAG);

  var vehicles_json = {
      "type":"FeatureCollection",
      "features":[]
  };

  for (var i=0; i < vehicleDoms.length; i++) {
  	var vd = vehicleDoms[i];
  		var vehicle = {
          "type":"Feature",
          "geometry":{
              "type":"Point",
              "coordinates":[]
          },
          "properties":{}};

    vehicle['id'] = vd.getAttribute('id');
  	vehicle.properties['id'] = vd.getAttribute('id');
  	vehicle.properties['speed'] = +vd.getAttribute('speedKmHr');
  	vehicle.properties['heading'] = +vd.getAttribute('heading');

  	vehicle.geometry.coordinates.push(+vd.getAttribute('lon'));
  	vehicle.geometry.coordinates.push(+vd.getAttribute('lat'));

  	vehicles_json.features.push(vehicle);
  }

  return vehicles_json;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


var width = 800,
    height = 800;

var svg = d3.select( "body" )
  .append( "svg" )
  .attr( "width", width )
  .attr( "height", height );

var albersProjection = d3.geo.transverseMercator()
  .scale( 300000 )
  .rotate([122.45, 0] )
  .center( [0, 37.76] )
  .translate( [width/2,height/2] );

var geoPath = d3.geo.path()
    .projection( albersProjection );


var neighborhoods = svg.append( "g" );
neighborhoods.selectAll( "path" )
  .data( neighborhoods_json.features )
  .enter()
  .append( "path" )
  .attr( "fill", "#ddd" )
  .attr( "stroke", "#000")
  .attr( "d", geoPath );

var streets = svg.append( "g" );
streets.selectAll( "path" )
  .data( streets_json.features )
  .enter()
  .append( "path" )
  .attr( "fill", "none" )
  .attr( "stroke", "#666")
  .attr( "d", geoPath );

var vehicles = svg.append( "g" );

vehicles_json = findVehicles();
vehicles.selectAll( "path" )
  .data( vehicles_json.features )
  .enter()
  .append( "path" )
  .attr("class","vehicle")
  .attr( "fill", "#bd2036" )
  .attr( "stroke", "#000" )
  .attr( "d", geoPath );

setInterval(function() {
    vehicles_json = findVehicles();
    vehicles.selectAll("path")
      .data(vehicles_json.features)
      // .transition()
      .attr("d", geoPath)
      .attr( "fill", "#bd2036" )
      .attr( "stroke", "#000" );
    vehicles.selectAll("path")
      .data(vehicles_json.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr( "fill", "#bd2036" )
      .attr( "stroke", "#000" );
    vehicles.selectAll("path")
      .data(vehicles_json.features)
      .exit()
      .remove()

    console.log('tick');
}, 3000);