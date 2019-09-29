// Initialize Map
var mymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoianRob216IiwiYSI6ImNrMHBxYXBtcDAwaHMzY25iZmpyZjhoZjYifQ.NcHSW7GHtHJjK-iduz1HBg"
});

// We create the map object 
var map = L.map("mapid", {
  center: [
    39.82, -98.57
  ],
  zoom: 4
});

// Add the tyle layer
mymap.addTo(map);

// Call the geoJSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // Creater Markers with functions for color and size
  function marker(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: color(feature.properties.mag),
      color: "#000000",
      radius: size(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Pass magnitude to fetch size
  function size(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
  
    return magnitude * 3.5;
  }

  // Pass magnitude to fetch color
  function color(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ff0000";
      case magnitude > 4:
        return "#ffa600";
      case magnitude > 3:
        return "#e5ff00";
      case magnitude > 2:
        return "#15ff00";
      case magnitude > 1:
        return "#1900fc";
      default:
        return "#868686";
    }
  }



  // Add JSON layer to Map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: marker,
    // Bind Popup
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  // Create a legend 
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var mags = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#868686",
      "#1900fc",
      "#15ff00",
      "#e5ff00",
      "#ffa600",
      "#ff0000"
    ];

    // Loop thru legend mags to add color
    for (var i = 0; i < mags.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        mags[i] + (mags[i + 1] ? "&ndash;" + mags[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});
