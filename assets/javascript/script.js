var myWeatherApiContainer = document.querySelector("#weatherSection");
var mySearchButton = document.querySelector(".btn");
var myCity = document.querySelector("#cityName");

function buttonPressed(){
    console.log("Pressed!");
    callAPI();
}


function callAPI(){
fetch("https://api.openweathermap.org/data/2.5/weather?q=" + myCity.value + "&units=imperial&appid=e1739b9a89959eb08d85a9a92023d8d4", {
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var myAPIResult = document.createElement("p");
    myAPIResult.textContent = data.main.temp;
    myWeatherApiContainer.appendChild(myAPIResult);
});
}

// If user enters input and presses "ENTER" call the click function on mySearchButton
myCity.addEventListener("keypress", function(event) {
  
    if (event.key === "Enter") {
      event.preventDefault();
      mySearchButton.click();
    }
})

mySearchButton.addEventListener('click', buttonPressed);