document.addEventListener('DOMContentLoaded', async () => {
   try{
      const response = await fetch("/weather?city=London");
      const data = await response.json();

      const hours = data.time.map(time => {
         const d = new Date(time);
         return d.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
         });
      });

      updateChart(hours, data.temperature_2m);
   }
   catch (error) {
      console.log(error);
      alert(error.message);
   }
});

function updateChart(labels, data) {
   const ctx = document.getElementById('weather-chart');

   new Chart(ctx, {
      type: 'line',
      data: {
         labels,
         datasets: [{
            label: 'Temperature (°C)',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4, // плавная линия
            fill: true,
            pointRadius: 3,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
         }]
      },
      options: {
         responsive: true,
         plugins: {
            legend: {
               display: true,
               position: 'top',
            },
            tooltip: {
               callbacks: {
                  label: (context) => `${context.parsed.y} °C`
               }
            }
         },
         scales: {
            x: {
               ticks: {
                  maxRotation: 90,
                  minRotation: 45,
               }
            },
            y: {
               title: {
                  display: true,
                  text: 'Temperature (°C)'
               }
            }
         }
      }
   });
}