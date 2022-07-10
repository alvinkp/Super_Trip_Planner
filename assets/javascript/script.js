var myWeatherApiContainer = document.querySelector("#weatherSection");
var mySearchButton = document.querySelector(".btn");
var myCity = document.querySelector("#cityName");

// Convert Unix timestamp to month/day/year format (original idea: https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript)
function getUsableDate(unixtimestamp){
  var myTempTime = unixtimestamp * 1000;
  var dateObject = new Date(myTempTime);
  var convertedDate = dateObject.toLocaleString("en-US", {timeZoneName: "short"});
  var usableDate = convertedDate.split(",");
  return usableDate[0];
}

// Add supplied information to an html element
function addInfoToHTML(info, place) {
  var myElement = document.createElement("p");
  myElement.textContent = info;
  place.appendChild(myElement);
}

// Get the supplied city's coordinates and then get the current weather 
function callAPI() {
  fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + myCity.value + "&limit=1&appid=e1739b9a89959eb08d85a9a92023d8d4", {})
  // Take response from fetch and parse to JSON
  .then(function (response) {
    return response.json();
  })
  // Take parsed response in as data and extract lat and lon, store it and return coordinates object
  .then(function (data) {
    var coordinates = {
      lat: data[0].lat,
      lon: data[0].lon
    }
    return coordinates;
  })
  // get coordinates from previous .then function and pass it into this new fetch request then create our weather information and add it to our html
  .then(function (getWeather) {
    return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + getWeather.lat + "&lon=" + getWeather.lon + "&units=Imperial&appid=e1739b9a89959eb08d85a9a92023d8d4", {})
  })
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    console.log(data);
    addInfoToHTML(myCity.value + " " + getUsableDate(data.current.dt), myWeatherApiContainer);
    addInfoToHTML("Temp: " + data.current.temp + "\xB0F", myWeatherApiContainer);
    addInfoToHTML("Wind Speed: " + data.current.wind_speed + "MPH", myWeatherApiContainer);
    addInfoToHTML("Humidity: " + data.current.humidity, myWeatherApiContainer);
    addInfoToHTML("UV Index: " + data.current.uvi, myWeatherApiContainer);
  })
}


// If user enters input and presses "ENTER" call the click function on mySearchButton
myCity.addEventListener("keypress", function (event) {

  if (event.key === "Enter") {
    event.preventDefault();
    mySearchButton.click();
  }
})

// If user clicks Search button then execute callAPI()
mySearchButton.addEventListener('click', callAPI);