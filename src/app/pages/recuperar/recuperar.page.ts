import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';  // Importamos Storage
import { Router } from '@angular/router';  // Para redireccionar a otra página
import { DbService } from 'src/app/servicio/database.service'; // Importamos el servicio de la base de datos

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  Correo: string = '';  
  nuevaContrasena: string | null = null;  // Permitir null
  correoInvalido: boolean = false;
  contrasenaInvalida: boolean = false;

  constructor(private storage: Storage, private dbService: DbService, private router: Router) {}

  async ngOnInit() {
    // Inicializar el almacenamiento
    await this.storage.create();
  }

  async validarCredenciales() {
    // Validar el correo electrónico
    this.correoInvalido = !this.validarEmail(this.Correo);
    if (this.correoInvalido) {
      return;  // Si el correo es inválido, salimos de la función
    }

    // Obtener el usuario desde la base de datos
    const usuario = await this.dbService.getUser(this.Correo); // Consultar en la base de datos

    if (usuario) {
      // Si el usuario existe, solicitamos la nueva contraseña
      this.nuevaContrasena = prompt("Por favor, ingresa tu nueva contraseña:");
      if (this.nuevaContrasena) {
        // Actualizar la contraseña en el storage
        const usuarioStorage = await this.storage.get(this.Correo);
        if (usuarioStorage) {
          usuarioStorage.contrasena = this.nuevaContrasena;
          await this.storage.set(this.Correo, usuarioStorage); // Actualizar en storage también
        }

        // Actualizar la contraseña en la base de datos
        await this.dbService.updateUser(this.Correo, this.nuevaContrasena);
        alert('Contraseña actualizada exitosamente. Puedes iniciar sesión ahora.');
        this.router.navigate(['/login']);  // Redirigir a la página de inicio de sesión
      } else {
        alert('No se ingresó ninguna contraseña.');
      }
    } else {
      alert('No se encontró un usuario con ese correo electrónico.');
    }
  }

  validarEmail(email: string): boolean {
    // Expresión regular para validar el formato del correo electrónico
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

