export function navigateTo(pos) {
  if (
    /* if we're on iOS, open in Apple Maps */
    navigator.platform.indexOf("iPhone") !== -1 ||
    navigator.platform.indexOf("iPad") !== -1 ||
    navigator.platform.indexOf("iPod") !== -1
  )
    window.open(
      "maps://maps.google.com/maps?q=" +
        pos.lat.toString() +
        "," +
        pos.lng.toString()
    );
  /* else use Google */ else
    window.open(
      "https://maps.google.com/maps?q=" +
        pos.lat.toString() +
        "," +
        pos.lng.toString()
    );
}
