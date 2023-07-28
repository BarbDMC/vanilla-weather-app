const apiUrl = "https://api.openweathermap.org/data/2.5/";
const apiKey = "appid=ebcc35ec60d3e052544562c77e21c2fb";

getCurrentPosition();

const searchCity = document.getElementById("searchButton");
searchCity.addEventListener("click", getWeather);

const input = document.getElementById("searchText");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather();
  }
});

const searchCurrent = document.getElementById("currentButton");
searchCurrent.addEventListener("click", getCurrentPosition);

async function getWeather() {
  const city = document.getElementById("searchText").value;
  const cityNameFixed =
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  try {
    const { data } = await axios.get(
      `${apiUrl}weather?q=${cityNameFixed}&${apiKey}&&units=metric`
    );

    const response = await axios.get(
      `https://api.shecodes.io/weather/v1/forecast?query=${cityNameFixed}&key=453b1a73df8a34a6edo8997780et62a8`
    );

    const formatDate = getDate(data.dt);

    showWeather(cityNameFixed, data, formatDate);
    showDaysWeather(response.data.daily);
  } catch (error) {
    alert("No result found, try again!");
  }
}

function showWeather(cityName, weatherData, formatDate) {
  const cityDisplay = document.getElementById("city");
  cityDisplay.firstChild.nodeValue = `${cityName}, ${weatherData.sys.country}`;

  const temperature = Math.round(weatherData.main.temp);
  const temperatureDisplay = document.getElementById("temperature");
  temperatureDisplay.firstChild.nodeValue = `${temperature} °C`;

  const date = document.getElementById("todayDate");
  date.firstChild.nodeValue = formatDate;

  const description = document.getElementById("description");
  description.firstChild.nodeValue = weatherData.weather[0].description;
}

function getCurrentPosition() {
  return navigator.geolocation.getCurrentPosition(getCurrentWeather);
}

async function getCurrentWeather(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const formatDate = getDate(position.timestamp);
  const petitionParams = `lat=${latitude}&lon=${longitude}&${apiKey}&&units=metric`;

  try {
    const { data } = await axios.get(`${apiUrl}weather?${petitionParams}`);

    const response = await axios.get(
      `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=453b1a73df8a34a6edo8997780et62a8`
    );

    showWeather(data.name, data, formatDate);
    showDaysWeather(response.data.daily);
  } catch (error) {
    alert("No result found, please activate your location");
  }
}

function getDate(timestampDate) {
  const date = new Date(timestampDate * 1000);

  const weekDay = date.toDateString();
  const dateFormat = `${weekDay}, ${date.getHours()}:${date.getMinutes()}`;
  return dateFormat;
}

function showDaysWeather(daysWeather) {
  const weatherDataContainer = document.getElementById("weatherData");

  let weatherContent = "";
  const nextDays = daysWeather.slice(0, -2);

  nextDays.forEach((day) => {
    const date = new Date(day.time * 1000);
    const temperature = Math.round(day.temperature.day);
    const weatherDescription = day.condition.description;

    weatherContent += `<div>`;
    weatherContent += `<p>${date.toDateString()}</p>`;
    weatherContent += `<p>${temperature} °C</p>`;
    weatherContent += `<p>${weatherDescription}</p>`;
    weatherContent += `</div>`;
  });

  weatherDataContainer.innerHTML = weatherContent;
}
