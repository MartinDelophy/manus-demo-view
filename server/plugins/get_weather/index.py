import requests

def get_weather(location, unit="celsius"):
    base_url = "https://api.open-meteo.com/v1/forecast"

    # Set up parameters for the weather API
    params = {
        "latitude": 0,
        "longitude": 0,
        "current_weather": "true",
        "temperature_unit": unit
    }

    # Set up geocoding to convert location name to coordinates
    geocoding_url = "https://geocoding-api.open-meteo.com/v1/search"
    location_parts = location.split(',')
    city = location_parts[0].strip()
    country = location_parts[1].strip() if len(location_parts) > 1 else ""

    geo_params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    try:

        geo_response = requests.get(geocoding_url, params=geo_params)
        geo_response.raise_for_status()
        geo_data = geo_response.json()

        # If first attempt fails, try with full location string
        if "results" not in geo_data or not geo_data["results"]:
            geo_params["name"] = location
            geo_response = requests.get(geocoding_url, params=geo_params)
            geo_response.raise_for_status()
            geo_data = geo_response.json()
        # Extract coordinates if found
        if "results" in geo_data and geo_data["results"]:
            params["latitude"] = geo_data["results"][0]["latitude"]
            params["longitude"] = geo_data["results"][0]["longitude"]
        else:
            return f"Sorry, I couldn't find the location: {location}"

        response = requests.get(base_url, params=params)
        response.raise_for_status()
        weather_data = response.json()

        # Extract and format weather information
        if "current_weather" in weather_data:
            current_weather = weather_data["current_weather"]
            temp = current_weather["temperature"]
            wind_speed = current_weather["windspeed"]

            result = f"The current weather in {location} is {temp}°{unit.upper()} with a wind speed of {wind_speed} km/h."
            return result
        else:
            return f"Sorry, I couldn't retrieve weather data for {location}"
    except requests.exceptions.RequestException as e:
        return f"An error occurred while fetching weather data: {str(e)}"
