/*
Credits to :

The Coding Train for making a great tutorial on how to build charts in JS with Charts.js
https://www.youtube.com/watch?v=5-ptp9tRApM

Source of the data is
European Centre for Disease Prevention and Control
https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
Downloaded 12 November 2020

*/

window.addEventListener('load', setup);

async function setup() {
    const ctx = document.getElementById('casesChart').getContext('2d');
    const ctx2 = document.getElementById('deathsChart').getContext('2d');
    const data = await getData();
    console.log(data);
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: data.dates,
            datasets: [{
                label: 'The daily number of new reported cases of COVID-19 in Belgium',
                backgroundColor: 'blue',
                borderColor: 'rgb(255, 99, 132)',
                data: data.cases
            }, {
              label: 'The daily number of new deaths due to COVID-19 in Belgium',
              backgroundColor: 'red',
              data: data.deaths
            }]
        },

        // Configuration options go here
        options: {
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration: 0
          
        }
    });

    const chart2 = new Chart(ctx2, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: data.dates,
          datasets: [{
              label: 'The daily number of new deaths due to COVID-19 in Belgium',
              backgroundColor: 'red',
              borderColor: 'rgb(255, 99, 132)',
              data: data.deaths
          }]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0
      }
  });
}


async function getData() {
  const response = await fetch('belgium2.csv');
  const data = await response.text();
  const rows = data.split("\n").slice(1);
  dates = [];
  cases = [];
  deaths = [];
  rows.forEach(row => {
    const cols = row.split(",");
    const date = cols[0];
    const casecount = cols[4];
    const deathcount = cols[5];
    dates.unshift(date);
    cases.unshift(casecount);
    deaths.unshift(deathcount);
  });
  return { dates, cases, deaths};
}