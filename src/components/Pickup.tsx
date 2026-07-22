import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { useAuthGate } from "./AuthGate";
import { SectionTag } from "./SectionTag";
import { CareHand, IconCheck, IconPin } from "./icons";
import "./Pickup.scss";

const TASHKENT: [number, number] = [41.3111, 69.2797];

const pinIcon = L.divIcon({
  className: "pickup__pin-icon",
  html: `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#0b2e33" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" fill="#d3ab5c"/><circle cx="12" cy="10" r="2.5" fill="#0b2e33"/></svg>`,
  iconSize: [38, 38],
  iconAnchor: [19, 36],
});

export function Pickup() {
  const { t, lang } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const { guard, gate } = useAuthGate();

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [noCall, setNoCall] = useState(true);
  const [sent, setSent] = useState(false);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const langParam = lang === "ru" ? "ru" : "uz";
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=${langParam}`,
        { headers: { Accept: "application/json" } },
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name.split(",").slice(0, 3).join(",").trim());
      }
    } catch {
      /* offline / rate limited — user can type the address manually */
    }
  };

  const placeMarker = (lat: number, lon: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lon], { icon: pinIcon, draggable: true }).addTo(map);
      markerRef.current.on("dragend", () => {
        const p = markerRef.current!.getLatLng();
        setCoords([p.lat, p.lng]);
        reverseGeocode(p.lat, p.lng);
      });
    } else {
      markerRef.current.setLatLng([lat, lon]);
    }
    setCoords([lat, lon]);
    reverseGeocode(lat, lon);
  };

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { zoomControl: true }).setView(TASHKENT, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => placeMarker(e.latlng.lat, e.latlng.lng));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.setView([latitude, longitude], 16);
        placeMarker(latitude, longitude);
      },
      () => {
        /* permission denied — user can click the map instead */
      },
    );
  };

  const callCourier = () => {
    guard(() => setSent(true));
  };

  const fields = [
    { label: t.pickup.door, value: t.pickup.doorV },
    { label: t.pickup.intercom, value: t.pickup.intercomV },
    { label: t.pickup.floor, value: t.pickup.floorV },
    { label: t.pickup.entrance, value: t.pickup.entranceV },
  ];

  return (
    <section className="section" id="pickup">
      <div className="container">
        <div className="section-head">
          <SectionTag num="03" label={t.module} icon={<CareHand size={18} />} />
          <h2>{t.pickup.title}</h2>
          <p>{t.pickup.lead}</p>
        </div>

        <div className="pickup reveal" ref={ref}>
          {/* real map */}
          <div className="pickup__map-wrap">
            <div className="pickup__map" ref={mapEl} />
            <button className="pickup__locate" onClick={locateMe}>
              <IconPin size={16} />
              {t.pickup.myLocation}
            </button>
            <p className="pickup__map-hint">{t.pickup.mapHint}</p>
          </div>

          {/* form */}
          <div className="pickup__form">
            <label className="pickup__address-field">
              <span className="pickup__field-label pickup__field-label--icon">
                <IconPin size={13} />
                {t.pickup.addressLabel}
              </span>
              <input
                type="text"
                placeholder={t.pickup.addressPh}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {coords && (
                <span className="pickup__coords mono">
                  {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
                </span>
              )}
            </label>

            <div className="pickup__fields">
              {fields.map((f) => (
                <label key={f.label} className="pickup__field">
                  <span className="pickup__field-label">{f.label}</span>
                  <input className="pickup__field-value mono" defaultValue={f.value} />
                </label>
              ))}
            </div>

            <button
              className={`pickup__toggle ${noCall ? "is-on" : ""}`}
              role="switch"
              aria-checked={noCall}
              onClick={() => setNoCall(!noCall)}
            >
              <span className="pickup__toggle-track">
                <span className="pickup__toggle-thumb" />
              </span>
              {t.pickup.noCall}
            </button>

            <label className="pickup__note">
              <span className="pickup__field-label">{t.pickup.note}</span>
              <input type="text" placeholder={t.pickup.notePlaceholder} />
            </label>

            {sent ? (
              <p className="pickup__success">
                <IconCheck size={18} />
                {t.pickup.success}
              </p>
            ) : (
              <button className="btn btn--primary pickup__call" onClick={callCourier}>
                {t.pickup.call}
              </button>
            )}
            {!sent && <p className="pickup__eta mono">{t.pickup.eta}</p>}
          </div>
        </div>
      </div>
      {gate}
    </section>
  );
}
