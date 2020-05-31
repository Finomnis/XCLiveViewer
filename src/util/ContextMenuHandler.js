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

  cancelCurrentTouch = () => {
    this.currentTouch = null;
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onTouchStart = (e) => {
    //console.log(this.toString(), "onTouchStart", e.touches.length);

    // Cancel context menu when multi-touch detected
    if (e.touches.length !== 1) {
      this.cancelCurrentTouch();
      return;
    }

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
    //console.log(this.toString(), "onTouchMove", e.touches.length);

    // Cancel context menu when multi-touch detected
    if (e.touches.length !== 1) {
      this.cancelCurrentTouch();
      return;
    }

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

    this.cancelCurrentTouch();
  };

  onTouchCancel = (e) => {
    //console.log(this.toString(), "onTouchCancel");
    this.cancelCurrentTouch();
  };

  onTouchEnd = (e) => {
    //console.log(this.toString(), "onTouchEnd");
    this.cancelCurrentTouch();
  };

  onContextMenu = (e) => {
    //console.log(this.toString(), "onContextMenu");
    this.cancelCurrentTouch();

    this.callback(e);
    e.preventDefault();
  };
}
