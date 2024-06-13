// src/App.js
import 'leaflet/dist/leaflet.css';

import React, { useState } from 'react';
import axios from 'axios';
import PackageForm from './components/PackageForm';
import Map from './components/Map';
import geolib from 'geolib';

const App = () => {
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [transportMode, setTransportMode] = useState('flight');
  const [distance, setDistance] = useState(null);

  const handlePackageSubmit = async (packageData) => {
    console.log('Submitting package data:', packageData);

    try {
      const response = await axios.post('http://localhost:5000/api/packages', packageData);
      console.log('Package Data Saved:', response.data);

      const coordsMap = {
        Heidelberg: { port: [53.5438, 9.9665], airport: [50.0379, 8.5622] }, // Port of Hamburg and Frankfurt Airport
        NewYork: { port: [40.7033, -74.0170], airport: [40.6413, -73.7781] }, // Seaport Manhattan and JFK Airport
        Manchester: { port: [53.4668, -2.2339], airport: [53.3657, -2.2734], heavy: [53.719821, 0.130521] }, // Ports American Inc and Manchester Airport
        HongKong: { port: [22.3193, 114.1694], airport: [22.3080, 113.9185] } // Victoria Harbour and Hong Kong International Airport
      };

      const sourceCoords = packageData.weight > 10 ? coordsMap[packageData.sourceCity]?.port : coordsMap[packageData.sourceCity]?.airport;
      const destinationCoords = packageData.weight > 10 ? coordsMap[packageData.destinationCity]?.port : coordsMap[packageData.destinationCity]?.airport;

      setSourceCoords(sourceCoords);
      setDestinationCoords(destinationCoords);

      // Determine transport mode
      setTransportMode(packageData.weight > 10 ? 'ship' : 'flight');

      // Calculate distance
      const distance = geolib.getDistance(sourceCoords, destinationCoords) / 1000; // Convert to kilometers
      setDistance(distance);
    } catch (error) {
      console.error('Error saving package data:', error);
    }
  };

  return (
    <div>
      <h1>Worldwide Delivery System</h1>
      <PackageForm onPackageSubmit={handlePackageSubmit} />
      {distance && (
        <p>
          {transportMode === 'flight' ? 'Flight' : 'Ship'} distance: {distance.toFixed(2)} kilometers
        </p>
      )}
      <Map sourceCoords={sourceCoords} destinationCoords={destinationCoords} transportMode={transportMode} />
    </div>
  );
};

export default App;
