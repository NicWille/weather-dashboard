let searchButtonEl = document.querySelector('#search-button')
let buttonListEl = document.querySelector('#city-list')
let currentWeatherEl = document.querySelector('#current-weather-box')
let futureWeatherEl = document.querySelector('#future-weather-box')


let today = dayjs().format('MMM-D-YYYY')

let api = "483d25ea4e277099d97c202ddd3e9d1e"
let city = ''
let coordinates = ''
let cityName = ''
// let cityArr = []

function useFetch(geoCoordinates) {

    city = ''
    coordinates = ''
    fetch(geoCoordinates)
    .then((resp) => {
      if (!resp.ok) throw new Error(resp.statusText);
      return resp.json();
    })
    .then((data) => {
      console.log(data)

    //   only if that city button dos not exist yet 
        createStoredButton(data)

      lat = data[0].lat
      lon = data[0].lon
      let weatherInfo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${api}`
      fetch(weatherInfo).then((res) => {
          return res.json()
      })
      .then((data) => {
          console.log(data)
        showCurrentWeather(data)
      })
    })
    .catch(console.err);
    // alert user
}

function handleSearchButton() {

    city = searchButtonEl.previousElementSibling.value
    coordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api}`
    useFetch(coordinates)  
}

function handleStoredButton(e) {

    city = e.target.innerText
    coordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api}`
    useFetch(coordinates) 
}

function createStoredButton(data) {

    // if city already exist in list remove it and create the new one 
    //save to local storage ?
    cityName = data[0].name
    if (localStorage.getItem(cityName) == cityName) {console.log("true")}
    localStorage.setItem(cityName, cityName)
    let storedBtn = 
    `<button class="aside-element pure-button pure-button-secondary" type="button">
    ${cityName}
    </button>`
    buttonListEl.innerHTML = storedBtn
}

function showCurrentWeather(data) {

    while (currentWeatherEl.firstChild) {
        currentWeatherEl.removeChild(currentWeatherEl.lastChild);
      }

    let symbol = data.current.weather[0].icon
    let temp = data.current.temp
    let wind = data.current.wind_speed
    let hum = data.current.humidity
    let uv = data.current.uvi

    let currentWeather = 
    `<div class="current-weather-box-style">
    <h2>${cityName} (${today}) <img src="http://openweathermap.org/img/wn/${symbol}.png"/></h2>
    <p>Temp:  ${temp}°F</p>
    <p>Wind:  ${wind} MPH</p>
    <p>Humidity:  ${hum}%</p>
    <p>UV index:  ${uv}</p></div>`;
    // color uv element by adding class
    currentWeatherEl.innerHTML = currentWeather
    showFutureWeather()
}

function showFutureWeather() {
    futureWeatherEl.classList.remove("hidden")
}

searchButtonEl.addEventListener("click", handleSearchButton)
buttonListEl.addEventListener("click", handleStoredButton)

