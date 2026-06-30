import './style.css'
import { renderForm } from './form.js'

const app = document.getElementById('app')
function init(){
    renderForm(app, handleSubmit)
}
function handleSubmit(trip){
    console.log('trip data:', trip)
}
init()