const button=document.getElementById("searchButton")
const input=document.getElementById("cityInput")

const city=document.getElementById("city")
const time=document.getElementById("time")
const temp=document.getElementById("temp")

button.addEventListener("click" ,getData)

 async function getData(){
    const value=input.value
   const result= await getInfo(value)
   city.innerText=`${result.location.name},${result.location.region},${result.location.country}`
   time.innerText=result.location.localtime  
   temp.innerText=result.current.temp_c;
}


async function getInfo(cityName){
    return (await fetch(`http://api.weatherapi.com/v1/current.json?key=e4b68068fdd34e0789e51102241506&q=${cityName}&aqi=yes`)).json()
  
}
