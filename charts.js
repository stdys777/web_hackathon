function drawCustomGraph(canvasID) {
  const id = canvasID;
  const ctx = document.getElementById(canvasID).getContext('2d');

  let titleText;
  if (id === 'co2-graph') {
    titleText = 'CO2 Sensor Graph';
  } else if (id === 'temp-graph') {
    titleText = 'Temperature Graph';
  } else if (id === 'alt-graph') {
    titleText = 'Altitude Graph';
  }

  const initialLabels = [];
  const initialData = [];

  const chartData = {
    labels: initialLabels,
    datasets: [{
      label: 'Sensor Reading',
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      data: initialData,
      fill: true
    }]
  };


  function updateSensorValue(id, value, thresholds) {
    const el = document.getElementById(id);
    el.textContent = value;
  
    if (value < thresholds.normal) {
      el.style.color = 'green';
    } else if (value < thresholds.warning) {
      el.style.color = 'orange';
    } else {
      el.style.color = 'red';
    }
  }
  

  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: titleText
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'Value: ' + context.parsed.y;
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        }
      }
    }
  };

  const myChart = new Chart(ctx, config);

  function getDataValue() {
    const dataArr = myChart.data.datasets[0].data;
    return dataArr[dataArr.length - 1];
  }

  function addData(label, data) {
    myChart.data.labels.push(label);
    myChart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });

    const maxDataPoints = 20;
    if (myChart.data.labels.length > maxDataPoints) {
      myChart.data.labels.shift();
      myChart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
      });
    }

    myChart.update();
  }

  setInterval(() => {
    const now = new Date();
    const newLabel = now.toLocaleTimeString();
    let newValue;

    if (id === 'co2-graph') {
      newValue = Math.floor(Math.random() * 60);
      const co2Value = newValue;
      updateSensorValue('co2', co2Value, { normal: 800, warning: 1500 })
      addData(newLabel, newValue);
    } else if (id === 'temp-graph') {
      newValue = Math.floor(Math.random() * 80);
      addData(newLabel, newValue);
    } else if (id === 'alt-graph') {
      newValue = Math.floor(Math.random() * 20);
      addData(newLabel, newValue);
    }

    // const co2Value = new

    // const co2Value = Math.floor(Math.random() * 2000); // Simulated CO2 value
    // const altValue = Math.floor(Math.random() * 5000); // Simulated Altitude

    // updateSensorValue('co2', co2Value, { normal: 800, warning: 1500 });
    // updateSensorValue('alt', altValue, { normal: 1000, warning: 3000 });
    
    const sensorDisplayId = id.replace('-graph', '');
    document.getElementById(sensorDisplayId).textContent = getDataValue();
  }, 1000);
}
