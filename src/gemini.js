const KEY = import.meta.env.VITE_GEMINI_KEY
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`

function buildPrompt(trip){
    const { dest, days, budget, interests, style, area } = trip
    return `You are a travel planner. Create a ${days}-day itinerary for ${dest.name}.

Budget level: ${budget}
Travel style: ${style}
Interests: ${interests.join(', ')}
${area ? `Prefered area to stay: ${area}` : ''}

For Each day, give exactly 3 activities (morning, afternoon, evening).

Keep description very sort.Cost in USD

Respond ONLY with valid JSON, no markdown, no explanation. Use this exact structure:
{
    "days":[
        {
            "day": 1,
            "activities": [
                {
                    "slot": "morning",
                    "name": "Place Name",
                    "desc": "Short 5-8 words description only",
                    "time": "9:00 AM - 11:00 AM",
                    "cost": "0",
                    "category": "nature",
                    "lat": "35.6762",
                    "lng": "139.6503"
                }
            ]
        }
    ]
}`
}

export async function genItinerary(trip){
    const prompt = buildPrompt(trip)

    const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 16400,
                responseMimeType:'application/json'
            }
        })
    })

    if(!res.ok){
        const err = await res.text()
        throw new Error(`gemini ${res.status}: ${err}`)
    }

    const data = await res.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text

    if(!raw) throw new Error('empty response from gemini')
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    return JSON.parse(clean)
}