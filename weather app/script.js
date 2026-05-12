const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    await getWeather(city);
}

async function getWeather(city) {
    try {
        showLoading(true);
        hideError();
        
        // Get coordinates from city name
        const coords = await getCoordinates(city);
        
        // Get weather data
        const weatherData = await fetchWeatherData(coords.latitude, coords.longitude);
        
        // Display weather
        displayWeather(weatherData, city);
        showLoading(false);
        
    } catch (error) {
        showLoading(false);
        showError(error.message);
    }
}

async function getCoordinates(city) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error(`City "${city}" not found. Please try another city.`);
        }
        
        const result = data.results[0];
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country
        };
    } catch (error) {
        throw new Error(`Unable to find city: ${error.message}`);
    }
}

async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        return data.current;
    } catch (error) {
        throw new Error(`Unable to fetch weather data: ${error.message}`);
    }
}

function getWeatherDescription(weatherCode) {
    // WMO Weather interpretation codes
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Drizzle',
        53: 'Drizzle',
        55: 'Heavy drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with hail'
    };
    
    return weatherCodes[weatherCode] || 'Unknown';
}

function getWeatherIcon(weatherCode) {
    // Map weather codes to emoji icons
    if (weatherCode === 0) return '☀️';
    if (weatherCode === 1 || weatherCode === 2) return '⛅';
    if (weatherCode === 3) return '☁️';
    if (weatherCode === 45 || weatherCode === 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 55) return '🌧️';
    if (weatherCode >= 61 && weatherCode <= 65) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 75) return '❄️';
    if (weatherCode >= 80 && weatherCode <= 82) return '🌧️';
    if (weatherCode >= 85 && weatherCode === 86) return '❄️';
    if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
    return '🌡️';
}

function displayWeather(weatherData, cityName) {
    // Set date
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('date').textContent = date;
    
    // Set city name
    document.getElementById('cityName').textContent = cityName;
    
    // Set temperature
    const temp = Math.round(weatherData.temperature_2m);
    document.getElementById('temperature').textContent = temp;
    
    // Set weather description
    const description = getWeatherDescription(weatherData.weather_code);
    document.getElementById('weatherDesc').textContent = description;
    
    // Set weather icon (using emoji)
    const icon = getWeatherIcon(weatherData.weather_code);
    document.getElementById('weatherIcon').textContent = icon;
    document.getElementById('weatherIcon').style.fontSize = '60px';
    document.getElementById('weatherIcon').style.width = 'auto';
    document.getElementById('weatherIcon').style.height = 'auto';
    
    // Set feels like
    const feelsLike = Math.round(weatherData.apparent_temperature);
    document.getElementById('feelsLike').textContent = `${feelsLike}°C`;
    
    // Set humidity
    document.getElementById('humidity').textContent = `${weatherData.relative_humidity_2m}%`;
    
    // Set wind speed
    const windSpeed = Math.round(weatherData.wind_speed_10m * 10) / 10;
    document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;
    
    // Set pressure
    const pressure = Math.round(weatherData.pressure_msl);
    document.getElementById('pressure').textContent = `${pressure} hPa`;
    
    // Set visibility
    const visibility = (weatherData.visibility / 1000).toFixed(1);
    document.getElementById('visibility').textContent = `${visibility} km`;
    
    // Set UV index (placeholder since not in current API)
    document.getElementById('uvIndex').textContent = 'N/A';
    
    // Show weather container
    weatherContainer.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Initial search for a default city
window.addEventListener('load', () => {
    cityInput.value = 'London';
    handleSearch();
});
