document.addEventListener('DOMContentLoaded', async () => {
   const getWeatherForm = document.querySelector('.get-weather-form');
   const settlementInput = getWeatherForm.querySelector('input[name="settlement"]');

   getWeatherForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const settlement = settlementInput.value.trim();
      await getWeather(settlement);
   });

   await getWeather("Moscow");
});

async function getWeather(settlement) {
   try{
      const response = await fetch(`/weather?city=${settlement}`);
      const data = await response.json();

      if (response.status === 200) {
         updateChartSection(data.settlement, data.weather);
      } else {
         alert(data.error);
      }
   }
   catch (error) {
      alert(error.message);
   }
}

let currentChart = null;
let prevActiveBtn = null;
function updateChartSection(title, weather) {
   clearPrevData()

   const chartContainer = document.querySelector('.weather-chart');
   const chartButtons = chartContainer.querySelector('.weather-chart__days');

   for(let key in weather) {
      const {time, temperature} = weather[key];

      const button = `<button data-day="${key}" ${!currentChart ? "class=active" : ""}>${key}</button>`;
      chartButtons.insertAdjacentHTML('beforeend', button);

      if(!currentChart) {
         currentChart = makeChart(chartContainer.querySelector("canvas"), title, time, temperature);
      }
   }

   const dayButtons = document.querySelectorAll(".weather-chart__days button");
   prevActiveBtn = dayButtons[0];

   dayButtons.forEach(button => {
      button.addEventListener("click", () => {
         button.classList.add("active");
         if(prevActiveBtn) {
            prevActiveBtn.classList.remove("active");
            prevActiveBtn = button;
         }

         const day = button.getAttribute("data-day");
         const {time, temperature} = weather[day];

         currentChart.destroy();
         currentChart = makeChart(chartContainer.querySelector("canvas"), title, time, temperature);
      });
   });
}

function clearPrevData() {
   if (currentChart) {
      currentChart.destroy();
      currentChart = null;
   }

   document.querySelectorAll(".weather-chart__days button").forEach(button => {
      button.remove();
   });
}

function makeChart(canvas, title, time, temperature) {
   return new Chart(canvas, {
      type: 'line',
      data: {
         labels: time,
         datasets: [{
            label: 'Temperature (°C)',
            data: temperature,
            borderColor: '#4fd1c5',
            backgroundColor: 'rgba(79, 209, 197, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: '#4fd1c5',
         }]
      },
      options: {
         responsive: true,
         plugins: {
            title: {
               display: true,
               text: title,
               color: '#c0c0c0',
               font: {
                  family: "Outfit",
                  weight: "bold",
                  size: 24
               }
            },
            legend: {
               display: false,
            },
            tooltip: {
               backgroundColor: '#2d2d2d',
               titleColor: '#ffffff',
               bodyColor: '#ffffff',
               callbacks: {
                  label: (context) => `${context.parsed.y} °C`
               }
            }
         },
         scales: {
            x: {
               ticks: {
                  color: '#c0c0c0',
                  maxRotation: 90,
                  minRotation: 45,
                  font: {
                     family: "Outfit",
                     weight: "lighter"
                  }
               },
               grid: {
                  color: 'rgba(200,200,200,0.2)'
               },
            },
            y: {
               ticks: {
                  color: '#c0c0c0',
                  font: {
                     family: "Outfit",
                     weight: "lighter"
                  }
               },
               grid: {
                  color: 'rgba(200,200,200,0.2)'
               },
               title: {
                  display: true,
                  text: 'Temperature (°C)',
                  color: '#e0e0e0',
                  font: {
                     family: "Outfit",
                  }
               }
            }
         }
      }
   });
}