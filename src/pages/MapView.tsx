import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Coffee, Bed, MapPin } from 'lucide-react';
import { useTruckerContext } from '../context/TruckerContext';
import axios from 'axios';

// Fix for Leaflet icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const StartIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #10B981; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold; font-size: 12px;">A</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const EndIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #EF4444; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold; font-size: 12px;">B</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Helper for geocoding
const geocodeTown = async (town: string, country: string): Promise<[number, number] | null> => {
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search?city=${town}&country=${country}&format=json&limit=1`);
    if (res.data && res.data.length > 0) {
      return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error("Geocoding error", error);
    return null;
  }
};

// Mock data for rest areas
const mockRestAreas = [
  { id: 1, name: 'Área de Servicio La Jonquera', lat: 42.4167, lng: 2.8667, type: 'full', services: ['Parking', 'Duchas', 'Restaurante', 'Wifi'] },
  { id: 2, name: 'Descanso Monegros', lat: 41.5167, lng: -0.1667, type: 'basic', services: ['Parking', 'WC'] },
  { id: 3, name: 'Truck Stop Vitoria', lat: 42.85, lng: -2.6833, type: 'full', services: ['Parking vigilado', 'Duchas', 'Comedor', 'Lavadero'] },
];

function LocationMarker({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  );
}

export default function MapView() {
  const { data } = useTruckerContext();
  const currentTrip = data.trips.find(t => t.id === data.currentTripId);

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const [tripCoords, setTripCoords] = useState<{start: [number, number] | null, end: [number, number] | null}>({ start: null, end: null });

  useEffect(() => {
    const fetchTripCoords = async () => {
      if (currentTrip) {
        const start = await geocodeTown(currentTrip.startLocation.town, currentTrip.startLocation.country);
        let end = null;
        if (currentTrip.endLocation) {
          end = await geocodeTown(currentTrip.endLocation.town, currentTrip.endLocation.country);
        }
        setTripCoords({ start, end });
      } else {
        setTripCoords({ start: null, end: null });
      }
    };
    fetchTripCoords();
  }, [currentTrip]);

  const locateUser = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          alert('No se pudo obtener la ubicación. Usando ubicación por defecto (Madrid).');
          setPosition([40.4168, -3.7038]); // Default to Madrid
          setLoading(false);
        }
      );
    } else {
      alert('Geolocalización no soportada');
      setPosition([40.4168, -3.7038]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    locateUser();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex justify-between items-center z-[1000] relative">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Mapa y Descansos</h2>
          <p className="text-xs text-gray-500">Encuentra áreas de servicio cercanas</p>
        </div>
        <button
          onClick={locateUser}
          disabled={loading}
          className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 disabled:opacity-50"
        >
          <Navigation size={20} className={loading ? 'animate-pulse' : ''} />
        </button>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
        <MapContainer
          center={position || [40.4168, -3.7038]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker position={position} />

          {tripCoords.start && (
            <Marker position={tripCoords.start} icon={StartIcon}>
              <Popup>
                Origen: {currentTrip?.startLocation.town}
              </Popup>
            </Marker>
          )}

          {tripCoords.end && (
            <Marker position={tripCoords.end} icon={EndIcon}>
              <Popup>
                Destino Previsto: {currentTrip?.endLocation?.town}
              </Popup>
            </Marker>
          )}

          {tripCoords.start && tripCoords.end && (
            <Polyline positions={[tripCoords.start, tripCoords.end]} color="blue" dashArray="5, 10" />
          )}

          {mockRestAreas.map(area => (
            <Marker key={area.id} position={[area.lat, area.lng]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm mb-1">{area.name}</h3>
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    {area.type === 'full' ? <Bed size={12} className="mr-1 text-green-600"/> : <Coffee size={12} className="mr-1 text-orange-500"/>}
                    {area.type === 'full' ? 'Servicios Completos' : 'Descanso Básico'}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {area.services.map(s => (
                      <span key={s} className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-700">{s}</span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h3 className="text-sm font-bold mb-2 flex items-center"><MapPin size={16} className="mr-1 text-purple-600"/> Lugares de Interés para el Paseo</h3>
         <p className="text-xs text-gray-600">Cuando bajes del camión, registra tus paseos desde la pantalla de Inicio. El mapa guardará tus rutas a pie en futuras actualizaciones.</p>
      </div>
    </div>
  );
}
