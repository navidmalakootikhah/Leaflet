
var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token={accessToken}",{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 24,
    accessToken: API_KEY});



var map = L.map("map", {
  center: [42,-42],
  zoom: 3,
});


greyscaleMap.addTo(map);

var earthquakes = new L.LayerGroup();



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

 
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#f06b6b";
      case magnitude > 4:
        return "#f0a76b";
      case magnitude > 3:
        return "#f3ba4d";
      case magnitude > 2:
        return "#f3db4d";
      case magnitude > 1:
        return "#e1f34d";
      default:
        return "#b7f34d";
    }
  }


  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }


  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
   
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#b7f34d",
      "#e1f34d",
      "#f3db4d",
      "#f3ba4d",
      "#f0a76b",
      "#f06b6b"
     ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  
  legend.addTo(map);

});