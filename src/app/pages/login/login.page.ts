import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/pages/supabase.service'; 

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

  constructor(
    private supabaseService: SupabaseService, 
    private router: Router 
  ) {}

  
  async validarCredenciales() {
    try {
     
      const usuario = await this.supabaseService.getUser(this.usuarioCorreo);

      
      if (usuario && usuario.contrasena === this.usuarioContrasena) {
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/inicio']); 
      } else {
        
        this.usuarioInvalido = !usuario;
        this.contrasenaInvalida = usuario && usuario.contrasena !== this.usuarioContrasena;
      }
    } catch (error) {
      console.error('Error al validar credenciales:', error);
      alert('Ocurrió un error al intentar iniciar sesión. Intenta nuevamente.');
    }
  }
}
