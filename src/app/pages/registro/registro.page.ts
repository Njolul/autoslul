import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { DbService } from 'src/app/servicio/database.service'; // Importar el servicio de la base de datos

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
  usuarioExistente: boolean = false; // Agregado para verificar si el usuario ya existe

  constructor(
    private storage: Storage,
    private router: Router,
    private dbService: DbService // Inyectar el servicio de base de datos
  ) {}

  async ngOnInit() {
    // Inicializar el almacenamiento
    await this.storage.create();
  }

  async registrarUsuario() {
    // Validar campos
    this.validarCampos();

    // Verificar si el correo ya existe en el almacenamiento
    const usuarioExistente = await this.storage.get(this.usuarioCorreo);

    if (usuarioExistente) {
      this.usuarioExistente = true;
      alert('Ya existe un usuario con este correo electrónico.');
      return; // Salir si el usuario ya existe
    } else {
      this.usuarioExistente = false; // Asegurarse de que se reinicie el estado
    }

    if (!this.nombreInvalido && !this.correoInvalido && !this.contrasenaInvalida && !this.confirmacionInvalida && !this.usuarioExistente) {
      // Almacenar el usuario en el almacenamiento
      const usuario = {
        nombre: this.nombreCompleto,
        correo: this.usuarioCorreo,
        contrasena: this.usuarioContrasena
      };

      // Guardar en el Storage
      await this.storage.set(this.usuarioCorreo, usuario);

      // Guardar en la base de datos SQLite
      await this.dbService.addUser(usuario.nombre, usuario.correo, usuario.contrasena);

      alert('Registro exitoso. Puedes iniciar sesión ahora.');
      this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
    }
  }

  validarCampos() {
    this.nombreInvalido = this.nombreCompleto.trim() === '';
    this.correoInvalido = !this.validarEmail(this.usuarioCorreo);
    this.contrasenaInvalida = this.usuarioContrasena.trim() === '';
    this.confirmacionInvalida = this.confirmarContrasena !== this.usuarioContrasena;
  }

  validarEmail(email: string): boolean {
    // Expresión regular para validar el formato del correo electrónico
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Este método se puede usar para migrar todos los usuarios del Storage a la base de datos SQLite
  async migrarUsuariosAStorage() {
    const keys = await this.storage.keys(); // Obtener todas las llaves (correos)
    for (let key of keys) {
      const usuario = await this.storage.get(key); // Obtener cada usuario del Storage
      if (usuario) {
        // Guardar cada usuario en la base de datos SQLite
        await this.dbService.addUser(usuario.nombre, usuario.correo, usuario.contrasena);
      }
    }
  }
}
