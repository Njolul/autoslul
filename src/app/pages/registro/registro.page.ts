import { Component } from '@angular/core';

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

  registrarUsuario() {
    // Resetear mensajes de error
    this.nombreInvalido = false;
    this.correoInvalido = false;
    this.contrasenaInvalida = false;
    this.confirmacionInvalida = false;

    // Validación de campos
    if (!this.nombreCompleto) {
      this.nombreInvalido = true;
      return;
    }

    if (!this.usuarioCorreo || !this.validarCorreo(this.usuarioCorreo)) {
      this.correoInvalido = true;
      return;
    }

    if (!this.usuarioContrasena || this.usuarioContrasena.length < 6) {
      this.contrasenaInvalida = true;
      return;
    }

    if (this.usuarioContrasena !== this.confirmarContrasena) {
      this.confirmacionInvalida = true;
      return;
    }

    // Aquí agregar lógica de registro, por ejemplo, envío a servidor
    alert('Registro exitoso');
  }

  // Función para validar el formato del correo
  validarCorreo(correo: string): boolean {
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronCorreo.test(correo);
  }
}
