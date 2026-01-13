import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Thermometer, Droplets, Wind, MapPin, Globe, Calendar, Clock, Compass, Cloud, Sun as SunIcon, CloudRain, Flag, User, Info, Umbrella, Navigation, Shield, Heart, X, Menu, ChevronDown, Phone, Mail, Github, Linkedin } from 'lucide-react';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [showSeasonalInfo, setShowSeasonalInfo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const quickCities = [
    { name: 'Addis Ababa', lat: 9.0320, lon: 38.7469, region: 'Addis Ababa', elevation: 2355 },
    { name: 'Dire Dawa', lat: 9.5931, lon: 41.8661, region: 'Dire Dawa', elevation: 1276 },
    { name: 'Bahir Dar', lat: 11.5936, lon: 37.3908, region: 'Amhara', elevation: 1800 },
    { name: 'Hawassa', lat: 7.0613, lon: 38.4760, region: 'SNNPR', elevation: 1708 },
    { name: 'Mekelle', lat: 13.4935, lon: 39.4737, region: 'Tigray', elevation: 2084 },
    { name: 'Gondar', lat: 12.6061, lon: 37.4572, region: 'Amhara', elevation: 2133 },
    { name: 'Jimma', lat: 7.6667, lon: 36.8333, region: 'Oromia', elevation: 1780 },
    { name: 'Harar', lat: 9.3132, lon: 42.1182, region: 'Harari', elevation: 1885 },
    { name: 'Debre Markos', lat: 10.3333, lon: 37.7333, region: 'Amhara', elevation: 2446 },
    { name: 'Arba Minch', lat: 6.0333, lon: 37.5500, region: 'SNNPR', elevation: 1285 },
  ];

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const ethiopianSeasons = [
    { name: 'Bega (Dry Season)', months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'], description: 'Cool and dry season' },
    { name: 'Belg (Short Rains)', months: ['Mar', 'Apr', 'May'], description: 'Short rainy season' },
    { name: 'Kiremt (Long Rains)', months: ['Jun', 'Jul', 'Aug', 'Sep'], description: 'Main rainy season' }
  ];

  const developerInfo = {
    name: "Ketema Deresa",
    title: "Cloud computing|Virtualization|Machine learning|,Data Solutions & Full-Stack Developer",
    Interested_Area: "Cloud computing|Virtualization|Machine learning|Web app Development & Data Solutions",
    education: "Msc in Computer Science",
    location: "Based in Ethiopia",
    bio: "Passionate about building technology solutions that empower communities and address climate challenges in Ethiopia.",
    expertise: [
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "Python", level: 80 },
      { name: "Data Visualization", level: 75 },
      { name: "Climate Analytics", level: 85 }
    ],
    projects: [
    
      { name: "Climate Data Hub", description: "Centralized climate data platform" }
    ],
    contact: {
      email: "ketemaderesa123@gmail.com",
      phone: "+251 912 692 593",
      github: "github.com/ketemaderesa",
      linkedin: "linkedin.com/in/ketemaderesa"
    },
    quote: "Technology should serve people and protect our environment."
  };

  const getClothingRecommendation = (temp, condition) => {
    if (temp >= 25) return "Light clothing, hat, sunscreen";
    if (temp >= 15 && temp < 25) return "Light to medium clothing";
    if (temp >= 5 && temp < 15) return "Warm clothing, jacket";
    if (temp < 5) return "Heavy winter clothing";
    if (condition.toLowerCase().includes('rain')) return "Raincoat or umbrella";
    if (condition.toLowerCase().includes('sun')) return "Sunscreen, sunglasses";
    return "Comfortable clothing";
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-detect location on load
  useEffect(() => {
    if (!API_KEY) {
      setError('API key missing – check your .env file');
      setLoading(false);
      return;
    }

    const fetchInitialWeather = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          },
          async () => {
            setCity('Addis Ababa');
            await fetchWeatherByCoords(9.0320, 38.7469);
          }
        );
      } else {
        setCity('Addis Ababa');
        await fetchWeatherByCoords(9.0320, 38.7469);
      }
    };

    fetchInitialWeather();
  }, [API_KEY]);

  const fetchWeatherByName = async (cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName},ET&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 401) throw new Error('Invalid API key');
      if (data.cod === 404) throw new Error(`"${cityName}" not found in Ethiopia`);
      if (!response.ok) throw new Error(data.message || 'Weather fetch failed');

      processWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 401) throw new Error('Invalid API key');
      if (!response.ok) throw new Error(data.message || 'Weather fetch failed');

      processWeatherData(data);
      setCity(data.name);
    } catch (err) {
      setError(err.message);
      setCity('Addis Ababa');
      await fetchWeatherByCoords(9.0320, 38.7469);
    } finally {
      setLoading(false);
    }
  };

  const processWeatherData = (data) => {
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    const timezoneOffset = data.timezone;
    
    const cityData = quickCities.find(c => c.name === data.name) || { elevation: Math.round(data.coord.lat * 100) };
    
    setWeather({
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      pressure: data.main.pressure,
      visibility: (data.visibility / 1000).toFixed(1),
      sunrise: sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timezoneOffset,
      main: data.weather[0].main,
      clouds: data.clouds.all,
      lat: data.coord.lat,
      lon: data.coord.lon,
      elevation: cityData.elevation,
      clothing: getClothingRecommendation(Math.round(data.main.temp), data.weather[0].description)
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    fetchWeatherByName(city);
  };

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case 'clear': return <SunIcon className="w-5 h-5 text-yellow-500" />;
      case 'clouds': return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'rain': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'drizzle': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'thunderstorm': return <CloudRain className="w-5 h-5 text-purple-500" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEthiopianTime = () => {
    const ethiopianTime = new Date(time.getTime() + (3 * 60 * 60 * 1000));
    return ethiopianTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
  };

  const getEthiopianDate = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return time.toLocaleDateString('en-ET', options);
  };

  const getCurrentEthiopianSeason = () => {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const season = ethiopianSeasons.find(s => s.months.includes(currentMonth));
    return season || ethiopianSeasons[0];
  };

  const getRegionColor = (region) => {
    const colors = {
      'Addis Ababa': 'bg-blue-500',
      'Oromia': 'bg-green-500',
      'Amhara': 'bg-yellow-500',
      'SNNPR': 'bg-red-500',
      'Tigray': 'bg-purple-500',
      'Somali': 'bg-indigo-500',
      'Harari': 'bg-cyan-500',
      'Dire Dawa': 'bg-lime-500',
      'Gambela': 'bg-teal-500',
    };
    return colors[region] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
                    Ethiopia Weather
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Real-time Updates</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{getEthiopianDate()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getEthiopianTime()} EAT</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSeasonalInfo(true)}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg hover:opacity-90 transition"
                >
                  Seasons
                </button>
                <button
                  onClick={() => setShowDeveloperInfo(true)}
                  className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Developer
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="text-center">
                  <p className="font-medium">{getEthiopianDate()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{getEthiopianTime()} EAT</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setShowSeasonalInfo(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg"
                  >
                    Ethiopian Seasons
                  </button>
                  <button
                    onClick={() => setShowDeveloperInfo(true)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    About Developer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 bg-clip-text text-transparent">
            Weather Across Ethiopia
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-time weather data for cities across all Ethiopian regions. Plan your activities with accurate forecasts.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Search any Ethiopian city..."
                  className="w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-500 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick Cities */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {quickCities.map((cityItem) => (
              <button
                key={cityItem.name}
                onClick={() => fetchWeatherByCoords(cityItem.lat, cityItem.lon)}
                className={`p-3 rounded-xl transition-all text-left ${
                  weather?.city === cityItem.name
                    ? 'bg-gradient-to-r from-green-500 to-yellow-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 hover:shadow-md border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="w-4 h-4" />
                  <div className={`w-2 h-2 rounded-full ${getRegionColor(cityItem.region)}`}></div>
                </div>
                <p className="font-medium text-sm">{cityItem.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {cityItem.region} • {cityItem.elevation}m
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 dark:border-gray-600 border-t-green-500"></div>
            <p className="mt-6 text-gray-600 dark:text-gray-400">Loading weather data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <p className="text-red-600 dark:text-red-400 font-medium">⚠️ {error}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Try selecting a city from the list above
              </p>
            </div>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-8">
            {/* Current Weather Card */}
            <div className="bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl p-6 text-white">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <h2 className="text-2xl font-bold">{weather.city}, Ethiopia</h2>
                    <span className="text-xl">🇪🇹</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-6">
                    <div>
                      <p className="text-6xl font-bold">{weather.temp}°C</p>
                      <p className="text-lg opacity-90">Feels like {weather.feelsLike}°C</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className="w-20 h-20"
                      />
                      <p className="capitalize font-medium">{weather.description}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <SunIcon className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm opacity-90">Sunrise</p>
                      <p className="font-semibold">{weather.sunrise}</p>
                    </div>
                    <div className="text-center">
                      <Moon className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm opacity-90">Sunset</p>
                      <p className="font-semibold">{weather.sunset}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  Temperature Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Real Feel</span>
                    <span className="font-semibold">{weather.feelsLike}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Min / Max</span>
                    <span className="font-semibold">{weather.temp - 2}° / {weather.temp + 2}°C</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Humidity & Wind
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Humidity</span>
                    <span className="font-semibold">{weather.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Wind Speed</span>
                    <span className="font-semibold">{weather.wind} m/s</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-gray-500" />
                  Atmospheric Data
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Pressure</span>
                    <span className="font-semibold">{weather.pressure} hPa</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Visibility</span>
                    <span className="font-semibold">{weather.visibility} km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Umbrella className="w-5 h-5 text-blue-500" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Thermometer className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Clothing Advice</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{weather.clothing}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Location Details</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {weather.lat.toFixed(2)}°N, {weather.lon.toFixed(2)}°E • Elevation: ~{weather.elevation}m
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  Seasonal Information
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{getCurrentEthiopianSeason().name}</p>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                        Current
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentEthiopianSeason().description}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSeasonalInfo(true)}
                    className="w-full text-center text-green-600 dark:text-green-400 hover:underline text-sm"
                  >
                    Learn more about Ethiopian seasons →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ethiopia Weather</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time weather monitoring</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Serving communities across all Ethiopian regions
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowDeveloperInfo(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <User className="w-4 h-4" />
                <span>Meet the Developer</span>
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Developed with ❤️ by Ketema Deresa
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm font-medium mb-2">Quick Links</p>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => setShowSeasonalInfo(true)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  Ethiopian Seasons
                </button>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition">
                  Data Source
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Ethiopia Weather Watch • Data provided by OpenWeather API
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Built for farmers, travelers, and communities across Ethiopia
            </p>
          </div>
        </div>
      </footer>

      {/* Developer Info Modal */}
      {showDeveloperInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ketema Deresa</h2>
                    <p className="text-green-600 dark:text-green-400">Full-Stack Developer</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeveloperInfo(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-semibold text-lg mb-3">About Me</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {developerInfo.bio}
                </p>
              </div>

              {/* Education & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Education
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{developerInfo.education}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{developerInfo.location}</p>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Technical Expertise</h3>
                <div className="space-y-4">
                  {developerInfo.expertise.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Featured Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {developerInfo.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Get In Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={`mailto:${developerInfo.contact.email}`} className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                      {developerInfo.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{developerInfo.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <a href={`https://${developerInfo.contact.github}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">
                      {developerInfo.contact.github}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="text-center italic text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
                "{developerInfo.quote}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Info Modal */}
      {showSeasonalInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ethiopian Seasons Guide</h2>
                    <p className="text-green-600 dark:text-green-400">Climate Patterns & Travel Tips</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSeasonalInfo(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Seasons Overview */}
              <div className="space-y-4">
                {ethiopianSeasons.map((season, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-5 border ${
                      season.name === getCurrentEthiopianSeason().name
                        ? 'bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{season.name}</h3>
                      {season.name === getCurrentEthiopianSeason().name && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                          Current Season
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{season.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{season.months.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Travel Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Umbrella className="w-5 h-5 text-blue-500" />
                  Travel & Agricultural Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">For Travelers</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Kiremt: Always carry rain protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Bega: Best time for outdoor activities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Belg: Light jacket recommended</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">For Farmers</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Kiremt: Main planting season</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Belg: Secondary planting season</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Bega: Harvesting season</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Regional Climate Info */}
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Regional Climate Patterns</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Highlands</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cooler temperatures year-round, more pronounced seasons
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Lowlands</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Warmer, drier climate with less seasonal variation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;