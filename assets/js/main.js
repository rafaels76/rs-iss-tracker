var map = L.map("map").setView([0, 09], 2);
var currentVisibility = '';
const issIconDayLight = L.icon({
    iconUrl: "assets/img/iss.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });
const issIconEclipsed = L.icon({
    iconUrl: "assets/img/iss-e.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });
let r = 50;
const circle = L.circleMarker([0, 0], { radius: r }).addTo(map);
const marker = L.marker([0, 0], { icon: issIconDayLight }).addTo(map);
const url = `https://api.wheretheiss.at/v1/satellites/25544`;
let firstTime = true;

var t = L.terminator();
t.addTo(map);


L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "pk.eyJ1IjoicmFmYWVsczc2IiwiYSI6ImNrc3FyMzQ2ajBmb2Myb3FrMzV1YjhpdDEifQ.Iy0ikuINGfu5dStC-nwIow"
    }
  ).addTo(map);



async function getISS() {
    const response = await fetch(url);
    const data = await response.json();
    //console.log(data);
    const { altitude, latitude, longitude, velocity, visibility } = data;
    circle.setLatLng([latitude, longitude]);
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude]); //
    if(currentVisibility != visibility){
      currentVisibility = visibility;
      if(visibility == 'daylight'){
        marker.setIcon(issIconDayLight);
      } else {
        marker.setIcon(issIconEclipsed);
      }
    }
    document.getElementById('labelLatitude').innerText = latitude;
    document.getElementById('labelLongitude').innerText = longitude
    if (firstTime) {
      map.setView([latitude, longitude], 4);
      firstTime = false;
    }
}

getISS();
setInterval(getISS, 1500);