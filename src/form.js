import { INTERESTS, BUDGETS, STYLES } from './constants'

let picked ={
    dest: null,
    startDate: '',
    endDate: '',
    budget: 'mid-range',
    interests: [],
    style: 'solo',
    area: ''
}

export function renderForm(container, onSubmit){
    container.innerHTML = `
        <div class="form-page">
            <header class="form-header">
                <h1>Compass</h1>
                <p>where to next?</p>
            </header>
            
            <form id="trip-form" class="trip-form">
                <div class="field">
                    <label for="dest">destination</label>
                    <div class="search-wrap">
                        <input type="text" id="dest" placeholder="try tokyo, paris, bali, india..." autocomplete="off" />
                        <ul id="suggestions" class="suggestions"></ul>
                    </div>
                </div>
                
                <div class="field-row">
                    <div class="field">
                        <label for="start">from</label>
                        <input type="date" id="start" />
                    </div>
                    <div class="field">
                        <label for="end">to</label>
                        <input type="date" id="end" />
                    </div>
                </div>
                
                <div class="field">
                    <label>budget</label>
                    <div class="pill-group" id="budget-pills">
                        ${BUDGETS.map(b => `
                            <button type="button" class="pill ${b === picked.budget ? 'active' : ''}" data-val="${b}">${b}</button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="field">
                    <label>interests</label>
                    <div class="chip-group" id="interest-chips">
                        ${INTERESTS.map(i => `
                            <button type="button" class="chip" data-val="${i}">${i}</button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="field">
                    <label>travel style</label>
                    <div class="pill-group" id="style-pills">
                        ${STYLES.map(s => `
                            <button type="button" class="pill ${s === picked.style ? 'active' : ''}" data-val="${s}">${s}</button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="field">
                    <label for="area">staying near <span class="optional">(optional)</span></label>
                    <input type="text" id="area" placeholder="shinjuku, downtown, old town..." />
                </div>
                
                <button type="submit" class="btn-go" id="btn-go" disabled>plan my trip</button>
            </form>
        </div>
    `
    wire(onSubmit)
}

function wire(onSubmit){
    const form = document.getElementById('trip-form')
    const destInput = document.getElementById('dest')
    const sugList = document.getElementById('suggestions')
    const startInput = document.getElementById('start')
    const endInput = document.getElementById('end')
    const areaInput = document.getElementById('area')
    const btn = document.getElementById('btn-go')

    // search for destinatio
    let debounce = null
    destInput.addEventListener('input', () => {
        clearTimeout(debounce)
        const q = destInput.value.trim()
        console.log('trying:', q)
        if (q.length < 2) { sugList.innerHTML = ''; return}

        debounce = setTimeout(() => searchPlaces(q, sugList, destInput), 350)
    })

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrap')) sugList.innerHTML = ''
    })
    const today = new Date().toISOString().split('T')[0]
    startInput.min = today
    endInput.min = today

    startInput.addEventListener('change', () => {
        picked.startDate = startInput.value
        endInput.min = startInput.value
        checkReady(btn)
    })
    endInput.addEventListener('change', () => {
        picked.endDate = endInput.value
        checkReady(btn)
    })
    document.getElementById('budget-pills').addEventListener('click', (e) => {
        const pill = e.target.closest('.pill')
        if(!pill) return
        document.querySelectorAll('#budget-pills .pill').forEach(p => p.classList.remove('active'))
        pill.classList.add('active')
        picked.budget = pill.dataset.val
    })
    document.getElementById('interest-chips').addEventListener('click', (e) => {
        const chip = e.target.closest('.chip')
        if(!chip) return
        chip.classList.toggle('active')
        const val = chip.dataset.val
        if(picked.interests.includes(val)){
            picked.interests = picked.interests.filter(i => i !== val)
        } else {
            picked.interests.push(val)
        }
        checkReady(btn)
    })

    document.getElementById('style-pills').addEventListener('click', (e) => {
        const pill = e.target.closest('.pill')
        if (!pill) return
        document.querySelectorAll('#style-pills .pill').forEach(p => p.classList.remove('active'))
        pill.classList.add('active')
        picked.style = pill.dataset.val
    })
    areaInput.addEventListener('input', () => {
        picked.area = areaInput.value.trim()
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        if(!isReady()) return
        const ms = new Date(picked.endDate) - new Date(picked.startDate)
        const days = Math.ceil(ms / 86400000) + 1
        onSubmit({ ...picked, days })
    })
}
async function searchPlaces(q, list, input){
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`
        const res = await fetch(url, {
            headers: {'Accept-Language': 'en'}
        })
        const data = await res.json()
        if (!data.length) {list.innerHTML = ''; return}

        list.innerHTML = data.map(p => `
            <li class="sug-item" data-name="${p.display_name.split(',')[0]}" data-lat="${p.lat}" data-lng="${p.lon}">
                ${p.display_name}
            </li>
        `).join('')

        list.querySelectorAll('.sug-item').forEach(item => {
            item.addEventListener('click', () => {
                picked.dest = {
                    name: item.dataset.name,
                    lat: parseFloat(item.dataset.lat),
                    lng: parseFloat(item.dataset.lng)
                }
                input.value = item.dataset.name
                list.innerHTML = ''
                checkReady(document.getElementById('btn-go'))
            })
        })
    } catch (err){
        console.warn('nominatim hiccup:', err)
    }
}

function isReady(){
    return picked.dest && picked.startDate && picked.endDate && picked.interests.length > 0
}

function checkReady(btn){
    btn.disabled = !isReady()
}