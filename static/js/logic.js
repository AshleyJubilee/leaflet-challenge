quakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson'

// Base
let map = L.map("map", {
    center: [39, -98],
    zoom: 5,
});

let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

baseMap.addTo(map);

let legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Depth Legend</h4>";
        div.innerHTML += '<i style="background: #e4d495"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #dbec24"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #ef9f16"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #bd660e"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #c64028"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #b91c1c"></i><span>90+</span><br>';
    return div;
}

legend.addTo(map)

// Tooltips and style
function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(
            `<p>Location: ${feature.properties.place}<br>
            Magnitude: ${feature.properties.mag}<br>
            Depth: ${feature.geometry.coordinates[2]}<br>`
        );
    };
};

markerSize = (magnitude) => {
   return magnitude * 3
};

depthColor = (depth) => {
   if (depth < 10) {
        return "#e4d495"
   } else if (depth < 30) {
        return "#dbec24"
   } else if (depth < 50) {
        return "#ef9f16" 
   } else if (depth < 70) {
        return "#bd660e"
   } else if (depth < 90) {
        return "#c64028"
   } else {
        return "#b91c1c"
   }
};

let quakeStyle = {
    "opacity": 1,
    "fillOpacity": 0.65,
    "weight": 1
};


// Query Data
d3.json(quakeURL).then(quakeData => {

    L.geoJSON(quakeData.features, {
        onEachFeature: onEachFeature,
        style: function(feature) {
            return {"color": depthColor(feature.geometry.coordinates[2]),
            "radius": markerSize(feature.properties.mag)}
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, quakeStyle);
        }
    }).addTo(map);
});

