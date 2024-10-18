import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular'; // Importar IonicStorageModule
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importar SQLite
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DbService } from './servicio/database.service'; // Asegúrate de importar tu servicio de base de datos

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot() 
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite, 
    DbService 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
