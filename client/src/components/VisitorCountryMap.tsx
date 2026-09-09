import { MapView } from "@/components/Map";
import { getVisitorCountryName } from "@/lib/visitorAnalytics";

export type VisitorCountryMapPoint = { countryCode: string; views: number };

const countryCentroids: Record<string, google.maps.LatLngLiteral> = {
  AR: { lat: -38.4, lng: -63.6 }, AU: { lat: -25.3, lng: 133.8 }, BR: { lat: -10.8, lng: -51.9 }, CA: { lat: 56.1, lng: -106.3 }, CN: { lat: 35.9, lng: 104.2 }, DE: { lat: 51.2, lng: 10.5 }, ES: { lat: 40.5, lng: -3.7 }, FR: { lat: 46.2, lng: 2.2 }, GB: { lat: 55.4, lng: -3.4 }, IN: { lat: 20.6, lng: 78.9 }, IT: { lat: 41.9, lng: 12.6 }, JP: { lat: 36.2, lng: 138.3 }, MX: { lat: 23.6, lng: -102.6 }, NL: { lat: 52.1, lng: 5.3 }, SG: { lat: 1.35, lng: 103.8 }, ZA: { lat: -30.6, lng: 22.9 }, US: { lat: 37.1, lng: -95.7 }, AE: { lat: 24.0, lng: 53.8 }, CH: { lat: 46.8, lng: 8.2 }, SE: { lat: 60.1, lng: 18.6 },
};

export function VisitorCountryMap({ points }: { points: VisitorCountryMapPoint[] }) {
  if (!points.length) {
    return <div className="grid h-[360px] place-items-center rounded-2xl border border-dashed border-white/10 bg-[#081123] text-center"><div><p className="text-sm font-semibold text-slate-300">No country data available yet.</p><p className="mt-1 text-xs text-slate-500">The map will populate when trusted country headers are supplied.</p></div></div>;
  }

  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#081123]" aria-label="Interactive visitor countries map"><MapView key={points.map((point) => `${point.countryCode}:${point.views}`).join(",")} className="h-[360px]" initialCenter={{ lat: 20, lng: 0 }} initialZoom={2} onMapReady={(map) => {
    const maxViews = Math.max(...points.map((point) => point.views), 1);
    points.forEach((point) => {
      const position = countryCentroids[point.countryCode];
      if (!position || !window.google?.maps?.marker?.AdvancedMarkerElement) return;
      const marker = new window.google.maps.marker.AdvancedMarkerElement({ map, position, title: `${getVisitorCountryName(point.countryCode)} · ${point.views} page views` });
      marker.addListener("click", () => {
        const infoWindow = new window.google.maps.InfoWindow({ content: `<strong>${getVisitorCountryName(point.countryCode)}</strong><br />${point.views.toLocaleString()} page views` });
        infoWindow.open({ map, anchor: marker });
      });
      const scale = 0.8 + point.views / maxViews;
      const markerElement = document.createElement("div");
      markerElement.className = "rounded-full border-2 border-cyan-100 bg-cyan-300/80";
      markerElement.style.width = `${Math.round(14 * scale)}px`;
      markerElement.style.height = `${Math.round(14 * scale)}px`;
      markerElement.style.boxShadow = `0 0 ${Math.round(10 * scale)}px rgba(103,232,249,.7)`;
      marker.content = markerElement;
    });
  }} /></div>;
}
