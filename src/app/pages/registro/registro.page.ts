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
  usuarioExistente: boolean = false; 

  constructor(
    private storage: Storage,
    private router: Router,
    private supabaseService: SupabaseService 
  ) {}

  async ngOnInit() {
    
    await this.storage.create();
  }

  
  async registrarUsuario() {
    
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

    
    const usuarioExistente = await this.supabaseService.getUser(
      this.usuarioCorreo
    );

    if (usuarioExistente) {
      this.usuarioExistente = true;
      alert('Ya existe un usuario con este correo electrónico.');
      return;
    } else {
      this.usuarioExistente = false; 
    }

    
    const usuario = {
      nombre: this.nombreCompleto,
      correo: this.usuarioCorreo,
      contrasena: this.usuarioContrasena,
    };

    
    const respuesta = await this.supabaseService.addUser(
      usuario.nombre,
      usuario.correo,
      usuario.contrasena
    );

    if (respuesta) {
      alert('Registro exitoso. Puedes iniciar sesión ahora.');
      this.router.navigate(['/login']); 
    } else {
      alert('Ocurrió un error al registrar el usuario en la base de datos.');
    }
  }

  
  validarCampos() {
    this.nombreInvalido = this.nombreCompleto.trim() === '';
    this.correoInvalido = !this.validarEmail(this.usuarioCorreo);
    this.contrasenaInvalida = this.usuarioContrasena.trim() === '';
    this.confirmacionInvalida =
      this.confirmarContrasena !== this.usuarioContrasena;
  }

  /**
   
   * @param email 
   * @returns `.
   */
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  
  async migrarUsuariosAStorage() {
    const keys = await this.storage.keys(); 
    for (let key of keys) {
      const usuario = await this.storage.get(key); 
      if (usuario) {
        
        await this.supabaseService.addUser(
          usuario.nombre,
          usuario.correo,
          usuario.contrasena
        );
      }
    }
  }
}
