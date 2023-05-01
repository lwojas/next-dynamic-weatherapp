export const changeBackground = (iconKey: number, temp: number) => {
  let cssClass = "";
  // TODO: Put these class strings in an array with indexes matching the icon numbers
  if (iconKey < 4) {
    if (temp > 27) {
      cssClass = "bg-sunny";
    } else {
      cssClass = "bg-fair";
    }
  } else if (iconKey < 7) {
    cssClass = "bg-mild";
  } else if (iconKey < 14) {
    cssClass = "bg-cloudy";
  } else if (iconKey > 31) {
    cssClass = "bg-night";
  }
  return cssClass;
};
