import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/pages/supabase.service'; // Importar el servicio de Supabase

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuarioCorreo: string = ''; // Correo del usuario ingresado
  usuarioContrasena: string = ''; // Contraseña ingresada
  usuarioInvalido: boolean = false; // Indica si el usuario es inválido
  contrasenaInvalida: boolean = false; // Indica si la contraseña es inválida

  constructor(
    private supabaseService: SupabaseService, // Inyección del servicio de Supabase
    private router: Router // Inyección del router para redirigir
  ) {}

  /**
   * Valida las credenciales ingresadas por el usuario.
   */
  async validarCredenciales() {
    try {
      // Consultar el usuario en la base de datos de Supabase por su correo
      const usuario = await this.supabaseService.getUser(this.usuarioCorreo);

      // Si el usuario existe y la contraseña coincide
      if (usuario && usuario.contrasena === this.usuarioContrasena) {
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/inicio']); // Redirigir a la página de inicio
      } else {
        // Manejar errores específicos: usuario o contraseña incorrectos
        this.usuarioInvalido = !usuario;
        this.contrasenaInvalida = usuario && usuario.contrasena !== this.usuarioContrasena;
      }
    } catch (error) {
      console.error('Error al validar credenciales:', error);
      alert('Ocurrió un error al intentar iniciar sesión. Intenta nuevamente.');
    }
  }
}
