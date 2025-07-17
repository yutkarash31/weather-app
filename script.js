const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // <-- Replace with your OpenWeatherMap API key
const weatherCard = document.getElementById('weather-card');
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');
const bgGradient = document.getElementById('bg-gradient');

const weatherBackgrounds = {
  Clear: 'from-yellow-200 to-blue-400',
  Clouds: 'from-gray-300 to-gray-500',
  Rain: 'from-blue-400 to-gray-700',
  Drizzle: 'from-blue-200 to-blue-500',
  Thunderstorm: 'from-gray-700 to-gray-900',
  Snow: 'from-blue-100 to-blue-300',
  Mist: 'from-gray-200 to-gray-400',
  Smoke: 'from-gray-300 to-gray-600',
  Haze: 'from-yellow-100 to-gray-400',
  Dust: 'from-yellow-200 to-yellow-500',
  Fog: 'from-gray-300 to-gray-500',
  Sand: 'from-yellow-300 to-yellow-600',
  Ash: 'from-gray-400 to-gray-700',
  Squall: 'from-blue-300 to-gray-600',
  Tornado: 'from-gray-700 to-gray-900',
};

function setBackground(condition) {
  const gradient = weatherBackgrounds[condition] || 'from-blue-200 to-blue-500';
  bgGradient.className = `min-h-screen flex items-center justify-center bg-gradient-to-br ${gradient} transition-all duration-700`;
}

async function fetchWeather(city) {
  errorMessage.classList.add('hidden');
  weatherCard.innerHTML = '<div class="animate-pulse text-gray-400">Loading weather...</div>';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    displayWeather(data);
    setBackground(data.weather[0].main);
  } catch (err) {
    errorMessage.textContent = 'City not found. Please try again.';
    errorMessage.classList.remove('hidden');
    weatherCard.innerHTML = '';
    setBackground('');
  }
}

function displayWeather(data) {
  const weather = data.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
  weatherCard.innerHTML = `
    <div class="fade-in visible flex flex-col items-center">
      <div class="text-2xl font-semibold mb-2">${data.name}, ${data.sys.country}</div>
      <img src="${iconUrl}" alt="${weather.main}" class="weather-icon animated mb-2" />
      <div class="text-4xl font-bold mb-2">${Math.round(data.main.temp)}&deg;C</div>
      <div class="capitalize text-lg mb-4">${weather.description}</div>
      <div class="grid grid-cols-2 gap-4 text-sm w-full max-w-xs">
        <div class="flex flex-col items-center"><span class="font-semibold">Humidity</span><span>${data.main.humidity}%</span></div>
        <div class="flex flex-col items-center"><span class="font-semibold">Wind</span><span>${data.wind.speed} m/s</span></div>
        <div class="flex flex-col items-center"><span class="font-semibold">Pressure</span><span>${data.main.pressure} hPa</span></div>
        <div class="flex flex-col items-center"><span class="font-semibold">Condition</span><span>${weather.main}</span></div>
      </div>
    </div>
  `;
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// On load, show default city
window.addEventListener('DOMContentLoaded', () => {
  fetchWeather('Varanasi');
}); 