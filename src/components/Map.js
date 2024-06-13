// src/components/Map.js
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import shipIconUrl from './icons/ship.avif'; // Ship icon path
import flightIconUrl from './icons/flight.avif'; // Flight icon path

const Map = ({ sourceCoords, destinationCoords, transportMode }) => {
  const mapRef = React.useRef();

  React.useEffect(() => {
    if (mapRef.current && sourceCoords && destinationCoords) {
      const map = mapRef.current;

      // Clear existing layers
      map.eachLayer((layer) => {
        if (layer._url === undefined) {
          map.removeLayer(layer);
        }
      });

      // Define the ship route directly from Port of Hamburg to Seaport Manhattan
      const shipRouteToNewYork = [
        sourceCoords,
        [55.0, 8.0], // North Sea waypoint
        [50.961094, 1.382225],
        //[53.0, -15.0], // North Atlantic waypoint
        [41.0, -40.0], // Mid Atlantic waypoint
        [39.0, -70.0], // West Atlantic waypoint
        [40.7033, -74.0170], // Seaport Manhattan
        destinationCoords
      ];

      // Define the ship route directly from Port of Hamburg to Victoria Harbour
      const shipRouteToHongKong = [
        sourceCoords,
        [55.0, 8.0], // North Sea waypoint
        //[50.0, -20.0], // North Atlantic waypoint
        [50.961094, 1.382225],
        //[40.0, -30.0], // Mid Atlantic waypoint
        [30.0, -40.0], // South Atlantic waypoint
        [0.0, -30.0], // Equatorial waypoint
       
        [-36.591145, 22.655327],
        [-27.098874, 48.095299],
        [6.343860, 95.263891],
        [7.093157, 96.862318],
        [2.748846, 101.012662],
        //[0.0, 90.0], // Indian Ocean waypoint
        [0.0, 105.0], // South China Sea waypoint
        [22.3193, 114.1694], // Victoria Harbour
        destinationCoords
      ];

      // Define the ship route directly from Port of Hamburg to Spurn Heritage Coast
      const shipRouteToSpurnHeritageCoast = [
        sourceCoords,
        [53.7162, 0.1612], // North Sea waypoint
        destinationCoords
      ];

      // Create air route directly between source and destination
      const airRoute = [sourceCoords, destinationCoords];

      // Choose the appropriate route based on the transport mode and destination
      let route = airRoute; // Default to air route if no specific ship route is matched

      if (transportMode === 'ship') {
        if (destinationCoords[0] === 40.7033 && destinationCoords[1] === -74.0170) {
          route = shipRouteToNewYork;
        } else if (destinationCoords[0] === 22.3193 && destinationCoords[1] === 114.1694) {
          route = shipRouteToHongKong;
        } else if (destinationCoords[0] === 53.7162 && destinationCoords[1] === 0.1612) {
          route = shipRouteToSpurnHeritageCoast;
        }
        // Add additional ship routes here if needed
      }

      // Ensure route is always an array of coordinates
      if (!Array.isArray(route)) {
        route = airRoute; // Fallback to air route if route is not valid
      }

      // Add markers for source and destination
      const shipIcon = new L.Icon({
        iconUrl: shipIconUrl,
        iconSize: [32, 32], // Size of the icon
      });

      const flightIcon = new L.Icon({
        iconUrl: flightIconUrl,
        iconSize: [32, 32], // Size of the icon
      });

      const icon = transportMode === 'ship' ? shipIcon : flightIcon;

      L.marker(sourceCoords, { icon }).addTo(map);
      L.marker(destinationCoords, { icon }).addTo(map);

      // Add routing layer if route is defined and has valid coordinates
      if (route.length > 1) {
        L.polyline(route, { color: 'blue', weight: 4 }).addTo(map);

        // Fit the map to the route bounds
        const bounds = L.latLngBounds(route);
        map.fitBounds(bounds);
      } else {
        console.warn('Invalid route:', route);
      }
    }
  }, [sourceCoords, destinationCoords, transportMode]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: '400px', width: '100%' }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default Map;
