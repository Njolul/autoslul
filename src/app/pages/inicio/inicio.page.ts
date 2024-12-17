import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMapsService } from 'src/app/servicio/google-maps.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  usuarioCorreo: string = '';
  ubicacionActual: string = '';
  destino: string = '';
  tipoAuto: string = '';
  ubicacionActualInvalida: boolean = false;
  destinoInvalido: boolean = false;
  tipoAutoInvalido: boolean = false;
  mapa: google.maps.Map | undefined;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private googleMapsService: GoogleMapsService
  ) {}

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { usuarioCorreo: string };
      this.usuarioCorreo = state.usuarioCorreo;
    }

    // Cargar ubicación actual en el mapa
    try {
      await this.googleMapsService.loadGoogleMapsAPI();
      await this.solicitarPermisosYcargarMapa();
    } catch (error) {
      console.error('Error al cargar Google Maps:', error);
      this.mostrarError('No se pudo cargar Google Maps. Por favor, intenta nuevamente.');
    }
  }

  async solicitarPermisosYcargarMapa() {
    try {
      // Solicitar permisos de ubicación
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        this.mostrarError('Permiso de ubicación no concedido');
        return;
      }

      // Si los permisos son otorgados, obtenemos la ubicación y mostramos el mapa
      await this.cargarMapa();
    } catch (error) {
      console.error('Error al solicitar permisos de ubicación:', error);
      this.mostrarError('Hubo un problema al solicitar los permisos de ubicación.');
    }
  }

  async cargarMapa() {
    try {
      const coordenadas = await Geolocation.getCurrentPosition();
      const mapDiv = document.getElementById('map') as HTMLElement;
      if (!mapDiv) {
        console.error('No se encontró el elemento del mapa en el DOM.');
        return;
      }

      const position = { lat: coordenadas.coords.latitude, lng: coordenadas.coords.longitude };

      this.mapa = new google.maps.Map(mapDiv, {
        center: position,
        zoom: 15,
      });

      new google.maps.Marker({
        position,
        map: this.mapa,
        title: 'Tu ubicación actual',
      });

      this.ubicacionActual = `${position.lat}, ${position.lng}`;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      this.mostrarError('No se pudo obtener tu ubicación. Por favor, verifica tus permisos y el GPS.');
    }
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async submitFormulario() {
    if (this.ubicacionActual.trim() === '') {
      this.ubicacionActualInvalida = true;
    } else {
      this.ubicacionActualInvalida = false;
    }

    if (this.destino.trim() === '') {
      this.destinoInvalido = true;
    } else {
      this.destinoInvalido = false;
    }

    if (!this.tipoAuto) {
      this.tipoAutoInvalido = true;
    } else {
      this.tipoAutoInvalido = false;
    }

    if (!this.ubicacionActualInvalida && !this.destinoInvalido && !this.tipoAutoInvalido) {
      await this.mostrarMensajeConfirmacion();
    }
  }

  async mostrarMensajeConfirmacion() {
    const alert = await this.alertController.create({
      header: '¡Viaje en Camino!',
      message: `Tu viaje desde <strong>${this.ubicacionActual}</strong> hacia <strong>${this.destino}</strong> en un <strong>${this.tipoAuto}</strong> está en camino.`,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
