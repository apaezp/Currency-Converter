const currencyContainer = document.querySelector(".currencyContainer");
const pesosInput = document.querySelector("input");
const currencySelect = document.querySelector(".currency-select");
const button = document.querySelector("button");
const span = document.querySelector("span");
const urlBase = "https://mindicador.cl/api";

button.addEventListener("click", async () => {
  const { value: pesos } = pesosInput;
  const { value: monedaSelected } = currencySelect;

  const currencyValue = await search(monedaSelected);
  const finalValue = (pesos / currencyValue).toFixed(2);
  span.innerHTML = `Result: $${finalValue}`;
});

async function search(moneda) {
  try {
    const res = await fetch(`${urlBase}/${moneda}`);
    const data = await res.json();
    const { serie } = data;
    const datos = createDataToChart(serie.slice(0, 10).reverse());
    renderChart(datos);
    const [{ valor: currencyValue }] = serie;
    return currencyValue;
  } catch (error) {
    alert("It's a trap!");
    console.log(error);
  }
}

let chartRendered = null;

function renderChart(data) {
  const config = {
    type: "line",
    data,
  };
  let myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "white";
  if(chartRendered!=null){
    chartRendered.destroy();
  }
  chartRendered = new Chart(myChart, config);
}


function createDataToChart(serie) {
  const labels = serie.map(({ fecha }) => formatDate(fecha));
  const data = serie.map(({ valor }) => valor);
  const datasets = [
    {
      label: "Exchange Rate History: Last 10 days",
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
}

function formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}


