const button=document.getElementById("searchButton")
const input=document.getElementById("cityInput")

const city=document.getElementById("city")
const time=document.getElementById("time")
const temp=document.getElementById("temp")
const humidity=document.getElementById("humidity")
const wind=document.getElementById("wind")
const h4=document.getElementById("h4")

button.addEventListener("click" ,getData)

 async function getData(){
    const value=(input.value).toUpperCase()
   const result= await getInfo(value)
   console.log(result)
   city.innerText=`${result.location.name},${result.location.region},${result.location.country}`
   city.classList.add("city")
   time.innerText=result.location.localtime  
   time.classList.add("common_class")
   temp.innerText=`Temprature: ${result.current.temp_c} c`;
   temp.classList.add("common_class")
   humidity.innerText=`Humidity: ${result.current.humidity}`;
   humidity.classList.add("common_class")
   wind.innerText=`Wind speed: ${result.current.wind_kph} kph`;
   wind.classList.add("common_class")


   // Display next 5 days forecast we created funtion outside this funtion and here we calling that funtion 
    displayNext5Days(result.forecast.forecastday);

    updateCityDropdown(value)
}


async function getInfo(cityName){
    return (await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e4b68068fdd34e0789e51102241506&q=${cityName}&days=5&aqi=yes&alerts=yes`)).json()
      
}


function displayNext5Days(forecastDays) {
    const nextDayDiv = document.getElementById('div_inside_next_day_div');
    nextDayDiv.innerHTML = ''; // Clear existing content

    forecastDays.forEach((day, index) => {
        if(index < 5) { // Ensures we only get the next 5 days
            const dayDiv = document.createElement('div');
            dayDiv.innerHTML = `
                <h4>Day ${index + 1}</h4>
                <p>Date: ${day.date}</p>
                <p>Temp: ${day.day.avgtemp_c} °C</p>
                <p>Wind: ${day.day.maxwind_kph} kph</p>
            `;
            nextDayDiv.appendChild(dayDiv);
        }
    });
}

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
            option.addEventListener("click",()=>{ 
                const body=document.querySelector("body")
                body.style.backgroundColor="red"
            })
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
    alert(`Your current Location is   ${input.value}.To see  forecast of your location click search button`)
    // Display location name in the input field
}


function failedToGet() {
    alert("There was some issue");
}

const locationButton = document.getElementById("locationButton");
locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
});

async function getInfoByLocation(lat, long) {
    return (await fetch(`http://api.weatherapi.com/v1/forecast.json?key=e4b68068fdd34e0789e51102241506&q=${lat},${long}&days=5&aqi=yes&alerts=yes`)).json();
}
