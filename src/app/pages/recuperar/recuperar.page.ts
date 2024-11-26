import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Importamos Storage
import { Router } from '@angular/router'; // Para redireccionar a otra página
import { SupabaseService } from 'src/app/pages/supabase.service'; // Importamos el servicio de Supabase

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  Correo: string = ''; // Correo ingresado por el usuario
  nuevaContrasena: string | null = null; // Permitir null
  correoInvalido: boolean = false; // Validación del correo

  constructor(
    private storage: Storage, 
    private supabaseService: SupabaseService, // Servicio de Supabase
    private router: Router
  ) {}

  async ngOnInit() {
    // Inicializar el almacenamiento
    await this.storage.create();
  }

  async validarCredenciales() {
    // Validar el formato del correo electrónico
    this.correoInvalido = !this.validarEmail(this.Correo);
    if (this.correoInvalido) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      // Consultar al usuario en Supabase por su correo
      const usuario = await this.supabaseService.getUser(this.Correo);

      if (usuario) {
        // Si el usuario existe, solicitar nueva contraseña
        this.nuevaContrasena = prompt('Por favor, ingresa tu nueva contraseña:');
        if (this.nuevaContrasena) {
          // Actualizar el usuario en Storage
          const usuarioStorage = await this.storage.get(this.Correo);
          if (usuarioStorage) {
            usuarioStorage.contrasena = this.nuevaContrasena;
            await this.storage.set(this.Correo, usuarioStorage); // Actualizar en Storage
          } else {
            // Si no existe en Storage, crearlo
            await this.storage.set(this.Correo, {
              correo: this.Correo,
              contrasena: this.nuevaContrasena,
            });
          }

          // Actualizar en Supabase
          const resultado = await this.supabaseService.updateUser(
            this.Correo,
            this.nuevaContrasena
          );

          if (resultado) {
            alert('Contraseña actualizada exitosamente. Puedes iniciar sesión ahora.');
            this.router.navigate(['/login']); // Redirigir al inicio de sesión
          } else {
            alert('Ocurrió un error al actualizar la contraseña en la base de datos.');
          }
        } else {
          alert('No se ingresó ninguna contraseña.');
        }
      } else {
        alert('No se encontró un usuario con ese correo electrónico.');
      }
    } catch (error) {
      console.error('Error al recuperar las credenciales:', error);
      alert('Ocurrió un error. Intenta nuevamente.');
    }
  }

  validarEmail(email: string): boolean {
    // Expresión regular para validar el formato del correo electrónico
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
