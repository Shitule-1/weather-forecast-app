// getting Elements by id name
const button = document.getElementById("searchButton")
const input = document.getElementById("cityInput")
const next_day = document.getAnimations("next_day")
const city = document.getElementById("city")
const time = document.getElementById("time")
const temp = document.getElementById("temp")
const humidity = document.getElementById("humidity")
const loading_Para = document.getElementById("wind")
const h4 = document.getElementById("h4")
const display_data = document.getElementById("display_data")
// first when user open the page this message will be see on screen before fetching data
loading_Para.innerHTML = `<h1 style="color:blue; font-size:21px">Enter city Name and click on search Button or Your Location Button<h1>`
// adding evenetlistener what happern after cliking search button
button.addEventListener("click", getData)
async function getData() {
    const value = (input.value).toUpperCase()
    loading_Para.innerHTML = `<h1 style="color:blue; font-size:50px">Loading ${input.value} Weather Data.....<h1>`

    try {
        const result = await getInfo(value)
        console.log(result)
        city.innerText = `${result.location.name},${result.location.region},${result.location.country}`
        city.classList.add("city")
        time.innerText = result.location.localtime
        time.classList.add("common_class")
        temp.innerText = `Temprature: ${result.current.temp_c} °C`;
        temp.classList.add("common_class")
        humidity.innerText = `Humidity: ${result.current.humidity}`;
        humidity.classList.add("common_class")
        wind.innerText = `Wind speed: ${result.current.wind_kph} kph`;
        wind.classList.add("common_class")


        // Display next 5 days forecast we created funtion outside this funtion and here we calling that funtion 
        displayNext5Days(result.forecast.forecastday);

        updateCityDropdown(value)
    }
    catch { // if data not fecthed then this error message showing 
        confirm("You Entered city data not found (check city Name )")
        loading_Para.innerHTML = `<h1 style="color:orangered; font-size:40px"> Check you Entered City Name Again <h1>`

    }

}
// creating a async funtionn for real time data from api this link contain api also
async function getInfo(cityName) {
    return (await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e4b68068fdd34e0789e51102241506&q=${cityName}&days=5&aqi=yes&alerts=yes`)).json()
}


function displayNext5Days(forecastDays) {
    const nextDayDiv = document.getElementById('div_inside_next_day_div');
    nextDayDiv.innerHTML = ''; // Clear existing content

    forecastDays.forEach((day, index) => {
        if (index < 5) { // Ensures we only get the next 5 days
            const dayDiv = document.createElement('div');
            dayDiv.innerHTML = `
                <h4>Day ${index + 1}</h4>
             <p> ${getWeatherIcon(day.day.avgtemp_c)}</p> 
              <p>${day.date}</p>
             <p>Temp: ${day.day.avgtemp_c} °C</p>
             <p>Wind: ${day.day.maxwind_kph} kph</p>
            `;
            dayDiv.classList.add("next_5_day_div")
            nextDayDiv.appendChild(dayDiv);
        }
        // funtion for display icon according to temprature
        function getWeatherIcon(temp) {
            if (temp < 0) {
                return `<img src="./weather_icons/snow.png" alt="Snow icon" class="weather-icon" />`;
            } else if (temp >= 0 && temp < 15) {
                return `<img src="./weather_icons/cloudy.png" alt="Cloudy icon" class="weather-icon" />`;
            } else if (temp >= 15 && temp < 25) {
                return `<img src="./weather_icons/partly_cloudy.png" alt="Partly cloudy icon" class="weather-icon" />`;
            } else if (temp >= 25 && temp < 35) {
                return `<img src="./weather_icons/sunny.png" alt="Sunny icon" class="weather-icon" />`;
            } else {
                return `<img src="./weather_icons/hot.png" alt="Hot icon" class="weather-icon" />`;
            }
        }

    });
}
// funtion for upadte city in dropdown as a recent searched history 
function updateCityDropdown(newCity) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(newCity)) {
        cities.push(newCity);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
    populateCityDropdown();
}

function populateCityDropdown() {
    const cityDropdown = document.getElementById('city-dropdown');
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cityDropdown.innerHTML = '<option value="">Recently Searched</option>'; // Clear existing options
    if (cities.length > 0) {
        cityDropdown.style.display = 'inline-block'; // Show dropdown if there are cities
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.text = city;
            cityDropdown.appendChild(option);

            option.addEventListener("click", () => {
                const input = document.getElementById('cityInput');
                input.value = cities;

            });
        });

    } else {
        cityDropdown.style.display = 'none'; // Hide dropdown if no cities
    }

    cityDropdown.addEventListener('change', () => {
        const selectedCity = cityDropdown.value;
        if (selectedCity) {
            document.getElementById('input').value = selectedCity;
            getData(selectedCity);
        }
    });
}
// Populate the dropdown on page load
window.onload = populateCityDropdown

// this is your location button session what action performing for that this below code
async function gotLocation(position) {
    console.log(position); // This returns latitude and longitude on console 
    const result = await getInfoByLocation(position.coords.latitude, position.coords.longitude);
    const input = document.getElementById("cityInput");
    input.value = result.location.name;
    button.click()

}


function failedToGet() {
    alert("There was some issue");
}

const locationButton = document.getElementById("locationButton");
locationButton.addEventListener("click", () => {
    loading_Para.innerHTML = `<h1 style="color:blue; font-size:50px">Loading Data Please Wait..........<h1>`
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
});

async function getInfoByLocation(lat, long) {
    return (await fetch(`http://api.weatherapi.com/v1/forecast.json?key=676e6ca2e91a4460bb3161428242506&q=${lat},${long}&days=5&aqi=yes&alerts=yes`)).json();
}