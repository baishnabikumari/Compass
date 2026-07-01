import './style.css'
import { renderForm } from './form.js'
import { genItinerary } from './gemini.js'
import { renderItinerary } from './itinerary.js'
import { initMap, destroyMap } from './map.js'

const app = document.getElementById('app')

let lastTrip = null
let lastPlan = null

function init(){
    destroyMap()
    renderForm(app, handleSubmit)
}

async function handleSubmit(trip) {
    app.innerHTML = `
        <div class="loading-page">
            <h2>planning your trip...</h2>
            <p>asking Compass about ${trip.dest.name}</p>
        </div>
    `
    try{
        const plan = await genItinerary(trip)
        lastTrip = trip
        lastPlan = plan
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

function showItinerary(){
    renderItinerary(app, lastPlan, lastTrip, () =>  init())
    setTimeout(() => initMap('map-area', lastPlan, 0), 50)
}

init()