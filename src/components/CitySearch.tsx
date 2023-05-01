import { time } from "console";
import { useState } from "react";

let timer: any = null;

const CitySearch = (props: any) => {
  let [city, setCity] = useState("Amsterdam");

  const setTimer = (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      props.callBack(value);
    }, 1500);
    props.callBackSpinner();
  };

  return (
    <div className="search-box">
      <p>Search by location</p>
      <input
        className="city-search"
        value={city}
        onChange={(event) => {
          setCity(event.target.value);
          setTimer(event.target.value);
        }}
      />
    </div>
  );
};

export default CitySearch;
