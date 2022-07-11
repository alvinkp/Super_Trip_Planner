var myWeatherApiContainer = document.querySelector("#weatherSection");
var myForecastContainer = document.querySelector("#forecast");
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
function addInfoToHTML(info, place, hasImage) {
  if(hasImage){
    var myCityTitle = document.createElement("div");
    var myCityDate = document.createElement("p");
    var myCityImage = document.createElement("img");
    myCityTitle.classList.add("container");
    myCityDate.textContent = info;
    myCityImage.setAttribute("src", "http://openweathermap.org/img/wn/" + hasImage + "@2x.png");
    myCityTitle.appendChild(myCityDate);
    myCityTitle.appendChild(myCityImage);
    place.appendChild(myCityTitle);
    return;
  }
  var myElement = document.createElement("p");
  myElement.textContent = info;
  place.appendChild(myElement);
}



// Create, populate and add Forecast Cards to HTML
function createForecastCard(date, image, temp, wind, hum){
  
  // Card Element variables
  var myCard = document.createElement("div");
  var myCardBody = document.createElement("div");
  var myCardTitle = document.createElement("h5");
  var myCardImage = document.createElement("img");
  var myCardTemp = document.createElement("p");
  var myCardWind = document.createElement("p");
  var myCardHum = document.createElement("p");

  // Add necessary Bootstrap classes to elements
  myCard.classList.add("card", "text-white", "bg-primary", "mb-3");
  myCardBody.classList.add("card-body");
  myCardTitle.classList.add("card-title");

  // Add information to Card Header
  myCardTitle.textContent = date;
  myCardBody.appendChild(myCardTitle);

  // Add image to Card Title
  myCardImage.setAttribute("src", "http://openweathermap.org/img/wn/" + image + "@2x.png");
  myCardBody.appendChild(myCardImage);
  
  // Add rest of info to Card
  myCardTemp.textContent = temp;
  myCardBody.appendChild(myCardTemp);
  myCardWind.textContent = wind;
  myCardBody.appendChild(myCardWind);
  myCardHum.textContent = hum;
  myCardBody.appendChild(myCardHum);

  // Add to the myForecastContainer
  myCard.appendChild(myCardTitle);
  myCard.appendChild(myCardBody);
  myForecastContainer.appendChild(myCard);
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
  // Get coordinates from previous .then function and pass it into this new fetch request then create our weather information and add it to our html
  .then(function (getWeather) {
    return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + getWeather.lat + "&lon=" + getWeather.lon + "&units=Imperial&appid=e1739b9a89959eb08d85a9a92023d8d4", {})
  })
  // Take response from fetch and parse to JSON
  .then(function (response) {
    return response.json()
  })
  // Take weather data and populate HTML with information
  .then(function (data) {
    console.log(data);
    for(var i = 0; i < 5; i++){
      var myDate = getUsableDate(data.daily[i].dt);
      var myIMG = data.daily[i].weather[0].icon;
      var myTemp = data.daily[i].temp.day + "\xB0F";
      var myWind = data.daily[i].wind_speed + "MPH";
      var myHumidity = data.daily[i].humidity + " %";
      createForecastCard(myDate, myIMG, myTemp, myWind, myHumidity);
    }
    addInfoToHTML(myCity.value + " " + getUsableDate(data.current.dt), myWeatherApiContainer, data.current.weather[0].icon);
    addInfoToHTML("Temp: " + data.current.temp + "\xB0F", myWeatherApiContainer);
    addInfoToHTML("Wind Speed: " + data.current.wind_speed + "MPH", myWeatherApiContainer);
    addInfoToHTML("Humidity: " + data.current.humidity + " %", myWeatherApiContainer);
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