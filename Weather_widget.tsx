"use client";

import { useState,ChangeEvent, FormEvent } from "react";
import { Card,CardHeader,CardContent,CardTitle,CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon,MapPinIcon,ThermometerIcon } from "lucide-react"

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
    
}
export default function WeatherWidget(){
    const [location, setlocation] = useState<string>("");
    const[weather, setWeather] = useState<WeatherData |null>(null);
    const[error, setError] = useState  <string | null> (null);
    const[Isloading, setIsloading] = useState <boolean>(false)
        
    const weatherSearch =async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault

        const trimLocation =location . trim ()
        if (trimLocation==="") {
            setError ("please  Enter a valid Location");
            setWeather(null);
            return;
        }

        setIsloading(true);
        setError(null);
        try{
            const response = await fetch(
                ` http://api.weatherapi.com/v1/current.json?=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimLocation}`
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const weatherData: WeatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                 unit: "c" 
            }
             setWeather(weatherData);
        }catch(error){
           setError("city not found . please try again")
        }finally{
            setIsloading(false)
        }

        
    }
    function gettemperatureMassege(temperature: number, unit: string)  {
        if (unit === "c") {
         if (temperature < 0) {
            return `It's freezing! at ${temperature}℃! Bandle up!`;
        } else if (temperature < 10) {
            return `It's cold! at ${temperature}℃! Bandle up!`;
        } else if (temperature < 20) {
            return`The tempature is ${temperature}℃ comfortable for a light jacket`;
        }else if (temperature < 30) {
            return`It a perfect temperature of ${temperature}℃`;
        } else if (temperature < 40) {
        }else if (temperature < 50) {
            return`the hot temperature of ${temperature}℃`;
        }
    
        }else{
           return`${temperature}°${unit}`;
        }
    }
      function getWeatherMassege (description: string):string{
      switch(description.toLocaleLowerCase()){
    case "sunny":
        return "It is  hot sunny day";
    
    case " partly cloudy":
        return "It is  beautiful cloudy day";
    case "cloudy":
        return "It is  cloudy day";
    case "overcast":
        return "The sky is overcast";
        case "rain":
            return "It is  rainy day";
    case "thunderstorm":
        return "the thunderstorm expated day";
    case "snow":
        return "It is  snowing day";
    case "mist":
        return "It is  misty day";
    case "fog":
        return "It is  foggy day";
    default:
        return " description not found. please try again";
      }
    }
  function getLocationMassage(location: string):string{
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNight ? " at the night" : " during the day"}`;
}

    
    // function getLocationMassage(location: string): import("react").ReactNode {
    //     throw new Error("Function not implemented.");
    // }

  return (
    
      <div className="flex justify-center items-center h-screen bg-sky-600">
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
            <CardTitle>Weather App</CardTitle>
            <CardDescription>Enter Location for  the current weather condition in your city</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={weatherSearch} className="flex items-center gap-2">
            <Input
                type="text"
                placeholder="Enter  a city name"
                value={location}
                onChange={(e) => setlocation(e.target.value)}
                />
                <Button type="submit" disabled={Isloading}>
                {Isloading? "Isloding...":"Search"}
                </Button>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>};
            {weather && (
                <div className="mt-4 grid gap-2 grid-cols-2 ">
                    <div className="flex items-center gap-2">
                   <ThermometerIcon className="w-6 h-4"/>  
                   {gettemperatureMassege(weather.temperature, weather.unit)}   
                    </div>
                   <div className=" flex items-center gap-2">
                   <CloudIcon className="w-6 h-4"/>
                   {getWeatherMassege(weather.description)}
               </div>
               <div className="flex items-center gap-2">
                 <MapPinIcon className="w-6 h-4" />
                  {getLocationMassage(weather.location)} {/* Corrected the function name */}
</div>
                </div>
            )}
       </CardContent>
        </Card> 
   <img src="https://media.maptiler.com/img/2023_07_12_free_weather_sdk_and_api_for_web_maps_and_apps_1_e7ee42b54f.png" className="w-2/4 h-2/2  object-cover" /> 
   {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPUqi41CM-NMMuQBSk5MbskBOVI7_5_GY5lQ&s" alt="weather" className="w-2/4 h-2/2 object-cover" /> */}
    {/* <img src="https://thumbs.dreamstime.com/b/closeup-delicate-wispy-texture-cotton-candy-pink-clouds-painted-across-velvet-evening-sky-316678652.jp" ></img>  */}
      </div>
  )   
}
