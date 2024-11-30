import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor() { }

  loadGoogleMapsAPI(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window['google']) {
        resolve(window['google']);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD6A1EXb_0ptAZgZxr1z383d2jaELWIgQw&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window['google']);
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }
}
