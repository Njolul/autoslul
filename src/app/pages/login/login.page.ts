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
  validarCredenciales() {
    if (this.usuarioCorreo.length > 25) {
      console.log('El correo del usuario no debe exceder los 25 caracteres.');
      return;
    }
  
    const contrasenaValida = this.validarContrasena(this.usuarioContrasena);
    if (!contrasenaValida) {
      console.log('La contraseña debe tener al menos 12 caracteres e incluir un carácter especial.');
      return;
    }
  
    
    console.log('Credenciales válidas, redirigiendo a inicio...');
    this.router.navigate(['/inicio'], { state: { usuarioCorreo: this.usuarioCorreo } });
  }
  
  validarContrasena(contrasena: string): boolean {
    
    const regex = /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`-]).{12,}$/;
    return regex.test(contrasena);
  }

  
}
