import { Oswald } from "next/font/google";
// Library imports
import axios from "axios";
import { useState, useEffect } from "react";
// Component imports
import CitySearch from "@/components/CitySearch";
// Lib imports
import { changeBackground } from "@/libs/changeBackground";

const oswald = Oswald({ subsets: ["latin"] });

// Declare a type for global props returned by getStaticProps
type globalProps = {
  iconURL: string;
  iconKey: number;
  temp: number;
  weatherText: string;
};

export default function Home() {
  let [location, setLocation] = useState("Amsterdam");
  let [showSpinner, setShowSpinner] = useState(false);

  const [pageProps, setPageProps] = useState<globalProps>({
    iconURL: "",
    iconKey: 12,
    temp: 12,
    weatherText: "",
  });

  async function getProps(location: string) {
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.NEXT_PUBLIC_API_KEY}&q=${location}`
      )
      .then(async (res: any) => {
        // Accuweather API will respond with a success even if the data is empty
        if (res.data.length > 0) {
          console.log(res);
          const locKey = Number(res.data[0].Key);

          // Now we have that we have the location key we can make a specific call for the weather
          const currentWeather = await axios.get(
            `http://dataservice.accuweather.com/currentconditions/v1/${locKey}?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          console.log(currentWeather);
          // If the icon key is less than 10, we add prefix a 0 to match the icon URL
          let prefixNum = "";
          const iconKey = Number(currentWeather.data[0].WeatherIcon);
          if (iconKey < 10) {
            prefixNum = "0";
          }
          //  Get the icon URL
          const iconURL = `https://developer.accuweather.com/sites/default/files/${
            prefixNum + iconKey
          }-s.png`;

          // Get the current weather forecast and the current temparature
          const weatherText = currentWeather.data[0].WeatherText;
          const temp = Math.round(
            Number(currentWeather.data[0].Temperature.Metric.Value)
          );
          setShowSpinner(false);
          setPageProps({
            iconURL: iconURL,
            iconKey: iconKey,
            temp: temp,
            weatherText: weatherText,
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
        // throw error;
      });
  }
  useEffect(() => {
    getProps(location);
  }, [location]);

  const searchForLoc = (value: string) => {
    // Stop empty requests
    if (value) {
      setLocation(value);
    }
  };

  const displaySpinner = () => {
    setShowSpinner(true);
  };

  return (
    <main>
      <div
        className={"app " + changeBackground(pageProps.iconKey, pageProps.temp)}
      >
        {showSpinner ? <div className="lds-dual-ring"> </div> : ""}
        <CitySearch callBack={searchForLoc} callBackSpinner={displaySpinner} />
        <p className={"temp"}>
          {pageProps.temp}
          <span className="degree">{"\u00B0"}</span>
        </p>
        <img
          className="weather-icon"
          src={pageProps.iconURL}
          alt="weather-icon"
        ></img>
        <h1 className={oswald.className}>{location}</h1>
        <p className={"summary " + oswald.className}>{pageProps.weatherText}</p>
        <img className="img-background" src="/weather-bg.png"></img>
      </div>
    </main>
  );
}
