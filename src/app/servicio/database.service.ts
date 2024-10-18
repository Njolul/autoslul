import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private dbInstance!: SQLiteObject;

  constructor(private router: Router, private sqlite: SQLite, private platform: Platform) {
    this.initDB();
  }

  async initDB() {
    await this.platform.ready();
    try {
      this.dbInstance = await this.sqlite.create({
        name: 'usuarios',
        location: 'default'
      });
      console.log("Base de datos creada");
      await this.crearTabla(); // Asegúrate de que esto se llame después de inicializar dbInstance
    } catch (error) {
      console.error("Error al inicializar la base de datos", error);
    }
  }

  private async crearTabla() {
    const query = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        correo TEXT UNIQUE,
        contrasena TEXT
      )
    `;
    try {
      await this.dbInstance.executeSql(query, []); // Ejecutar la consulta
      console.log("Tabla 'usuarios' creada");
    } catch (error) {
      console.error("Error al crear la tabla", error);
    }
  }

  async addUser(nombre: string, correo: string, contrasena: string) {
    const query = `INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)`;
    try {
      await this.dbInstance.executeSql(query, [nombre, correo, contrasena]);
      console.log("Usuario agregado:", nombre);
    } catch (error) {
      console.error("Error al agregar el usuario", error);
    }
  }

  async getUser(correo: string) {
    const query = `SELECT * FROM usuarios WHERE correo = ?`;
    try {
      const result = await this.dbInstance.executeSql(query, [correo]);
      return result.rows.length > 0 ? result.rows.item(0) : null; // Devuelve null si no hay resultados
    } catch (error) {
      console.error("Error al obtener el usuario", error);
      return null;
    }
  }

  async updateUser(correo: string, contrasena: string) {
    const query = `UPDATE usuarios SET contrasena = ? WHERE correo = ?`;
    try {
      await this.dbInstance.executeSql(query, [contrasena, correo]);
      console.log("Usuario actualizado:", correo);
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
    }
  }
}
