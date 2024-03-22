// import Chart from 'chart.js/auto';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js' 
const appSettings = {
    // databaseURL: 'https://iot-attatchment-project-default-rtdb.europe-west1.firebasedatabase.app/'
    databaseURL: 'https://iot-database-964e1-default-rtdb.firebaseio.com/'
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

// Chart configuration variables
const ctx = document.getElementById('chartContainer').getContext('2d');
const chart = new Chart(ctx, {
  // Chart type (e.g., 'line')
  type: 'line',
  data: {
    labels: [], // Array to store timestamps
    datasets: [
      {
        label: 'Humidity',
        data: [], // Array to store humidity values
        borderColor: 'rgba(255, 99, 132, 1)', // Customize color
        borderWidth: 1
      },
      {
        label: 'Temperature',
        data: [], // Array to store temperature values
        borderColor: 'rgba(54, 162, 235, 1)', // Customize color
        borderWidth: 1
      }
    ]
  },
  options: {
    // Add options like scales, legend, etc. (optional)
  }
});

// Function to update chart data
const timestamp = new Date(Date.now()) ;  // Create a Date object
function updateChartData(humidityData, temperatureData) {
    if (humidityData.length > 0) {
        timestamp.setTime(timestamp.getTime() - humidityData.length * 60 * 1000);
        
        for (let i = 0; i < humidityData.length; i++) {
            timestamp.setTime(timestamp.getTime() + 1 * 60 * 1000);
      const hours = timestamp.getHours().toString().padStart(2, '0'); // Pad hours with leading zero
      const minutes = (timestamp.getMinutes()).toString().padStart(2, '0')// Pad minutes with leading zero
      const formattedTime = `${hours}:${minutes}`;
          chart.data.labels.push(formattedTime); // Add current timestamp as label (optional)
          chart.data.datasets[0].data.push(humidityData[i]);
          chart.data.datasets[1].data.push(temperatureData);
        }
      }
  
  chart.update(); // Update chart display
}

// Listen for changes in Firebase data
const conditionsRef = ref(database, 'conditions');

onValue(conditionsRef, (snapshot) => {
    let currConditions = Object.values(snapshot.val());
    // console.log(currConditions);
    let i = Object.values(currConditions[0]).length - 1

    let humidityValue = Object.values(currConditions[0]).slice(i - 100, i)
    let temperatureValue = Object.values(currConditions[1]).slice(i - 100, i)
    console.log("hum:",humidityValue);
      console.log("tmp:",temperatureValue);
      updateChartData(humidityValue, temperatureValue)
    // updateChartData(humidityValue, null); // Update chart with humidity
    // updateChartData(null, temperatureValue); // Update chart with temperature

})


// onValue(humidityRef, (snapshot) => {
//   const humidityValue = snapshot.val(); // Extract humidity value
// });

// onValue(temperatureRef, (snapshot) => {
//   const temperatureValue = snapshot.val(); // Extract temperature value
// });