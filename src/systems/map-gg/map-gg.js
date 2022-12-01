import {Loader} from 'google-maps';
import GoogleMapConfigs from './map-gg-config';
import GoogleMapPopupFactory from './map-gg-marker-popup';

class MapGg {


    constructor() {
        this.DOM = {};
        this.init();
    }

    init() {
        const options = {libraries: ['places']};
        const loader = new Loader(
            'AIzaSyB_bdjelQeA9kBYA9MMcdb_l2i1hGF_zh4',
            options
        );

        loader.load().then((google) => {
            this.DOM.map = document.getElementById('gg--map');
            if (!this.DOM.map) {
                return;
            }

            this.geoNauy = new google.maps.LatLng(
                wpData.mapGG[0].lat,
                wpData.mapGG[0].lng
            );
            this.map = new google.maps.Map(this.DOM.map, {
                center: this.geoNauy,
                zoom: 15,
                styles: GoogleMapConfigs.GoogleMapStyles,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
            });
            this.createMarkers();
        });
    }

    createPopupMarker(marker, info, popupClass, index) {
        const Popup = GoogleMapPopupFactory().GoogleMapPopup;
        const element = document.createElement('div');
        element.classList.add(popupClass);
        element.innerHTML = `
        <div class="popup-marker__title">${info.title}</div>
        <div class="popup-marker__address">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C4.1 0 1 3.1 1 7C1 8.9 1.7 10.7 3.1 12C3.2 12.1 7.2 15.7 7.3 15.8C7.7 16.1 8.3 16.1 8.6 15.8C8.7 15.7 12.8 12.1 12.8 12C14.2 10.7 14.9 8.9 14.9 7C15 3.1 11.9 0 8 0ZM8 9C6.9 9 6 8.1 6 7C6 5.9 6.9 5 8 5C9.1 5 10 5.9 10 7C10 8.1 9.1 9 8 9Z" fill="#111111"/>
          </svg>
          ${info.address}
        </div>
        <div class="popup-marker__phone">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.086 10.4L11.949 9.00801C11.6387 8.87074 11.2918 8.83965 10.962 8.91956C10.6322 8.99947 10.338 9.18592 10.125 9.45001L9.17799 10.635C7.64333 9.65871 6.3417 8.35742 5.36499 6.82301L6.54899 5.87701C6.81401 5.66422 7.00124 5.36978 7.08154 5.03953C7.16184 4.70927 7.13071 4.36174 6.99299 4.05101L5.59999 0.914014C5.45201 0.580821 5.19055 0.310982 4.86218 0.15257C4.53382 -0.00584243 4.15988 -0.0425403 3.80699 0.0490142L1.15499 0.738014C0.789118 0.833593 0.471003 1.06003 0.260902 1.37445C0.0508015 1.68886 -0.0366933 2.06941 0.0149909 2.44401C0.506106 5.86123 2.09094 9.02741 4.53219 11.4685C6.97344 13.9095 10.1397 15.4942 13.557 15.985C13.6272 15.9949 13.6981 16 13.769 16C14.1104 15.9998 14.4422 15.8864 14.7123 15.6776C14.9824 15.4688 15.1757 15.1764 15.262 14.846L15.95 12.193C16.0429 11.8402 16.0069 11.4659 15.8485 11.1372C15.6902 10.8086 15.4198 10.5472 15.086 10.4Z" fill="black"/>
          </svg>
          ${info.phone}
        </div>
        <a class="popup-marker__link" href="${info.ggLink}" target="_blank">Se rutevejledning</a>
      `;
        const popupInstance = new Popup(marker.getPosition(), element);
        popupInstance.onRemove;
        popupInstance.setMap(this.map);
        popupInstance.hide();
        return popupInstance;
    }

    onClickPopupMarker(index) {
        if (!this.DOM.popupMarkers || !Array.isArray(this.DOM.popupMarkers)) {
            return;
        }

        this.DOM.popupMarkers.forEach((item, idx) => {
            if (index === idx) {
                item.toggle();
            } else {
                item.hide();
            }
        });
    }

    createMarkers() {
        // const markers = [
        //     {
        //         lat: MapGg.companyPosition.lat,
        //         lng: MapGg.companyPosition.lng,
        //         popupClass: `popup-marker`,
        //     },
        //     {
        //         lat: 55.38697248643246,
        //         lng: 10.455097852954122,
        //         popupClass: `popup-marker`,
        //     },
        //     {
        //         lat: 55.38426243909092,
        //         lng: 10.46155796806581,
        //         popupClass: `popup-marker`,
        //     },
        // ];

        const markers = wpData.mapGG;
        this.DOM.popupMarkers = [];

        for (let i = 0; i < markers.length; i++) {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
                map: this.map,
                icon: `${wpData.iconUrl}/map-marker.svg`,
            });
            const popupInstance = this.createPopupMarker(
                marker,
                markers[i],
                'popup-marker',
                i
            );
            this.DOM.popupMarkers.push(popupInstance);
            this.onClickPopupMarker(0);
            marker.addListener(
                'click',
                function () {
                    this.onClickPopupMarker(i);
                }.bind(this)
            );
        }
    }
}

export default MapGg;
