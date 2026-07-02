# Compass

A trip itinerary builder that build a trip plan day by day which is powered by Gemini - travel the way you want.



## Key Features

- **Gemini** - day by day plan build with the gemini 2.5 flash model.
- **Smart destination search** - real-time autocomplete using openstreetmap nominatim.
- **Map** - Using the leaflet.js with day colored pins and the routes b/w stops.
- **Live weather** - 5-day of forcast stripes per day, powered by the one and only openweathermap.
- **Plans** - pick you budget, travel style and where u wanna goo and lastly interest to shape the trip route.
- **Loading state** - skeleton UI, live destination map pre-view and rotating status.



## Tech behind This 

- **Venilla HTML / CSS and JS**
- **Vite**
- **Leaflet.js**
- **Gemini 2.5 flash API key**
- **OpenWeatherMap API key**
- **Nominatim**

## visit
[Compass - Tavel the way you want](https://compass-delta-three.vercel.app/)

## How to Use This Shit

```bash
# Clone this repository
$ git clone https://github.com/baishnabikumari/Compass

# Go into the repository
$ cd Compass

# Install dependencies
$ npm install

# Add your API keys to .env
$ echo "VITE_GEMINI_KEY=your_gemini_key" >> .env
$ echo "VITE_WEATHER_KEY=your_openweathermap_key" >> .env

# Run the app
$ npm run dev
```

## Credits To

This project uses:

- [Vite](https://vitejs.dev/)
- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/) & [Nominatim](https://nominatim.org/)
- [Google Gemini](https://ai.google.dev/)
- [OpenWeatherMap](https://openweathermap.org/)
- [Inter](https://rsms.me/inter/) font

Built for the [HackClub Off-Track YSWS](https://offtrack.hackclub.com/)

Thanks You - Baishu 