let searchButtonEl = document.querySelector('#search-button')
let buttonListEl = document.querySelector('#city-list')
let currentWeatherEl = document.querySelector('#current-weather-box')
let futureWeatherEl = document.querySelector('#future-weather-box')


let today = dayjs().format('MMM-D-YYYY')

let api = "483d25ea4e277099d97c202ddd3e9d1e"
let city = ''
let coordinates = ''
let cityName = ''


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

    cityName = data[0].name
    let cityBtn = document.createElement("button")
    cityBtn.textContent = cityName
    cityBtn.classList.add('aside-element', 'pure-button', 'pure-button-secondary')
    cityBtn.setAttribute("type", "button")
    buttonListEl.appendChild(cityBtn)
    //save to local storage ?
}

function showCurrentWeather(data) {

    currentWeatherEl.classList.remove("hidden")
    while (currentWeatherEl.firstChild) {
        currentWeatherEl.removeChild(currentWeatherEl.lastChild);
      }

    let symbol = data.current.weather[0].icon
    let imageEl = document.createElement("img")
    imageEl.setAttribute("src", `http://openweathermap.org/img/wn/${symbol}.png`)
    let headingStr = `${cityName} (${today})`
    let headingEl = document.createElement("h2")
    headingEl.textContent = headingStr

    let temp = data.current.temp
    let wind = data.current.wind_speed
    let hum = data.current.humidity
    let uv = data.current.uvi

    let cardEl = document.createElement("div")
    let tempEl = document.createElement("p")
    tempEl.textContent = `Temp: ${temp}°F`
    let windEl = document.createElement("p")
    windEl.textContent = `Wind: ${wind} MPH`
    let humEl = document.createElement("p")
    humEl.textContent = `Humidity: ${hum}%`
    let uvEl = document.createElement("p")
    uvEl.textContent = `UV Index: ${uv}`
    //color element above
    cardEl.appendChild(tempEl)
    cardEl.appendChild(windEl)
    cardEl.appendChild(humEl)
    cardEl.appendChild(uvEl)

    currentWeatherEl.appendChild(headingEl)
    currentWeatherEl.appendChild(imageEl)
    currentWeatherEl.appendChild(cardEl)


    showFutureWeather()

}

function showFutureWeather() {
    futureWeatherEl.classList.remove("hidden")
}

searchButtonEl.addEventListener("click", handleSearchButton)
buttonListEl.addEventListener("click", handleStoredButton)

