import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Inicializa el cliente de Supabase con las variables de entorno
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  /**
   * Agrega un nuevo usuario a la tabla `usuarios` en Supabase.
   * @param nombre - Nombre completo del usuario.
   * @param correo - Correo electrónico del usuario.
   * @param contrasena - Contraseña del usuario.
   * @returns `true` si el usuario fue agregado exitosamente, o `false` si ocurrió un error.
   */
  async addUser(nombre: string, correo: string, contrasena: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('usuarios') // Asegúrate de que este es el nombre correcto de la tabla
        .insert([{ nombre, correo, contrasena }]);

      if (error) {
        console.error('Error al agregar el usuario:', error.message);
        return false; // Indica que hubo un error al insertar
      }

      console.log('Usuario agregado exitosamente');
      return true; // Indica que la inserción fue exitosa
    } catch (error) {
      console.error('Error interno al agregar el usuario:', error);
      return false; // Indica que hubo un error no controlado
    }
  }

  /**
   * Obtiene un usuario de la tabla `usuarios` filtrando por correo.
   * @param correo - Correo electrónico del usuario a buscar.
   * @returns Los datos del usuario encontrado o `null` si ocurre un error o no existe.
   */
  async getUser(correo: string) {
    try {
      const { data, error } = await this.supabase
        .from('usuarios') // Asegúrate de que este es el nombre correcto de la tabla
        .select('*')
        .eq('correo', correo)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Usuario no encontrado:', correo);
          return null;
        }
        console.error('Error al obtener el usuario:', error.message);
        throw error;
      }

      console.log('Usuario encontrado:', data);
      return data;
    } catch (error) {
      console.error('Error interno al obtener el usuario:', error);
      return null;
    }
  }

  /**
   * Actualiza la contraseña de un usuario existente.
   * @param correo - Correo electrónico del usuario.
   * @param contrasena - Nueva contraseña.
   * @returns `true` si la actualización fue exitosa, o `false` si ocurrió un error.
   */
  async updateUser(correo: string, contrasena: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('usuarios') // Asegúrate de que este es el nombre correcto de la tabla
        .update({ contrasena })
        .eq('correo', correo);

      if (error) {
        console.error('Error al actualizar el usuario:', error.message);
        return false; // Indica que hubo un error al actualizar
      }

      console.log('Usuario actualizado exitosamente');
      return true; // Indica que la actualización fue exitosa
    } catch (error) {
      console.error('Error interno al actualizar el usuario:', error);
      return false; // Indica que hubo un error no controlado
    }
  }

  /**
   * Valida si los datos ingresados cumplen con los requisitos.
   * @param correo - Correo electrónico a validar.
   * @param contrasena - Contraseña a validar.
   * @returns Un objeto con el estado de validación.
   */
  validateUserData(correo: string, contrasena: string) {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const isPasswordValid = contrasena.length >= 6; // Ejemplo: contraseña mínima de 6 caracteres

    return {
      isEmailValid,
      isPasswordValid,
      isValid: isEmailValid && isPasswordValid,
    };
  }
}
