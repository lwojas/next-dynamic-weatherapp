export const changeBackground = (iconKey: number, temp: number) => {
  let cssClass = "_" + iconKey;
  if (iconKey < 4 && temp > 27) {
    // Special class for very hot sunny days
    cssClass = "bg-sunny";
  }
  return cssClass;
};
