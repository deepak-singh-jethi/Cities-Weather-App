const form = document.querySelector("form");
const apiKey = "898b0d89ce8af9ab3e462a6034f11ef1";
const WatherclassName = {
  Thunderstorm: "fa-cloud-bolt",
  Drizzle: "fa-solid fa-cloud-sun-rain",
  Rain: "fa-solid fa-cloud-showers-water",
  Snow: "fa-solid fa-snowflake",
  Clear: "fa-solid fa-sun",
  Clouds: "fa-solid fa-cloud",

  Mist: "fa-solid  fa-smog",
  Dust: "fa-solid  fa-smog",
  Haze: "fa-solid  fa-smog",
  Smoke: "fa-solid  fa-smog",
  Fog: "fa-solid  fa-smog",
  Tornado: "fa-solid fa-tornado",
};
const weatherInfoConatiner = document.querySelector("#weatherInfoConatiner");

const citiesWeather = [];

async function driverFun(city) {
  try {
    // Check if the city already exists in the array
    const existingCityIndex = citiesWeather.findIndex(
      (element) => element.city === city
    );

    if (existingCityIndex !== -1) {
      const weatherData = await fetchData(city);
      citiesWeather[existingCityIndex] = weatherData;
      alert("weather card already exist check the list");
    } else {
      const weatherData = await fetchData(city);
      citiesWeather.push(weatherData);
    }

    // Sort the array by increasing temperature
    citiesWeather.sort((a, b) => a.temp - b.temp);

    input_city.value = "";

    // Print all cities data
    printData();
  } catch (error) {
    console.error("Error in driverFun:", error);
  }
}

async function fetchData(cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);
    const formattedData = formatData(data, cityName);
    return formattedData;
  } catch (error) {
    alert("Enter a correct city name!!");
    console.error("Error fetching data:", error);
  }
}

function printData() {
  weatherInfoConatiner.innerHTML = "";
  citiesWeather.forEach((ele) => {
    const classname = getClassName(ele.main);
    console.log(classname);
    const cityInfo = document.createElement("div");
    cityInfo.classList.add("cityInfo");
    cityInfo.innerHTML = `<div class="city">
            <div class="info1">
              <h1>${ele.temp}&deg;</h1>

              <div>
                <p>H-${ele.t_high}&deg;,  L-${ele.t_min}&deg;</p>
                <h4> ${ele.cityPrint}</h4>
              </div>
            </div>
            <div class="info2">
              <p>${ele.weather}</p>
            </div>
          </div>`;
    //  <i class=${classname}></i>
    const icon = document.createElement("i");
    icon.setAttribute("class", classname);
    cityInfo.appendChild(icon);
    weatherInfoConatiner.append(cityInfo);
  });
}

// format the weather api data
function formatData(data, city) {
  let formattedData = {};
  formattedData.temp = data.main.temp;
  formattedData.t_high = data.main.temp_max;
  formattedData.t_min = data.main.temp_min;
  formattedData.weather = data.weather[0].description;
  formattedData.main = data.weather[0].main;
  formattedData.city = city;
  formattedData.cityPrint = `${data.name}, ${data.sys.country}`;
  return formattedData;
}

function getClassName(condition) {
  // Check if the condition exists in the WatherclassName object
  if (WatherclassName.hasOwnProperty(condition)) {
    return WatherclassName[condition];
  } else {
    // Default to a generic class if the condition is not found
    return "fa-solid fa-sun";
  }
}

// ! event listners
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (input_city.value) {
    driverFun(input_city.value);
  } else {
    alert("Enter a city name Please!!");
  }
});
