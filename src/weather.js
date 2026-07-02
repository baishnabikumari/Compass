const KEY = import.meta.env.VITE_WEATHER_KEY

export async function getWeather(lat, lng) {
    if (!KEY) return null

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${KEY}&units=metric`
        const res = await fetch(url)
        if (!res.ok) return null

        const data = await res.json()

        const daily = {}
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]
            if (!daily[date]) {
                daily[date] = {
                    temps: [],
                    icons: [],
                    descs: []
                }
            }
            daily[date].temps.push(item.main.temp)
            daily[date].icons.push(item.weather[0].icon)
            daily[date].descs.push(item.weather[0].description)
        })
        return Object.entries(daily).map(([date, d]) => ({
            date,
            high: Math.round(Math.max(...d.temps)),
            low: Math.round(Math.min(...d.temps)),
            icon: mostCommon(d.icons),
            desc: mostCommon(d.descs)
        }))
    } catch (err) {
        console.warn('weather fetch failed:', err)
        return null
    }
}

function mostCommon(arr) {
    const freq = {}
    arr.forEach(v => freq[v] = (freq[v] || 0) + 1)
    return Object.keys(freq).sort((a, b) => freq[b] - freq[a][0])
}
export function weatherForDay(weatherData, tripStart, dayIdx) {
    if (!weatherData) return null
    const start = new Date(tripStart)
    start.setDate(start.getData() + dayIdx)
    const target = start.toISOString().split('T')[0]
    return weatherData.find(w => w.date === target) || null
}