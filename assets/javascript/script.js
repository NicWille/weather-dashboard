let searchButtonEl = document.querySelector('#search-button')
let buttonListEl = document.querySelector('#city-list')
let currentWeatherEl = document.querySelector('#current-weather-box')
let futureWeatherEl = document.querySelector('#future-weather-box')
let cardListEl = document.querySelector('#card-list')

let today = dayjs().format('MMM-D-YYYY')

let api = "483d25ea4e277099d97c202ddd3e9d1e"
let city = ''
let coordinates = ''
let cityName = ''
let allButtonsEl = ''

function useFetch(geoCoordinates) {

    city = ''
    coordinates = ''
    fetch(geoCoordinates)
    .then((resp) => {

      if (!resp.ok) throw new Error(resp.statusText);

      return resp.json();
    })
    .then((data) => {

      createStoredButton(data)
      lat = data[0].lat
      lon = data[0].lon
      let weatherInfo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${api}`
      fetch(weatherInfo).then((res) => {

          return res.json()
      })
      .then((data) => {

        showCurrentWeather(data)
      })
    })
    .catch(console.err);
}

function handleSearchButton() {

    //prevents auto refresh
    // e.preventDefault()
    city = searchButtonEl.previousElementSibling.value
    coordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api}`
    useFetch(coordinates)  
}

function handleStoredButton(e) {

    city = e.target.innerText
    coordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api}`
    useFetch(coordinates) 
}

function createStoredButton(data) {

  cityName = data[0].name
  if (!localStorage.getItem(cityName)) {

    localStorage.setItem(cityName, cityName)
    allButtonsEl = allButtonsEl + `<button class="aside-element pure-button pure-button-secondary" type="button">${cityName}</button>`
    buttonListEl.innerHTML = allButtonsEl
  }
}

function populateButtonList() {

  let localStorageCity =  ''
  for (var i = 0; i < localStorage.length; i++){

    localStorageCity = localStorage.getItem(localStorage.key(i))
    allButtonsEl = allButtonsEl + `<button class="aside-element pure-button pure-button-secondary" type="button">${localStorageCity}</button>`
    buttonListEl.innerHTML = allButtonsEl
  } 
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

    // move icon img down a little 
    let currentWeather = 
    `<div class="current-weather-box-style">
    <h2>${cityName} (${today}) <img src="https://openweathermap.org/img/wn/${symbol}.png"/></h2>
    <p>Temp:  ${temp}??F</p>
    <p>Wind:  ${wind} MPH</p>
    <p>Humidity:  ${hum}%</p>
    <p>UV index:  <span class="uvi" id="uvi">${uv}</span></p></div>`;
    currentWeatherEl.innerHTML = currentWeather
    colorUvi(uv)
    showFutureWeather(data)
}

function colorUvi(uv) {

  let uviSpanEl = document.querySelector("#uvi")
  uvi.classList.remove()
    if (uv > 7) {
      uviSpanEl.classList.add("red")
    } else if (uv > 5) {
      uviSpanEl.classList.add("orange")
    } else if (uv > 2) {
      uviSpanEl.classList.add("yellow")
    } else {
      uviSpanEl.classList.add("green")
    }
}

function showFutureWeather(data) {

    futureWeatherEl.classList.remove("hidden")
    let cards = ''
    for (let i=0; i<5; i++) {

      let day = dayjs().add(i + 1, 'day').format('MMM-D-YYYY')
      let symbol = data.daily[i].weather[0].icon
      let temp = data.daily[i].temp.day
      let wind = data.daily[i].wind_speed
      let hum = data.daily[i].humidity
      let card = 
      `<div class="pure-u-3-5 pure-u-lg-3-24 glass">
      <h3>${day}</h3>
      <img src="https://openweathermap.org/img/wn/${symbol}.png"/>
      <p>Temp:  ${temp}??F</p>
      <p>Wind:  ${wind} MPH</p>
      <p>Humidity:  ${hum}%</p></div>`
      cards = cards + card
    } 
    cardListEl.innerHTML = cards
}

populateButtonList()
searchButtonEl.addEventListener("click", handleSearchButton)
buttonListEl.addEventListener("click", handleStoredButton)