import { MapPin, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";

const LocationManager = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");

    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setLocation(parsedLocation);
      getCityState(parsedLocation.lat, parsedLocation.lng);
    } else {
      askForLocation();
    }
  }, []);

  const askForLocation = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          localStorage.setItem("userLocation", JSON.stringify(coords));
          setLocation(coords);
          getCityState(coords.lat, coords.lng);
        },
        (err) => {
          console.error("Geolocation error:", err);
          let errorMessage = "Unable to retrieve your location.";
          if (err.code === err.PERMISSION_DENIED) {
            errorMessage = "Location access denied. Please enable it in your browser settings.";
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMessage = "Location information is unavailable.";
          } else if (err.code === err.TIMEOUT) {
            errorMessage = "The request to get user location timed out.";
          }
          setError(errorMessage);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const geoError = "Geolocation is not supported by your browser.";
      console.error(geoError);
      setError(geoError);
      setLoading(false);
    }
  };

  const getCityState = async (lat, lng) => {
    setLoading(true);
    setError(null);
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY; // Ensure you have this in your .env file
    if (!apiKey) {
      const keyError = "OpenCage API key is not configured.";
      console.error(keyError);
      setError(keyError);
      setLoading(false);
      return;
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status.code === 200 && data.results.length > 0) {
        const components = data.results[0].components;
        // console.log(components);
        setCity(components.city || components.town || components.village || "N/A");
        console.log(city);
        setState(components.state || "N/A");
        console.log(state);
        setDistrict(components.state_district || "N/A");
      } else {
        const geoApiError = `Geocoding failed: ${data.status.message || "Unknown error"}`;
        // console.error(geoApiError, data.status);
        setError(geoApiError);
      }
    } catch (err) {
      const fetchError = `Error fetching geocode data: ${err.message}`;
      console.error(fetchError, err);
      setError(fetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleRefetchLocation = () => {
    askForLocation();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-800 rounded-lg shadow-sm w-full">
      <div className="flex items-center gap-2 flex-grow min-w-0">
        <MapPin className="text-blue-600 flex-shrink-0" size={20} />
        {loading && <span className="text-blue-600 truncate">Detecting location...</span>}
        {error && <span className="text-red-600 truncate">Error: {error}</span>}

        {!loading && !error && location ? (
          <span className="font-medium truncate">
            {city !== "N/A" || state !== "N/A"
              ? `${city !== "N/A" ? city : ''}${city !== "N/A" && state !== "N/A" ? ', ' : ''}${state !== "N/A" ? state : ''}`
              : 'Location detected'}
          </span>
        ) : (
          !loading && !error && <span className="text-gray-500 truncate">Location unknown</span>
        )}
      </div>

      <button
        onClick={handleRefetchLocation}
        disabled={loading}
        className={`ml-4 flex-shrink-0 flex items-center gap-1 px-3 py-1 text-sm rounded-md font-medium transition-colors duration-200
          ${loading ? "bg-blue-100 text-blue-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}
        `}
        aria-label={loading ? "Refetching location" : "Refresh location"}
      >
        <RefreshCcw size={16} />
        <span className="hidden sm:inline">{loading ? "..." : "Refresh"}</span> {/* "Refresh" text hidden on small screens */}
      </button>
    </div>
  );
};

export default LocationManager;