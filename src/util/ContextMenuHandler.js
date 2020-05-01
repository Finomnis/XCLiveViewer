const longPressDuration =
  navigator.platform.indexOf("iPhone") !== -1 ||
  navigator.platform.indexOf("iPad") !== -1 ||
  navigator.platform.indexOf("iPod") !== -1
    ? 400
    : 400;

export default class ContextMenuHandler {
  constructor(callback) {
    this.callback = callback;
    this.longPressCountdown = null;
    this.contextMenuPossible = false;
    this.currentTouch = null;
  }

  onTouchStart = (e) => {
    //console.log(this.toString(), "onTouchStart");
    this.contextMenuPossible = true;

    const touch = e.touches[0];
    this.currentTouch = touch;

    this.longPressCountdown = setTimeout(() => {
      this.contextMenuPossible = false;
      this.callback(touch);
      //console.log(this.toString(), "CONTEXT_MENU");
    }, longPressDuration);
  };

  onTouchMove = (e) => {
    //console.log(this.toString(), "onTouchMove");
    const touch = e.touches[0];
    if (this.currentTouch !== null) {
      const dX = this.currentTouch.pageX - touch.pageX;
      const dY = this.currentTouch.pageY - touch.pageY;

      // Don't register if touch moved less than 10 pixels.
      // Important as on google maps, raises onTouchMove events even
      // for sub-pixel jitter
      if (dX * dX + dY * dY < 100) {
        return;
      }
    }

    clearTimeout(this.longPressCountdown);
  };

  onTouchCancel = (e) => {
    //console.log(this.toString(), "onTouchCancel");
    this.currentTouch = null;
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onTouchEnd = (e) => {
    //console.log(this.toString(), "onTouchEnd");
    this.currentTouch = null;
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onContextMenu = (e) => {
    //console.log(this.toString(), "onContextMenu");
    this.contextMenuPossible = false;

    clearTimeout(this.longPressCountdown);

    this.callback(e);
    e.preventDefault();
  };
}
