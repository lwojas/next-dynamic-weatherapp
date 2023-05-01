import { Oswald } from "next/font/google";
// Library imports
import axios from "axios";

// Local imports
import { changeBackground } from "@/libs/changeBackground";

const oswald = Oswald({ subsets: ["latin"] });

// Declare a type for global props returned by getStaticProps
type globalProps = {
  iconURL: string;
  iconKey: 12;
  temp: 12;
  weatherText: string;
};

export async function getStaticProps() {
  const res = await axios.get(
    `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.NEXT_PUBLIC_API_KEY}&q=Amsterdam`
  );
  const locKey = Number(res.data[0].Key);

  // Now we have that we have the location key we can make a specific call for the weather
  const currentWeather = await axios.get(
    `http://dataservice.accuweather.com/currentconditions/v1/${locKey}?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
  );
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

  return {
    props: {
      iconURL,
      iconKey,
      temp,
      weatherText,
    },
  };
}

export default function Home(props: globalProps) {
  return (
    <main>
      <div className={"app " + changeBackground(props.iconKey, props.temp)}>
        {}
        <p className={"temp"}>
          {props.temp}
          <span className="degree">{"\u00B0"}</span>
        </p>
        <img
          className="weather-icon"
          src={props.iconURL}
          alt="weather-icon"
        ></img>
        <h1 className={oswald.className}>Amsterdam</h1>
        <p className={"summary " + oswald.className}>{props.weatherText}</p>
        <img className="img-background" src="/weather-bg.png"></img>
      </div>
    </main>
  );
}
