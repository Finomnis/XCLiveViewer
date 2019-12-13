const longPressDuration = 500;

export default class ContextMenuHandler {
  constructor(callback) {
    this.callback = callback;
    this.longPressCountdown = null;
    this.contextMenuPossible = false;
  }

  onTouchStart = e => {
    this.contextMenuPossible = true;

    const touch = e.touches[0];

    this.longPressCountdown = setTimeout(() => {
      this.contextMenuPossible = false;
      this.callback(touch);
    }, longPressDuration);
  };

  onTouchMove = e => {
    clearTimeout(this.longPressCountdown);
  };

  onTouchCancel = e => {
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onTouchEnd = e => {
    this.contextMenuPossible = false;
    clearTimeout(this.longPressCountdown);
  };

  onContextMenu = e => {
    if (!this.contextMenuPossible) return;

    this.contextMenuPossible = false;

    clearTimeout(this.longPressCountdown);

    this.callback(e);
    e.preventDefault();
  };
}
