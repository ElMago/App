import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, MapPinOff, Plus, Trash2, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
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

const GoodPOIIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const BadPOIIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #EF4444; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
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
  const { data, addPOI, deletePOI } = useTruckerContext();
  const currentTrip = data.trips.find(t => t.id === data.currentTripId);

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const [tripCoords, setTripCoords] = useState<{start: [number, number] | null, end: [number, number] | null}>({ start: null, end: null });

  // POI Form State
  const [showPOIForm, setShowPOIForm] = useState(false);
  const [poiName, setPoiName] = useState('');
  const [poiNotes, setPoiNotes] = useState('');
  const [poiRating, setPoiRating] = useState<'good' | 'bad'>('good');
  const [poiCountry, setPoiCountry] = useState('ES');
  const [poiTown, setPoiTown] = useState('');

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

  const handleAddPOI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poiName || !poiTown) return alert('Por favor rellena el nombre y ciudad.');

    setLoading(true);
    const coords = await geocodeTown(poiTown, poiCountry);
    setLoading(false);

    if (!coords) {
      alert('No se pudo encontrar la ciudad. Intenta con otro nombre.');
      return;
    }

    addPOI({
      name: poiName,
      notes: poiNotes,
      rating: poiRating,
      lat: coords[0],
      lng: coords[1]
    });

    setPoiName('');
    setPoiNotes('');
    setPoiTown('');
    setShowPOIForm(false);
    setPosition(coords); // Move map to new POI
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center z-[1000] relative">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Mapa Interactivo</h2>
          <p className="text-xs text-gray-500">Rutas, descansos y lugares guardados</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPOIForm(!showPOIForm)}
            className={`p-2 rounded-full transition-colors ${showPOIForm ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {showPOIForm ? <MapPinOff size={20}/> : <MapPin size={20}/>}
          </button>
          <button
            onClick={locateUser}
            disabled={loading}
            className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 disabled:opacity-50"
          >
            <Navigation size={20} className={loading ? 'animate-pulse' : ''} />
          </button>
        </div>
      </div>

      {showPOIForm && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 z-[1000] relative">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center"><Star className="mr-2 text-yellow-500" size={18}/> Guardar Lugar de Interés</h3>
          <form onSubmit={handleAddPOI} className="space-y-3">
            <div>
              <input value={poiName} onChange={e => setPoiName(e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder="Nombre del lugar (Ej: Restaurante Paco)" required />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input value={poiCountry} onChange={e => setPoiCountry(e.target.value)} className="col-span-1 p-2 border rounded-lg text-sm" placeholder="ES" required />
              <input value={poiTown} onChange={e => setPoiTown(e.target.value)} className="col-span-2 p-2 border rounded-lg text-sm" placeholder="Ciudad / Pueblo" required />
            </div>
            <div>
              <input value={poiNotes} onChange={e => setPoiNotes(e.target.value)} className="w-full p-2 border rounded-lg text-sm" placeholder="Tu experiencia o notas..." />
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setPoiRating('good')} className={`flex-1 p-2 rounded-lg text-sm font-medium flex items-center justify-center border ${poiRating === 'good' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                <ThumbsUp size={16} className="mr-1"/> Bueno
              </button>
              <button type="button" onClick={() => setPoiRating('bad')} className={`flex-1 p-2 rounded-lg text-sm font-medium flex items-center justify-center border ${poiRating === 'bad' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                <ThumbsDown size={16} className="mr-1"/> Malo
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center">
              <Plus size={18} className="mr-1"/> Añadir al Mapa
            </button>
          </form>
        </div>
      )}

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

          {data.pois?.map(poi => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={poi.rating === 'good' ? GoodPOIIcon : BadPOIIcon}>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-sm mb-1">{poi.name}</h3>
                  <div className={`flex items-center text-xs font-medium mb-2 ${poi.rating === 'good' ? 'text-green-600' : 'text-red-600'}`}>
                    {poi.rating === 'good' ? <ThumbsUp size={12} className="mr-1"/> : <ThumbsDown size={12} className="mr-1"/>}
                    {poi.rating === 'good' ? 'Sitio Recomendado' : 'Sitio a Evitar'}
                  </div>
                  {poi.notes && <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded mb-2">{poi.notes}</p>}
                  <button onClick={() => deletePOI(poi.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center mt-2">
                    <Trash2 size={12} className="mr-1"/> Eliminar lugar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
