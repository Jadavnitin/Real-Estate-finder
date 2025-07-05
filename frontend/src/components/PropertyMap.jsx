import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PropertyMap = ({ properties }) => {


  return (
    <div className="min-h-screen bg-slate-50">


      <div className="max-w-7xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Property Map View</h2>
        <div className="w-full h-[500px] rounded-xl overflow-hidden">
          <MapContainer center={[28.6139, 77.209]} zoom={11} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map((prop) => {
              const lat = prop.coordinates?.latitude;
              const lng = prop.coordinates?.longitude;

              if (lat == null || lng == null) return null;

              return (
                <Marker key={prop._id || prop.id} position={[lat, lng]}>
                  <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent={false}>
                    <div className="w-56">
                      <img
                        src={`http://localhost:5000/uploads/${prop.propertyImage.filename}`}
                        alt={prop.propertyName}
                        className="h-32 w-full object-cover rounded-md mb-2 shadow-lg"
                      />
                      <h3 className="text-base font-semibold text-indigo-700">{prop.propertyName}</h3>
                      <p className="text-sm text-slate-600">{prop.address}</p>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}

          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
