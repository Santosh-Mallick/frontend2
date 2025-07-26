import React, { useEffect, useState } from "react";

const LocationManager = () => {
  const [location, setLocation] = useState(null);

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
        (error) => {
          console.error("Permission denied or error:", error.message);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  const getCityState = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Ensure you have this in your .env file
    console.log("Api Key:", apiKey); // Debugging line to check if the API key is loaded correctly
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const components = data.results[0].address_components;

        const city = components.find(c => c.types.includes("locality"))?.long_name;
        const state = components.find(c => c.types.includes("administrative_area_level_1"))?.long_name;

        console.log("City:", city || "N/A");
        console.log("State:", state || "N/A");
      } else {
        console.error("Geocoding failed:", data.status);
      }
    } catch (err) {
      console.error("Error fetching geocode data:", err);
    }
  };

  return (
    <div>
      {location ? (
        <p>
          📍 Location detected. Lat: {location.lat.toFixed(4)}, Lng:{" "}
          {location.lng.toFixed(4)}
        </p>
      ) : (
        <p>⏳ Detecting location...</p>
      )}
    </div>
  );
};

export default LocationManager;
