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
         const hours = data.time.map(time => {
            const d = new Date(time);
            return d.toLocaleString("ru-RU", {
               day: "2-digit",
               month: "2-digit",
               hour: "2-digit",
               minute: "2-digit"
            });
         });

         updateChart(data.settlement, hours, data.temperature_2m);
      } else {
         alert(data.error);
      }
   }
   catch (error) {
      alert(error.message);
   }
}

let currentChart = null;
function updateChart(title, labels, data) {
   if (currentChart) {
      currentChart.destroy();
   }

   const ctx = document.getElementById('weather-chart');

   currentChart = new Chart(ctx, {
      type: 'line',
      data: {
         labels,
         datasets: [{
            label: 'Temperature (°C)',
            data,
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