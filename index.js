import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js' 
const appSettings = {
    // databaseURL: 'https://iot-attatchment-project-default-rtdb.europe-west1.firebasedatabase.app/'
    databaseURL: 'https://iot-database-964e1-default-rtdb.firebaseio.com/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const conditionsRef = ref(database, 'conditions')
const optimalConditionsRef = ref(database, 'optimalConditions')

// adding data
// push(optimalConditionsRef, { humidity: {min: 65, max: 72.5}, temperature: {min: 26.3, max: 29.7}})

const currTempInput = document.getElementById("current_temp")
const currHumidityInput = document.getElementById("current_humidity")
// const optimalTempInput = document.getElementById("optimum-temp")
// const optimalHumidityInput = document.getElementById("optimum-humidity")
const minTemp = document.getElementById("min-temp")
const maxTemp = document.getElementById("max-temp")
const minHumidity = document.getElementById("min-humidity")
const maxHumidity = document.getElementById("max-humidity")
currHumidityInput.classList.remove('red')
currTempInput.classList.remove('red')
let optimalMinTemp
let optimalMaxTemp
let optimalMinHumidity
let optimalMaxHumidity
onValue(optimalConditionsRef, (snapshot) => {
    let optimalConditions = Object.values(snapshot.val());
    let i = optimalConditions.length - 1;
    optimalMinTemp = optimalConditions[i].temperature.min
    optimalMaxTemp = optimalConditions[i].temperature.max
    optimalMinHumidity = optimalConditions[i].humidity.min
    optimalMaxHumidity = optimalConditions[i].humidity.max

    minTemp.value = optimalMinTemp
    maxTemp.value = optimalMaxTemp
    minHumidity.value = optimalMinHumidity
    maxHumidity.value = optimalMaxHumidity
    
})

onValue(conditionsRef, (snapshot) => {
    let currConditions = Object.values(snapshot.val());
    let i = currConditions.length - 1;
    let humidity = currConditions[0]
    let temperature = currConditions[1]
    currHumidityInput.value = `${humidity}%`
    currTempInput.value = `${temperature}°C` 
    console.log(optimalMinTemp && humidity > optimalMaxHumidity || humidity < optimalMinHumidity)
    if (((temperature > optimalMaxTemp) || (temperature < optimalMinTemp)) && ((humidity > optimalMaxHumidity) || (humidity < optimalMinHumidity))) {
        currTempInput.classList.add("red")    
        currHumidityInput.classList.add("red") 
        fetch('https://4c7e-154-159-252-196.ngrok-free.app/call', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: "Dear owner, the humidity and temperature conditions are above optimum Dear owner, the humidity and temperature conditions are above optimum"}),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log(response.json());
            })
        
    }else if ((humidity > optimalMaxHumidity) || (humidity < optimalMinHumidity)) {
        currHumidityInput.classList.add("red") 
        currTempInput.classList.remove('red')
        fetch('https://4c7e-154-159-252-196.ngrok-free.app/call', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: "Dear owner, the humitity conditions are above optimum Dear owner, the humidity conditions are above optimum"}),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log(response.json());
            })


    } else if ((temperature > optimalMaxTemp) || (temperature < optimalMinTemp)) {
        currTempInput.classList.add("red")
        currHumidityInput.classList.remove('red')
        fetch('https://4c7e-154-159-252-196.ngrok-free.app/call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: "Dear owner, the temperature conditions are above optimum Dear owner, the temperature conditions are above optimum"}),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response.json());
        })
    }else {
        currHumidityInput.classList.remove('red')
        currTempInput.classList.remove('red')
    }
        

})


document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('form').addEventListener('submit', setOptimalConditions);
});

function setOptimalConditions(event) {
    // event.preventDefault(); 
        const optimumTempMin = parseFloat(minTemp.value);
        const optimumTempMax = parseFloat(maxTemp.value);
        const optimumHumidityMin = parseFloat(minHumidity.value);
        const optimumHumidityMax = parseFloat(maxHumidity.value);

        if (optimumTempMin && optimumTempMax && optimumHumidityMin && optimumHumidityMax) {
            push(optimalConditionsRef, { temperature: { min: optimumTempMin, max: optimumTempMax}, humidity: { min: optimumHumidityMin, max: optimumHumidityMax} });
        }else {
            alert("The values must be numerical")
        }
    
    
}
