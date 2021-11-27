const TRANSFORM_ORIGINS = {
  RIGHT: "right",
  CENTER: "center",
  LEFT: "left"
};

class Dock {
  scale = 0.5;

  /**
   * @property {HTMLElement} root
   * @property {HTMLElement[]} icons
   * @property {number} iconSize
   * @param {HTMLElement} el
   */
  constructor(el) {
    this.root = el;
    this.icons = Array.from(el.querySelectorAll(".dock-icon"));
    if (this.icons.length === 0) {
      return;
    }
    this.iconSize = this.icons[0].offsetWidth;

    el.addEventListener("mousemove", this.handleMouseMove.bind(this));
    el.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    el.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
  }

  handleMouseMove(e) {
    this.mousePosition = between(
      (e.clientX - this.root.offsetLeft) / this.iconSize,
      0,
      this.icons.length
    );
    this.scaleIcons();
  }

  handleMouseLeave() {
    this.root.classList.add("animated");
    this.icons.forEach(icon => {
      icon.style.removeProperty("transform");
      icon.style.removeProperty("transform-origin");
    });
  }

  handleMouseEnter() {
    this.root.classList.add("animated");
    window.setTimeout(() => {
      this.root.classList.remove("animated");
    }, 100);
  }

  /**
   * Apply transformation css on icons
   */
  scaleIcons() {
    const selectedIndex = Math.floor(this.mousePosition);
    const centerOffset = this.mousePosition - selectedIndex - 0.5;

    let baseOffset = this.scaleFromDirection(
      selectedIndex,
      TRANSFORM_ORIGINS.CENTER,
      -centerOffset * this.iconSize
    );
    let offset = baseOffset * (0.5 - centerOffset);
    // let offset = 32;
    for (let i = selectedIndex + 1; i < this.icons.length; i++) {
      offset += this.scaleFromDirection(i, TRANSFORM_ORIGINS.LEFT, offset);
    }
    offset = baseOffset * (0.5 + centerOffset);
    for (let i = selectedIndex - 1; i >= 0; i--) {
      offset += this.scaleFromDirection(i, TRANSFORM_ORIGINS.RIGHT, -offset);
    }
  }

  /**
   *
   * @param {number} index ico
   * @param {number} direction icon position from center (0: center, -1: left, 1: right)
   * @param {number} offset
   */
  scaleFromDirection(index, direction, offset) {
    const center = index + 0.5;
    const distanceFromPointer = this.mousePosition - center;
    const scale = scaling(distanceFromPointer) * this.scale;
    const icon = this.icons[index];
    icon.style.setProperty(
      "transform",
      `translateX(${offset}px) scale(${scale + 1})`
    );
    icon.style.setProperty("transform-origin", `${direction} bottom`);
    return scale * this.iconSize;
  }
}

/**
 *
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
function between(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

/**
 * Handle scaling depend of distance
 * @param {number} d
 */
function scaling(d) {
  return Math.max(Math.min(-0.2 * Math.pow(d, 2) + 1.05, 1), 0);
}

new Dock(document.querySelector(".dock"));
