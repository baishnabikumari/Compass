export const API = {
    nominatim: 'https://nominatim.openstreetmap.org/search',
    weather: 'https://api.openweathermap.org/data/2.5/forecast',
    currency: 'https://open.er-api.com/v6/latest',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent'
}

export const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
export const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
export const INTERESTS = [
    'street food', 'museums', 'nature', 'nightlife',
    'shopping', 'adventure', 'photography', 'history', 'relaxation'
]
export const BUDGETS = ['backpacker', 'mid-range', 'luxury']
export const STYLES = ['solo', 'couple', 'family', 'group']
export const DAY_COLORS = [
    '#2563EB', '#059669', '#D97706',
    '#E11D48', '#7C3AED', '#0891B2', '#EA580C'
]

export const SLOTS = ['morning', 'afternoon', 'evening']