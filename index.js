import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js' 
const appSettings = {
    databaseURL: 'https://iot-attatchment-project-default-rtdb.europe-west1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const conditionsRef = ref(database, 'conditions')
const optimalConditionsRef = ref(database, 'optimalConditions')

// adding data
// push(optimalConditionsRef, { humidity: 68, temperature: 67})

const currTempInput = document.getElementById("current_temp")
const currHumidityInput = document.getElementById("current_humidity")
const optimalTempInput = document.getElementById("optimum-temp")
const optimalHumidityInput = document.getElementById("optimum-humidity")
let optimalTemperature
let optimalHumidity
onValue(optimalConditionsRef, (snapshot) => {
    let optimalConditions = Object.values(snapshot.val());
    let i = optimalConditions.length - 1;
    optimalTemperature = optimalConditions[i].temperature;
    optimalHumidity = optimalConditions[i].humidity;
    optimalHumidityInput.value = `${optimalHumidity}%`
    optimalTempInput.value = `${optimalTemperature}°C` 
    
})

onValue(conditionsRef, (snapshot) => {
    let currConditions = Object.values(snapshot.val());
    let i = currConditions.length - 1;
    let humidity = currConditions[i].humidity
    let temperature = currConditions[i].temperature
    currHumidityInput.value = `${humidity}%`
    currTempInput.value = `${temperature}°C` 
    if (temperature > optimalTemperature && humidity > optimalHumidity) {
        currTempInput.classList.add("red")
        currHumidityInput.classList.add("red") 
    }else if (humidity > optimalHumidity) {
        currHumidityInput.classList.add("red") 
    } else if (temperature > optimalTemperature) {
        currTempInput.classList.add("red")
    }
})


// At the end of your index.js file
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('form').addEventListener('submit', setOptimalConditions);
});

function setOptimalConditions(event) {
    // event.preventDefault(); 
        const optimumTemp = parseFloat(optimalTempInput.value);
        const optimumHumidity = parseFloat(optimalHumidityInput.value);

        if (optimumHumidity && optimumTemp){
            push(optimalConditionsRef, { temperature: optimumTemp, humidity: optimumHumidity });
        }else {
            alert("The values must be numerical")
        }
    
    
}
