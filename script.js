const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFound = document.querySelector(".not-found");
const searchSection = document.querySelector(".search-city");
const weatherSection = document.querySelector(".weather-info");

const apiKey = 'f233222cb53a7a31352de7049d6c80b8';

const rainContainer = document.querySelector('.rain-container');
const convertBtn = document.querySelector('.convert-degree');

function convertKelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function clearRain() {
    const rainContainer = document.querySelector('.rain-container');
    rainContainer.innerHTML = ''; // Removes all the drops inside the container
}

function toggleSunEffect() {
    const sun = document.getElementById('sun');

    if (sun.style.display === 'none' || sun.style.display === '') {
        sun.style.display = 'block';  // Hiển thị mặt trời
    } else {
        sun.style.display = 'none';   // Ẩn mặt trời
    }
}

// Lắng nghe sự kiện click nút search
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
    console.log(event);
});

convertBtn.addEventListener('click', () => {
    const tempValue = document.querySelector('.temp-txt');
    const tempValueNum = parseInt(tempValue.textContent);
    if (tempValue.textContent.includes('°C')) {
        const tempValueInF = Math.round(tempValueNum * 9 / 5 + 32);
        tempValue.textContent = `${tempValueInF}°F`;
    } else {
        const tempValueInC = Math.round((tempValueNum - 32) * 5 / 9);
        tempValue.textContent = `${tempValueInC}°C`;
    }
});

// Hàm fetch dữ liệu từ API
async function getFetchData(endPoint, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiURL);
    const data = await response.json();
    return data;
}

function updateBackground(newBg) {
    document.body.style.backgroundImage = `url('${newBg}')`;
}

function updateWeatherEffects(weatherCondition) {
    // clearRain(); // Luôn xóa hiệu ứng cũ trước khi thêm mới
    // clearInterval(window.snowEffectInterval); // Xóa hiệu ứng tuyết nếu có
    console.log(weatherCondition);

    switch (weatherCondition) {
        case "Rain":
            updateBackground("assets/rain-bg.jpg");
            break;
        case "Clear":
            updateBackground("assets/clear-bg.jpg");
            break;
        case "Clouds":
            updateBackground("assets/sunny.jpg");
            break;
        case "Thunderstorm":
            updateBackground("assets/lightning-storm.jpg");
            break;
        case "Snow":
            updateBackground("assets/snow.jpg");
            break;
        case "Drizzle":
            updateBackground("assets/rain-bg.jpg");
            break;
    }
}

// Cập nhật thông tin thời tiết
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);
    const forecastData = await getFetchData("forecast", city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFound);
        document.body.style.backgroundImage = "url('assets/wp11661193.jpg')";
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ main }],
        wind: { speed },
    } = weatherData;

    document.querySelector(".country-txt").textContent = country;
    document.querySelector(".temp-txt").textContent = Math.round(temp - 273.15) + "°C";
    document.querySelector(".humidity-value-txt").textContent = humidity + "%";
    document.querySelector(".condition-txt").textContent = main;
    document.querySelector(".wind-value-txt").textContent = speed + "m/s";
    weatherMain(main, document.querySelector(".weather-summary-img"));

    updateWeatherEffects(main);

    const dateNow = new Date().toLocaleDateString('en-US', {
        month: "short",
        day: "2-digit",
        weekday: "short",
    });

    document.querySelector(".country-date-txt").textContent = dateNow;
    console.log(forecastData);

    const forecastList = forecastData.list;
    console.log(forecastList);

    const forecastContainer = document.querySelector(".forecast-items-container");

    for (let i = 0; i < forecastContainer.children.length; i++) {
        const forecastItem = forecastContainer.children[i];
        const forecastData = forecastList[i];
        const {
            main: { temp },
            weather: [{ main }],
        } = forecastData;

            console.log(forecastItem);
        forecastItem.querySelector(".forecast-item-temp").textContent = Math.round(temp - 273.15) + "°C";

        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + 1 + i);
        console.log(forecastDate);
        const formatDate = forecastDate.toLocaleDateString('en-US', {
            month: "short",
            day: "2-digit",
        });
        
        forecastItem.querySelector(".forecast-item-date").textContent = formatDate;
        weatherMain(main, forecastItem.querySelector(".forecast-item-img"));
    }

    showDisplaySection(weatherSection);
}

function weatherMain(main, querySelector) {
    switch (main) {
        case "Clear":
            querySelector.src = "assets/weather/clear.svg";
            break;
        case "Clouds":
            querySelector.src = "assets/weather/clouds.svg";
            break;
        case "Rain":
            querySelector.src = "assets/weather/rain.svg";
            break;
        case "Drizzle":
            querySelector.src = "assets/weather/rain.svg";
            break;
        case "Thunderstorm":
            querySelector.src = "assets/weather/storm.svg";
            break;
        case "Snow":
            querySelector.src = "assets/weather/snow.svg";
            break;
        case "Atmosphere":
            querySelector.src = "assets/weather/atmosphere.svg";
            break;
    }
}

// Hiển thị phần giao diện tương ứng
function showDisplaySection(section) {
    [searchSection, weatherSection, notFound].forEach((element) => {
        element.style.display = "none";
    });
    section.style.display = "flex";
}
