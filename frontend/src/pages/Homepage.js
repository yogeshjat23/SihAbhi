/*import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correct marker icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const TunnelCoords = [32.4026, 77.2063];

  // Refined marker positions with more precise coordinates
  const markers = [
    { id: 1, position: [32.3897, 77.1970], label: 'South Portal - Booster Fan 1' },
    { id: 2, position: [32.3980, 77.2020], label: 'Midpoint - Booster Fan 2' },
    { id: 3, position: [32.4050, 77.2100], label: 'Midpoint - Booster Fan 1' },
    { id: 4, position: [32.4026, 77.2063], label: 'Middle Tunnel - Booster Fan 2' },
    { id: 5, position: [32.4178, 77.2273], label: 'North Portal - Booster Fan 1' },
    { id: 6, position: [32.4200, 77.2300], label: 'North Portal - Booster Fan 2' },
  ];
 
  return (
    <MapContainer
      style={{ height: 'calc(100vh - 50px)', width: '100%' }}
      center={TunnelCoords}
      zoom={14}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => {
              if (isAdmin) {
                navigate(`/mqtt/${marker.id}`);
              }
            },
          }}
        >
          <Popup>
            {marker.label}
            {isAdmin ? (
              <button onClick={() => console.log(`Admin clicked marker ${marker.id}`)}>
                View MQTT Data
              </button>
            ) : (
              <span style={{ color: 'red' }}>Access Restricted</span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Homepage;*/

/*
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correct marker icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Homepage = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
 // const isAdmin = location.state?.isAdmin || false;
 const isAdmin = location.state?.isAdmin || true;

  const TunnelCoords = [32.4026, 77.2063];

  // Refined marker positions with more precise coordinates
  const markers = [
    { id: 1, position: [32.3897, 77.1970], label: 'South Portal - Booster Fan 1' },
    { id: 2, position: [32.3980, 77.2020], label: 'Midpoint - Booster Fan 2' },
    { id: 3, position: [32.4050, 77.2100], label: 'Midpoint - Booster Fan 1' },
    { id: 4, position: [32.4026, 77.2063], label: 'Middle Tunnel - Booster Fan 2' },
    { id: 5, position: [32.4178, 77.2273], label: 'North Portal - Booster Fan 1' },
    { id: 6, position: [32.4200, 77.2300], label: 'North Portal - Booster Fan 2' },
  ];

  useEffect(() => {
    return () => {
      // Clean up Leaflet container if needed
      const mapContainer = document.getElementById("map");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }
    };
  }, []);

  const handleMarkerClick = (id) => {
    if (isAdmin) {
      navigate(`/mqtt/${id}`);
    }
  };

  return (
    <MapContainer
      id="map"
      style={{ height: 'calc(100vh - 50px)', width: '100%' }}
      center={TunnelCoords}
      zoom={14}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => handleMarkerClick(marker.id),
          }}
        >
          <Popup>
            {marker.label}
            {isAdmin ? (
              <button onClick={() => console.log(`Admin clicked marker ${marker.id}`)}>
                View MQTT Data
              </button>
            ) : (
              <span style={{ color: 'red' }}>Access Restricted</span>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});

export default Homepage;
*/


import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from './AuthContext';

// Correct marker icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Homepage = React.memo(() => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const TunnelCoords = [32.4026, 77.2063];

  const markers = [
    { id: 1, position: [32.3897, 77.1970], label: 'South Portal - Booster Fan 1' },
    { id: 2, position: [32.3980, 77.2020], label: 'Midpoint - Booster Fan 2' },
    { id: 3, position: [32.4050, 77.2100], label: 'Midpoint - Booster Fan 1' },
    { id: 4, position: [32.4026, 77.2063], label: 'Middle Tunnel - Booster Fan 2' },
    { id: 5, position: [32.4178, 77.2273], label: 'North Portal - Booster Fan 1' },
    { id: 6, position: [32.4200, 77.2300], label: 'North Portal - Booster Fan 2' },
  ];

  useEffect(() => {
    return () => {
      const mapContainer = document.getElementById("map");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }
    };
  }, []);

  const handleMarkerClick = (id) => {
    if (auth.role === 'admin') {
      navigate(`/mqtt/${id}`);
    } else {
      alert('Only admins can access this page.');
    }
  };

  return (
    <MapContainer
      id="map"
      style={{ height: 'calc(100vh - 50px)', width: '100%' }}
      center={TunnelCoords}
      zoom={14}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map(marker => (
        <Marker
          key={marker.id}
          position={marker.position}
          eventHandlers={{
            click: () => handleMarkerClick(marker.id),
          }}
        >
          <Popup>
            {marker.label}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});

export default Homepage;

