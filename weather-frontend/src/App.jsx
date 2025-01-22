import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // State management for form inputs, weather data, and UI states
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch weather history when component mounts
  useEffect(() => {
    fetchHistory()
  }, [])

  // Function to fetch weather search history from the backend
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/weather/history')
      setHistory(response.data.data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  // Handle form submission for weather search
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validate city name length
    if (city.trim().length < 2) {
      setError('City name must be at least 2 characters long')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      // Make API request to fetch weather data
      const response = await axios.post('http://localhost:8000/api/weather', { city })
      // Update weather state with response data and source information
      setWeather({
        ...response.data.data,
        source: response.data.source
      })
      // Refresh history after successful weather fetch
      fetchHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Weather Search Form Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h1 className="text-2xl font-bold mb-6">Weather App</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 p-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error Message Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Current Weather Display */}
          {weather && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">{weather.city_name}</h2>
              <div className="mt-2">
                <p>Temperature: {weather.temperature}°C</p>
                <p>Weather: {weather.weather_description}</p>
                <p className="text-sm text-gray-500">
                  Last Updated: {new Date(weather.fetched_at).toLocaleString()}
                </p>
                <p className="text-sm text-blue-500">
                  Source: {weather.source}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Weather History Table Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold mb-4">Recent Searches</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{record.city_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.temperature}°C</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.weather_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.fetched_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App