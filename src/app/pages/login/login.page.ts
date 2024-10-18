import { Component } from '@angular/core';
import { Router } from '@angular/router';  
import { DbService } from 'src/app/servicio/database.service'; // Importa el servicio de la base de datos

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuarioCorreo: string = '';  
  usuarioContrasena: string = '';  
  usuarioInvalido: boolean = false;  
  contrasenaInvalida: boolean = false;  

  constructor(private dbService: DbService, private router: Router) {}

  async ngOnInit() {
    try {
      await this.dbService.initDB(); // Inicializar la base de datos
    } catch (error) {
      console.error("Error al inicializar la base de datos", error);
    }
  }

  async validarCredenciales() {
    // Obtener el usuario desde la base de datos por su correo
    const usuario = await this.dbService.getUser(this.usuarioCorreo);

    if (usuario && usuario.correo === this.usuarioCorreo && usuario.contrasena === this.usuarioContrasena) {
      // Si las credenciales coinciden, redirigir al inicio
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/inicio']);  
    } else {
      // Verificar cuál es el error (correo o contraseña incorrectos)
      if (!usuario) {
        this.usuarioInvalido = true; 
      } else {
        this.usuarioInvalido = false; 
      }
      if (usuario && usuario.contrasena !== this.usuarioContrasena) {
        this.contrasenaInvalida = true; 
      } else {
        this.contrasenaInvalida = false; 
      }
    }
  }
}
