import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { GeocodingControl } from "@maptiler/geocoding-control/maplibregl";

import "@maptiler/geocoding-control/style.css";
import "maplibre-gl/dist/maplibre-gl.css";

const API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export const LocationPicker = ({ onLocationSelect }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    useEffect(() => {
        if (map.current) return;

        // Initialize map
        map.current = new maplibregl.Map({ 
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
            center: [78.9629, 20.5937],
            zoom: 8,
        });

        // Add geocoding control to enable search
        const geocodingControl = new GeocodingControl({ 
            apiKey: API_KEY,
            maplibregl,
        });
        map.current.addControl(geocodingControl, "top-left");

        // Handle geocoding result
        geocodingControl.on("result", (e) => {
            const [lng, lat] = e.result.center;

            // Set marker
            if (marker.current) {
                marker.current.setLngLat([lng, lat]);
            } else {
                marker.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map.current);
            }

            // Provide back to parent
            onLocationSelect({ lat, lng });
        });

        // Handle click to select location manually
        map.current.on("click", (e) => {
            const { lng, lat } = e.lngLat;

            // Update marker
            if (marker.current) {
                marker.current.setLngLat([lng, lat]);
            } else {
                marker.current = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map.current);
            }

            // Provide back to parent
            onLocationSelect({ lat, lng });
        });
    }, [onLocationSelect]);

    return (
        <div className="flex flex-col gap-2">
            {/* The map itself */}
            <div ref={mapContainer} style={{ width:'100%', height:'300px' }}></div>
        </div>
    );
}