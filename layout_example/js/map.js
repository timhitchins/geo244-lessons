"use strict";
////////////////////////////////////////////
//styling function
function getStyle(feature) {
  if (feature.properties.PARTY === "Democrat") {
    return {
      fillColor: "blue",
      color: "white",
      weight: 2,
      opacity: 1,
      dashArray: "3",
      fillOpacity: 0.7
    };
  } else if (feature.properties.PARTY === "Republican") {
    return {
      fillColor: "red",
      color: "white",
      weight: 2,
      opacity: 1,
      dashArray: "3",
      fillOpacity: 0.7
    };
  } else {
    return {
      fillColor: "white",
      color: "white",
      weight: 2,
      opacity: 1,
      dashArray: "3",
      fillOpacity: 0.7
    };
  }
}

//add hover finctionality
function highlightFeature(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  //finally fill in the name
  const mapLegend = document.querySelector(".legend");
  if (layer.feature.properties.PARTY === "Democrat") {
    mapLegend.innerHTML = layer.feature.properties.NAME;
    mapLegend.style = "color: blue; visibility: visible;";
  } else if (layer.feature.properties.PARTY === "Republican") {
    mapLegend.innerHTML = layer.feature.properties.NAME;
    mapLegend.style = "color: blue; visibility: visible;";
  } else {
    mapLegend.innerHTML = null;
  }
}

//reset syle after hover
function resetHighlight(e) {
  states.resetStyle(e.target);

  //reset the div
  document.querySelector(".legend").innerHTML = null;
  document.querySelector(".legend").style.display = "none";
}

//function after a click
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

//parent function to set layer interactivity
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });

  //popup
  // does this feature have properties?
  if (feature.properties) {
    layer.bindPopup(`
    <h3>District ID: ${feature.properties.DISTRICTID}</h3>
    <p>Representative: ${feature.properties.NAME}</p>
    <p>Party: ${feature.properties.PARTY}</p>
    `);
  }
}

///////////////////////////////////////////////////
///layers
//Stamen example
const stamenToner = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    minZoom: 0,
    maxZoom: 20,
    ext: "png"
  }
);

//ESRI leaflet example
const esriTopo = L.esri.basemapLayer("Topographic");

//esri feature layer
const states = L.esri.featureLayer({
  url:
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Congressional_Districts/FeatureServer/0",
  simplifyFactor: 0.5,
  precision: 2,
  style: getStyle,
  onEachFeature: onEachFeature
});

////external geojson
//const states1860 = new L.GeoJSON.AJAX("../data/states_1860.geojson");

/////////////////////////////////////////////////////////////
//build map with layers
//change this around a bit
// var map = L.map('map').setView([51.505, -0.09], 13);
const map = L.map("map", {
  center: [39, -97.5],
  zoom: 4,
  layers: [stamenToner, states],
  zoomControl: false
});

//set the zoom
L.control
  .zoom({
    position: "topright"
  })
  .addTo(map);

//setup the layer controller options
const baseLayers = {
  "Stamen toner": stamenToner,
  "ESRI topo": esriTopo
};

const overlays = {
  "US States": states
  //    'US States 1860': states1860
};

//fianlly call layer controller
L.control.layers(baseLayers, overlays).addTo(map);

////
