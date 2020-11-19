import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsolaComponent } from './consola/consola.component';
import { InstruccionesComponent } from './instrucciones/instrucciones.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Globals } from './globals';
import { SegmentoDatosComponent } from './segmento-datos/segmento-datos.component';


@NgModule({
  declarations: [
    AppComponent,
    ConsolaComponent,
    InstruccionesComponent,
    IncidenciasComponent,
    SegmentoDatosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule
  ],
  providers: [
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
