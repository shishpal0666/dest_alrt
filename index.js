const address = document.querySelector("#address");
const results = document.querySelector("#results");
const alrtDist = document.querySelector("#distance");

let currLatitude;
let currLongitude;
let destLat;
let destLon;
let a;
var audio=new Audio("../sounds/DestinationAlert.mp3");

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    currLatitude = position.coords.latitude;
                    currLongitude = position.coords.longitude;
                    resolve({ latitude: currLatitude, longitude: currLongitude });
                    let dist=calculateDistance(destLat, destLon, currLatitude, currLongitude);
                    console.log(currLatitude,currLongitude);
                    if(dist<=distanceAlrt){
                        console.log("Reached!");
                        audio.play();
                        clearInterval(a);
                    }
                },
                error => {
                    console.error("Error retrieving geolocation:", error);
                    reject(error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            reject("Geolocation not supported");
        }
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    console.log(d);
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function findDistance(){
    a=setInterval(getCurrentLocation,5000);
}

function stopsound(){
    audio.pause();
}
let distanceAlrt;
async function findAddress() {
    distanceAlrt=alrtDist.value;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${address.value}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            destLat = data[0].lat;
            destLon = data[0].lon;
        } else {
            alert("location not found");
        }
        const position = { latitude: data[0].lat, longitude: data[0].lon };
        return position;
    } catch (error) {
        console.error("Error fetching address data:", error);
    }
}
getCurrentLocation();