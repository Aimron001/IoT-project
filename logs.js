import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js' 
const appSettings = {
    databaseURL: 'https://iot-database-964e1-default-rtdb.firebaseio.com/'
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const ctx = document.getElementById('chartContainer').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], 
    datasets: [
      {
        label: 'Humidity',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)', 
        borderWidth: 1
      },
      {
        label: 'Temperature',
        data: [], 
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  },
  
});

const timestamp = new Date(Date.now()) ; 
function updateChartData(humidityData, temperatureData) {
    if (humidityData.length > 0) {
        timestamp.setTime(timestamp.getTime() - humidityData.length * 60 * 1000);
        
        for (let i = 0; i < humidityData.length; i++) {
            timestamp.setTime(timestamp.getTime() + 1 * 60 * 1000);
      const hours = timestamp.getHours().toString().padStart(2, '0'); 
      const minutes = (timestamp.getMinutes()).toString().padStart(2, '0')
      const formattedTime = `${hours}:${minutes}`;
          chart.data.labels.push(formattedTime); 
          chart.data.datasets[0].data.push(humidityData[i]);
          chart.data.datasets[1].data.push(temperatureData);
        }
      }
  
  chart.update(); 
}

const conditionsRef = ref(database, 'conditions');

onValue(conditionsRef, (snapshot) => {
    let currConditions = Object.values(snapshot.val());
    let i = Object.values(currConditions[0]).length - 1

    let humidityValue = Object.values(currConditions[0]).slice(i - 100, i)
    let temperatureValue = Object.values(currConditions[1]).slice(i - 100, i)
    console.log("hum:",humidityValue);
      console.log("tmp:",temperatureValue);
      updateChartData(humidityValue, temperatureValue)

})
