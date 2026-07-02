import './style.css'
import { renderForm } from './form.js'
import { genItinerary } from './gemini.js'
import { renderItinerary } from './itinerary.js'
import { initMap, destroyMap } from './map.js'
import { getWeather } from './weather.js'
import { setWeather } from './itinerary.js'
import L from 'leaflet'

const app = document.getElementById('app')

let lastTrip = null
let lastPlan = null

let loaderMap = null
let statusTimer = null

function init(){
    destroyMap()
    renderForm(app, handleSubmit)
}

async function handleSubmit(trip) {
    showLoader(trip)
    try{
        const plan = await genItinerary(trip)
        getWeather(trip.dest.lat, trip.dest.lng).then(w => {
            if(w) setWeather(w)
        })
        lastTrip = trip
        lastPlan = plan
        killLoader()
        showItinerary()
    } catch (err){
        console.error('gemini failed:', err)
        app.innerHTML = `
            <div class="loading-page">
                <h2>something went wrong</h2>
                <p>${err.message}</p>
                <button class="btn-go" onclick="location.reload()">try again</button>
            </div>
        `
    }
}

function showLoader(trip){
    const skeletonDays = Array.from({length: trip.days}, (_, i) => `
        <div class="sk-tab"></div>
    `).join('')

    app.innerHTML = `
        <div class="planner">
            <aside class="sidebar">
                <div class="sidebar-head">
                    <span class="back-btn">Back</span>
                    <h2>${trip.dest.name}</h2>
                    <p>${trip.days} days · ${trip.budget} · ${trip.style}</p>
                </div>
                    <div class="day-tabs">${skeletonDays}</div>

                    <div class="day-content">
                        <div class="sk-weather"></div>
                        ${['morning', 'afternoon', 'evening'].map(s => `
                            <div class="sk-slot">
                                <div class="sk-label"></div>
                                <div class="sk-card"></div>
                                <div class="sk-card"></div>
                            </div>
                        `).join('')}
                    </div>
            </aside>
            <div class="map-area" id="loader-map">
                <div class="loader-status">
                    <p class="loader-line" id="loader-line">Picking your spots...</p>
                </div>
            </div>
        </div>
    `

    setTimeout(() => {
        const el = document.getElementById('loader-map')
        if(!el) return

        loaderMap = L.map(el, {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
        }).setView([trip.dest.lat, trip.dest.lng], 11)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(loaderMap)

        const pulse = L.divIcon({
            className: 'pulse-pin',
            html:`<div class="pulse-dot"></div><div class="pulse-ring"></div>`,
            iconSize: [20,20],
            iconAnchor: [10,10]
        })
        L.marker([trip.dest.lat, trip.dest.lng], {icon: pulse}).addTo(loaderMap)
    }, 30)

    const lines = [
        `asking Compass about The ${trip.dest.name}...`,
        `picking spots you will love...`,
        `checking the weather...`,
        `plotting your route...`,
        `almost there...`
    ]
    let i = 0
    const el = document.getElementById('loader-line')
    if(el) el.textContent = lines[0]
    statusTimer = setInterval(() => {
        if(i >= lines.length - 1){
            clearInterval(statusTimer)
            statusTimer = null
            return
        }
        i += 1
        const line = document.getElementById('loader-line')
        if(!line) return
        line.style.opacity = 0
        setTimeout(() => {
            line.textContent = lines[i]
            line.style.opacity = 1
        }, 200)
    }, 2200)
}

function killLoader(){
    if(statusTimer){
        clearInterval(statusTimer)
        statusTimer = null
    }
    if(loaderMap){
        loaderMap.remove()
        loaderMap = null
    }
}

function showItinerary(){
    renderItinerary(app, lastPlan, lastTrip, () =>  init())
    setTimeout(() => initMap('map-area', lastPlan, 0), 50)
}

init()