const longPressDuration =
  navigator.platform.indexOf("iPhone") !== -1 ||
  navigator.platform.indexOf("iPad") !== -1 ||
  navigator.platform.indexOf("iPod") !== -1
    ? 400
    : 1000;

export default class ContextMenuHandler {
  constructor(callback) {
    this.callback = callback;
    this.longPressCountdown = null;
    this.contextMenuPossible = false;
  }

  onTouchStart = e => {
    console.log(this.toString(), "onTouchStart");
    this.contextMenuPossible = true;

    const touch = e.touches[0];

    this.longPressCountdown = setTimeout(() => {
      this.contextMenuPossible = false;
      this.callback(touch);
      console.log(this.toString(), "CONTEXT_MENU");
    }, longPressDuration);
  };

  onTouchMove = e => {
    console.log(this.toString(), "onTouchMove");
    clearTimeout(this.longPressCountdown);
  };

  onTouchCancel = e => {
    console.log(this.toString(), "onTouchCancel");
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onTouchEnd = e => {
    console.log(this.toString(), "onTouchEnd");
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onContextMenu = e => {
    console.log(this.toString(), "onContextMenu");
    this.contextMenuPossible = false;

    clearTimeout(this.longPressCountdown);

    this.callback(e);
    e.preventDefault();
  };
}
