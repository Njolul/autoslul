import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuarioCorreo: string = "";
  usuarioContrasena: string = "";

  constructor(private router: Router) { }

  ngOnInit() {

  }
  validarCredenciales(){

    this.router.navigate(['/inicio'],{
      state: {
        correo: this.usuarioCorreo,
        contrasena: this.usuarioContrasena
      }
    });
  }

  
}
