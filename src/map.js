import L from 'leaflet'
import { DAY_COLORS, TILES, TILE_ATTR } from './constants.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

let map = null
let markers = []
let routeLine = null

function makeIcon(color){
    return L.divIcon({
        className: 'map-pin',
        html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [14,14],
        iconAnchor: [7,7],
        popupAnchor: [0,-10]
    })
}

export function initMap(containerId, plan, startIdx = 0){
    const el = document.getElementById(containerId)
    if(!el) return

    map = L.map(el, {zoomControl: false})
    L.tileLayer(TILES, { attribution: TILE_ATTR }).addTo(map)

    // zoom
    L.control.zoom({ position: 'topright' }).addTo(map)
    showDay(plan, startIdx)

    window.addEventListener('daychange', (e) => {
        showDay(plan, e.detail.idx)
    })
}

function showDay(plan, idx){
    markers.forEach(m => map.removeLayer(m))
    markers = []
    if(routeLine) map.removeLayer(routeLine)
    
    const day = plan.days[idx]
    if(!day || !day.activities.length) return

    const clr = DAY_COLORS[idx % DAY_COLORS.length]
    const coords = []

    day.activities.forEach(a => {
        const lat = parseFloat(a.lat)
        const lng = parseFloat(a.lng)
        if (isNaN(lat) || isNaN(lng)) return

        const pos = [lat, lng]
        coords.push(pos)

        const pin = L.marker(pos, { icon: makeIcon(clr) })
            .bindPopup(`<strong>${a.name}</strong><br>${a.desc}<br><em>${a.time}</em>`)
            .addTo(map)
        
        markers.push(pin)
    })

    if (coords.length > 1){
        routeLine = L.polyline(coords, {
            color: clr,
            weight: 2,
            opacity: 0.5,
            dashArray: '6.4'
        }).addTo(map)
    }
    if (coords.length){
        const bounds = L.latLngBounds(coords)
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }
}
export function destroyMap(){
    if(map){
        map.remove()
        map = null
        markers = []
        routeLine = null
    }
}