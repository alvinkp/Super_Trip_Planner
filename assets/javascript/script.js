var myPreviousResultsContainer = document.querySelector("#previousResultsContainer")
var myWeatherApiContainer = document.querySelector("#weatherSection");
var myForecastContainer = document.querySelector("#forecast");
var mySearchButton = document.querySelector(".btn");
var myCity = document.querySelector("#cityName");

// Verify localstorage exists
function doesLocalStorageExist(){
  if(localStorage.getItem("myRecentSearches") !== null){
    return true;
  } else {
    return false;
  }
}

// Create and append recent search button to myPreviousResultsContainer
function addRecentSearchButton(city, container){
  var searchButton = document.createElement("button");
  searchButton.textContent = city;
  container.appendChild(searchButton);
}

// Retrieve previous search results and display them on screen


// Store Successful Searches in localStorage
function storeSuccessfulSearch(cityName, resultsContainer) {
  var tempStorageArray = [];
  if(doesLocalStorageExist()){
    var currentLocalStorage = JSON.parse(localStorage.getItem("myRecentSearches"));
      if(currentLocalStorage.includes(cityName)){
        return;
      }
    for(var i = 0; i < currentLocalStorage.length; i++){
      tempStorageArray.push(currentLocalStorage[i]);
    }
    tempStorageArray.push(cityName);
    if(tempStorageArray.length > 5){
      tempStorageArray.shift();
    }
    for(var i = 0; i < tempStorageArray.length; i++){
      addRecentSearchButton(tempStorageArray[i], resultsContainer);
    }
    localStorage.setItem("myRecentSearches", JSON.stringify(tempStorageArray));
    return;
  }
  tempStorageArray.push(cityName);
  addRecentSearchButton(tempStorageArray[0], resultsContainer);
  localStorage.setItem("myRecentSearches", JSON.stringify(tempStorageArray));
}

// Convert Unix timestamp to month/day/year format (original idea: https://coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript)
function getUsableDate(unixtimestamp){
  var myTempTime = unixtimestamp * 1000;
  var dateObject = new Date(myTempTime);
  var convertedDate = dateObject.toLocaleString("en-US", {timeZoneName: "short"});
  var usableDate = convertedDate.split(",");
  return usableDate[0];
}

// Assign the appropriate style to UV Index
function setUVStlye(uvi, container){
  if(uvi >= 0.0 && uvi < 3.0){
    container.style.backgroundColor = 'green';
    container.style.color = 'white';
    return;
  } else if (uvi >= 3.0 && uvi < 6.0){
    container.style.backgroundColor = 'yellow';
    container.style.color = 'black';
    return;
  } else if (uvi >= 6.0 && uvi < 8.0){
    container.style.backgroundColor = 'orange';
    container.style.color = 'black';
    return;
  } else if (uvi >= 8.0 && uvi < 11.0){
    container.style.backgroundColor = 'red';
    container.style.color = 'white';
    return;
  } else {
    container.style.backgroundColor = 'purple';
    container.style.color = 'white';
  }
}


// Add supplied information to an html element
function addInfoToHTML(info, place, hasImage, alt) {
  if(hasImage){
    var myCityTitle = document.createElement("div");
    var myCityDate = document.createElement("p");
    var myCityImage = document.createElement("img");
    myCityTitle.classList.add("container", "weather-image");
    myCityDate.textContent = info;
    myCityImage.setAttribute("src", "http://openweathermap.org/img/wn/" + hasImage + "@2x.png");
    myCityImage.setAttribute("alt", alt);
    myCityTitle.appendChild(myCityDate);
    myCityTitle.appendChild(myCityImage);
    place.appendChild(myCityTitle);
    return;
  } else if(info.includes("UV")) {
    var myUVContainer = document.createElement("div");
    var myUVFillerText = document.createElement("p");
    var myIndexContainer = document.createElement("div")
    var myUVIndex = document.createElement("p");

    myUVContainer.classList.add("container");
    myUVFillerText.textContent = info.split(":")[0] + ": ";
    myUVIndex.textContent = info.split(":")[1];
    myIndexContainer.appendChild(myUVIndex);
    setUVStlye(myUVIndex.textContent, myIndexContainer);
    myIndexContainer.classList.add("UV-Index");
    myUVContainer.appendChild(myUVFillerText);
    myUVContainer.appendChild(myIndexContainer);
    place.appendChild(myUVContainer);
    return;
  }
  var myElement = document.createElement("p");
  myElement.textContent = info;
  place.appendChild(myElement);
}



// Create, populate and add Forecast Cards to HTML
function createForecastCard(date, image, temp, wind, hum, alt){
  
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
  myCardImage.setAttribute("alt", alt);
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
    console.log(data);
    var coordinates = {
      lat: data[0].lat,
      lon: data[0].lon
    }
    storeSuccessfulSearch(data[0].name, myPreviousResultsContainer);
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
    for(var i = 1; i < 6; i++){
      var myDate = getUsableDate(data.daily[i].dt);
      var myIMG = data.daily[i].weather[0].icon;
      var myTemp = "Temp: " + data.daily[i].temp.day + "\xB0F";
      var myWind = "Wind Speed " + data.daily[i].wind_speed + "MPH";
      var myHumidity = "Humidity " + data.daily[i].humidity + "%";
      var myAltText = data.daily[i].weather[0].description;
      createForecastCard(myDate, myIMG, myTemp, myWind, myHumidity, myAltText);
    }
    addInfoToHTML(myCity.value + " " + getUsableDate(data.current.dt), myWeatherApiContainer, data.current.weather[0].icon, data.current.weather[0].description);
    addInfoToHTML("Temp: " + data.current.temp + "\xB0F", myWeatherApiContainer);
    addInfoToHTML("Wind Speed: " + data.current.wind_speed + "MPH", myWeatherApiContainer);
    addInfoToHTML("Humidity: " + data.current.humidity + "%", myWeatherApiContainer);
    addInfoToHTML("UV Index:" + data.current.uvi, myWeatherApiContainer);
  })
}



// If user enters input and presses "ENTER" call the click function on mySearchButton
myCity.addEventListener("keypress", function (event) {

  if (event.key === "Enter") {
    event.preventDefault();
    mySearchButton.click();
  }
})

// If Local storage exists, populate the previousResultsContainer
if(doesLocalStorageExist){

}


// If user clicks Search button then execute callAPI()
mySearchButton.addEventListener('click', callAPI);