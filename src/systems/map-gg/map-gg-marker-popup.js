export default function GoogleMapPopupFactory() {
  class GoogleMapPopup extends google.maps.OverlayView {
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add('popup-bubble-gg-marker');
      const bubbleAnchor = document.createElement('div');
      bubbleAnchor.classList.add('popup-bubble-gg-marker-anchor');
      bubbleAnchor.appendChild(content);
      this.containerDiv = document.createElement('div');
      this.containerDiv.classList.add('popup-bubble-gg-marker-container');
      this.containerDiv.appendChild(bubbleAnchor);
      GoogleMapPopup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }

    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }

    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }

    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position
      );

      const yPositionMakerWithPopup = 64;
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? 'block'
          : 'none';

      if (display === 'block') {
        this.containerDiv.style.left = divPosition.x + 'px';
        this.containerDiv.style.top =
          divPosition.y - yPositionMakerWithPopup + 'px';
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }

    hide() {
      if (this.containerDiv) {
        this.containerDiv.style.visibility = 'hidden';
      }
    }

    show() {
      if (this.containerDiv) {
        this.containerDiv.style.visibility = 'visible';
      }
    }

    toggle() {
      if (this.containerDiv) {
        if (this.containerDiv.style.visibility === 'hidden') {
          this.show();
        } else {
          this.hide();
        }
      }
    }
  }

  return {
    GoogleMapPopup,
  };
}
