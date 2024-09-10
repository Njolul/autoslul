import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  Correo: string = "";
  correoInvalido: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  validarCredenciales() {

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(this.Correo)) {
      console.log('El formato del correo electrónico es inválido.');
      this.correoInvalido = true;
      return;
    } else {
      this.correoInvalido = false;
    }


    console.log('Credenciales válidas, redirigiendo a login...');
    this.router.navigate(['/login'], { state: { usuarioCorreo: this.Correo } });
  }

}
