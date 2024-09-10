import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { usuarioCorreo: string };
      this.usuarioCorreo = state.usuarioCorreo;
    }
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
      buttons: ['OK']
    });

    await alert.present();
  }
 


}

