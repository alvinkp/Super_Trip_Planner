var myWeatherApiContainer = document.querySelector("#weatherSection");

fetch("http://api.openweathermap.org/data/2.5/forecast?q=Uniondale&appid=e1739b9a89959eb08d85a9a92023d8d4", {
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    for(var i = 0; i < data.list.length; i++){
    var myAPIResult = document.createElement("p");
    myAPIResult.textContent = data.list[i].weather[0].description;
    myWeatherApiContainer.appendChild(myAPIResult);
}
  });
