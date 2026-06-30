import './style.css'
import { renderForm } from './form.js'
import { genItinerary } from './gemini.js'

const app = document.getElementById('app')
function init(){
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
        console.log('itinerary:', plan)
    } catch (err){
        console.error('gemini failed:', err)
        app.innerHTML = `
            <div class="loading-page">
                <h2>something went wrong</h2>
                <p>${err.message}</p>
                <button class="btn-go" onclick="location.reload()">try again</button>
        `
    }
}

init()