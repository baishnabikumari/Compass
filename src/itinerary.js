import { DAY_COLORS, SLOTS } from "./constants.js";
export function renderItinerary(container, plan, trip, onBack){
    const { days } = plan

    container.innerHTML= `
        <div class="planner">
            <aside class="sidebar">
                <div class="sidebar-head">
                    <button class="back-btn" id="back-btn"> Back</button>
                    <h2>${trip.dest.name}</h2>
                    <p>${trip.days} days · ${trip.budget} · ${trip.style}</p>
                </div>
                
                <div class="day-tabs" id="day-tabs">
                    ${days.map((d, i) => `
                        <button class="day-tab ${i === 0 ? 'active' : ''}" data-idx="${i}" style="--clr: ${DAY_COLORS[i % DAY_COLORS.length]}">
                            Day ${d.day}
                        </button>
                    `).join('')}
                </div>
                
                <div class="day-content" id="day-content">
                    ${renderDay(days[0], 0)}
                </div>
            </aside>
            
            <div class="map-area" id="map-area"></div>
        </div>
    `
    wireItinerary(days, onBack)
}

function renderDay(day, idx){
    const clr = DAY_COLORS[idx % DAY_COLORS.length]

    const grouped = {}
    SLOTS.forEach(s => grouped[s] = [])
    day.activities.forEach(a => {
        const slot = grouped[a.slot] ? a.slot : 'morning'
        grouped[slot].push(a)
    })
    return SLOTS.map(slot => {
        const acts = grouped[slot]
        if(!acts.length) return ''

        return `
            <div class="slot-block">
                <h4 class="slot-label">${slot}</h4>
                ${acts.map(a => `
                    <div class="activity-card" data-lat="${a.lat}" data-lng="${a.lng}">
                        <div class="act-dot" style="background: ${clr}"></div>
                        <div class="act-body">
                            <h5>${a.name}</h5>
                            <p class="act-desc">${a.desc}</p>
                            <div class="act-meta">
                                <span class="act-time">${a.time}</span>
                                <span class="act-cost">$${a.cost}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `
    }).join('')
}

function wireItinerary(days, onBack){
    const tabs = document.getElementById('day-tabs')
    const content = document.getElementById('day-content')
    const backBtn = document.getElementById('back-btn')

    // switiching days
    tabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.day-tab')
        if(!tab) return

        const idx = parseInt(tab.dataset.idx)

        tabs.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'))
        tab.classList.add('active')
        content.innerHTML = renderDay(days[idx], idx)
        window.dispatchEvent(new CustomEvent('daychange', { detail: { idx } }))
    })
    backBtn.addEventListener('click', () => onBack())
}