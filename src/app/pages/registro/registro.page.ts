import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/pages/supabase.service'; // Importar el servicio de Supabase

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nombreCompleto: string = '';
  usuarioCorreo: string = '';
  usuarioContrasena: string = '';
  confirmarContrasena: string = '';

  nombreInvalido: boolean = false;
  correoInvalido: boolean = false;
  contrasenaInvalida: boolean = false;
  confirmacionInvalida: boolean = false;
  usuarioExistente: boolean = false; // Verificar si el usuario ya existe

  constructor(
    private storage: Storage,
    private router: Router,
    private supabaseService: SupabaseService // Inyectar el servicio de Supabase
  ) {}

  async ngOnInit() {
    // Inicializar el almacenamiento
    await this.storage.create();
  }

  /**
   * Registrar un nuevo usuario.
   */
  async registrarUsuario() {
    // Validar los campos del formulario
    this.validarCampos();

    if (
      this.nombreInvalido ||
      this.correoInvalido ||
      this.contrasenaInvalida ||
      this.confirmacionInvalida
    ) {
      alert('Por favor, corrige los errores en el formulario.');
      return;
    }

    // Verificar si el correo ya existe en Supabase
    const usuarioExistente = await this.supabaseService.getUser(
      this.usuarioCorreo
    );

    if (usuarioExistente) {
      this.usuarioExistente = true;
      alert('Ya existe un usuario con este correo electrónico.');
      return;
    } else {
      this.usuarioExistente = false; // Reiniciar estado si no existe el usuario
    }

    // Si todos los campos son válidos, proceder con el registro
    const usuario = {
      nombre: this.nombreCompleto,
      correo: this.usuarioCorreo,
      contrasena: this.usuarioContrasena,
    };

    // Guardar en Supabase
    const respuesta = await this.supabaseService.addUser(
      usuario.nombre,
      usuario.correo,
      usuario.contrasena
    );

    if (respuesta) {
      alert('Registro exitoso. Puedes iniciar sesión ahora.');
      this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
    } else {
      alert('Ocurrió un error al registrar el usuario en la base de datos.');
    }
  }

  /**
   * Valida los campos del formulario.
   */
  validarCampos() {
    this.nombreInvalido = this.nombreCompleto.trim() === '';
    this.correoInvalido = !this.validarEmail(this.usuarioCorreo);
    this.contrasenaInvalida = this.usuarioContrasena.trim() === '';
    this.confirmacionInvalida =
      this.confirmarContrasena !== this.usuarioContrasena;
  }

  /**
   * Valida el formato del correo electrónico.
   * @param email Correo a validar
   * @returns `true` si el correo es válido, `false` en caso contrario.
   */
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Método para migrar usuarios existentes en el almacenamiento local a Supabase.
   */
  async migrarUsuariosAStorage() {
    const keys = await this.storage.keys(); // Obtener todas las llaves (correos)
    for (let key of keys) {
      const usuario = await this.storage.get(key); // Obtener cada usuario del Storage
      if (usuario) {
        // Guardar cada usuario en Supabase
        await this.supabaseService.addUser(
          usuario.nombre,
          usuario.correo,
          usuario.contrasena
        );
      }
    }
  }
}
