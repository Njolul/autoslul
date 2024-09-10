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
  usuarioInvalido: boolean = false;
  contrasenaInvalida: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {

  }
  validarCredenciales() {
    const regexUsuario = /^[a-zA-Z]+$/;
  if (this.usuarioCorreo.length > 25 || !regexUsuario.test(this.usuarioCorreo)) {
    this.usuarioInvalido = true;
  } else {
    this.usuarioInvalido = false;
  }

  
  const contrasenaValida = this.validarContrasena(this.usuarioContrasena);
  if (!contrasenaValida) {
    this.contrasenaInvalida = true;
  } else {
    this.contrasenaInvalida = false;
  }

  
  if (!this.usuarioInvalido && !this.contrasenaInvalida) {
    console.log('Credenciales válidas, redirigiendo a inicio...');
    this.router.navigate(['/inicio'], { state: { usuarioCorreo: this.usuarioCorreo } });
  }
}

validarContrasena(contrasena: string): boolean {
  const regex = /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`-]).{12,}$/;
  return regex.test(contrasena);
}

  
}
