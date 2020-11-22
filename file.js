/*
Credits to :

The Coding Train for making a great tutorial on how to build charts in JS with Charts.js
https://www.youtube.com/watch?v=5-ptp9tRApM

Sources of the data are:

European Centre for Disease Prevention and Control
https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
Downloaded 12 November 2020

Sciensano
https://epistat.wiv-isp.be/covid/

NEW_IN
Number of new lab-confirmed hospital intakes in the last 24h (incidence) not
referred to another hospital

NEW_OUT
Number of new lab-confirmed hospital discharges (alive) in the last 24h
(incidence) not referred to another hospital

Change in definition on 28/04/2020:
Given the enlarged test indications since 22/04/2020 (all patients admitted to the
hospital can be tested, regardless of the reason for admission) and given the
gradual return to normal hospital activities, the new lab-confirmed admissions are
now subdivided according to pathology, i.e. COVID-19 lab-confirmed patients
admitted to the hospital because of COVID-19, and COVID-19 lab-confirmed
patients admitted to the hospital because of another pathology but who tested
positive within a screening context. The latter are not included in the variable
NEW_IN.


*/

window.addEventListener('load', setup);

async function setup() {
    const ctxHosp = document.getElementById('hospChart').getContext('2d');
    const ctxHospDiff = document.getElementById('hospChartDiff').getContext('2d');
    const ctx = document.getElementById('casesChart').getContext('2d');
    const ctx2 = document.getElementById('deathsChart').getContext('2d');
    const data = await getData();
    const hospData = await getHosp();
    console.log(hospData);

    const hospChart = new Chart(ctxHosp, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: hospData.dates,
          datasets: [{
              label: 'Number of new lab-confirmed hospital intakes in the last 24h (intake due to COVID)',
              backgroundColor: 'green',
              borderColor: 'rgb(255, 99, 132)',
              data: hospData.newIns
          }, {
              label: 'Number of new lab-confirmed hospital discharges (alive) in the last 24h',
              backgroundColor: 'red',
              borderColor: 'rgb(255, 99, 132)',
              data: hospData.newOuts
          }]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0
        
      }
    });


    const hospChartDiff = new Chart(ctxHospDiff, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
          labels: hospData.dates,
          datasets: [{
              label: 'Hospital intake minus hospital discharges in the last 24 hrs',
              backgroundColor: 'blue',
              data: hospData.netResult
          }, {
              label: 'Total number of lab-confirmed hospitalized patients at the moment of reporting (prevalence)',
              backgroundColor: 'pink',
              data: hospData.totalIns
          }]
      },

      // Configuration options go here
      options: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0
        
      }
    });


    const casesChart = new Chart(ctx, {
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

    const deathsChart = new Chart(ctx2, {
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

async function getHosp() {
  const response = await fetch('COVID19BE.csv');
  const data = await response.text();
  const rows = data.split("\n").slice(1);
  dates = [];
  newIns = [];
  newOuts = [];
  totalIns = [];
  let previousDate = '2020-03-15';
  let newInTotal = 0;
  let newOutTotal = 0;
  let totalInTotal = 0;
  
  rows.forEach(row => {
    const cols = row.split(",");
    const date = cols[0];
    const newInCurrentLine = parseInt(cols[8]);
    const newOutCurrentLine = parseInt(cols[9]);
    const totalInCurrentLine = parseInt(cols[4]);

    if (previousDate === date) {
      dates.pop();
      newIns.pop();
      newOuts.pop();
      totalIns.pop();
      newInTotal += newInCurrentLine;
      newOutTotal += newOutCurrentLine;
      totalInTotal += totalInCurrentLine;
    } else {
      newInTotal = newInCurrentLine;
      newOutTotal = newOutCurrentLine;
      totalInTotal = totalInCurrentLine;
      previousDate = date;
    }

    dates.push(date);
    newIns.push(newInTotal); 
    newOuts.push(newOutTotal);
    totalIns.push(totalInTotal);
  });

  let netResult = []; 
  for (let i = 0; i < newIns.length ; i++) {
    let difference = newIns[i] - newOuts[i];
    netResult.push(difference);
  }

  return { dates, newIns, newOuts, netResult, totalIns };
}