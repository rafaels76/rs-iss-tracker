var map = L.map("map").setView([0, 09], 2);
var currentVisibility = '';
const issIconDayLight = L.icon({iconUrl: "assets/img/iss.png", iconSize: [50, 50], iconAnchor: [25, 25]});
const issIconEclipsed = L.icon({iconUrl: "assets/img/iss-e.png", iconSize: [50, 50], iconAnchor: [25, 25] });
const issRadious = L.circle([0,0], 2200e3, {color: "#19630a", opacity: 0.3, weight:1, fillColor: "#19630a", fillOpacity: 0.1}).addTo(map); 
const issMarker = L.marker([0, 0], { icon: issIconDayLight }).addTo(map);
const urlISS = `https://api.wheretheiss.at/v1/satellites/25544`;
const urlLeaflet = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
let firstTime = true;

var t = L.terminator();
t.addTo(map);


L.tileLayer(
    urlLeaflet,
    {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: config.API_TOKEN
    }
  ).addTo(map);



async function getISS() {
    const response = await fetch(urlISS);
    const data = await response.json();
    
    const { altitude, latitude, longitude, velocity, visibility } = data;
    issRadious.setLatLng([latitude, longitude]);
    issMarker.setLatLng([latitude, longitude]);
    // Establecer ubicacopn de la ISS en el mapa
    map.setView([latitude, longitude]);
    // Check if is the first load of the page
    if (firstTime) {
      map.setView([latitude, longitude], 3);
      currentVisibility = visibility;
      firstTime = false;
      if(visibility == 'daylight'){
        issMarker.setIcon(issIconDayLight);
        document.getElementById('labelDayNight').innerText = 'La ISS está a la luz del día';
      } else {
        issMarker.setIcon(issIconEclipsed);
        document.getElementById('labelDayNight').innerText = 'La ISS está a la sombra de la Tierra';
      }
    }
    //Establecer el icono de la estacion segun se dia o noche
    if(currentVisibility != visibility){
      currentVisibility = visibility;
      if(visibility == 'daylight'){
        issMarker.setIcon(issIconDayLight);
        document.getElementById('labelDayNight').innerText = 'La ISS está a la luz del día';
      } else {
        issMarker.setIcon(issIconEclipsed);
        document.getElementById('labelDayNight').innerText = 'La ISS está a la sombra de la Tierra';
      }
    }
    // Actualizar las labels con las coordenadas
    document.getElementById('labelLatitude').innerText = latitude.toFixed(6);
    document.getElementById('labelLongitude').innerText = longitude.toFixed(6);
    document.getElementById('labelAltitude').innerText = altitude.toFixed(2);
    document.getElementById('labelVelocity').innerText = velocity.toFixed(2);
}

getISS();
setInterval(getISS, 1500);