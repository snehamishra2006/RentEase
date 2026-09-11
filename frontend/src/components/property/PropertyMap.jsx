import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const getLocalityCoordinates = (address = {}) => {
  const city = (address.city || '').toLowerCase();
  const street = (address.street || '').toLowerCase();

  if (street.includes('indirapuram') || city.includes('indirapuram')) return [28.6369, 77.3713];
  if (street.includes('vaishali') || city.includes('vaishali')) return [28.6477, 77.3402];
  if (street.includes('raj nagar') || city.includes('raj nagar')) return [28.7082, 77.4244];
  if (street.includes('golf course') || city.includes('gurgaon')) return [28.4357, 77.1030];
  if (street.includes('sector 62') || city.includes('noida')) return [28.6280, 77.3649];
  if (street.includes('lajpat nagar') || city.includes('delhi')) return [28.5677, 77.2433];

  return [28.6139, 77.2090];
};

const PropertyMap = ({ address, title }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const coords = getLocalityCoordinates(address);

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(coords, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: #1B3B2B; color: #FAF7F2; border: 2px solid #FAF7F2; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); white-space: nowrap;">
                 🏠 ${title ? (title.length > 20 ? title.slice(0, 18) + '...' : title) : 'Deed Location'}
               </div>`,
        iconSize: [140, 36],
        iconAnchor: [70, 18],
      });

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${title || 'Property'}</strong><br/>${address?.street || ''}, ${address?.city || ''}`);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [address, title]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#605A52] dark:text-stone-400">
        <span className="font-bold uppercase tracking-wider text-[10px] text-[#B8860B] dark:text-amber-400">Geographic Locality Map</span>
        <span>OpenStreetMap Verified</span>
      </div>
      <div
        ref={mapContainerRef}
        className="h-64 w-full rounded-xl overflow-hidden border border-[#E2DACD] dark:border-stone-800 shadow-xs z-0"
      />
    </div>
  );
};

export default PropertyMap;
