import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConsultaComponent } from './consulta/consulta.component';
import { CreacionComponent } from './creacion/creacion.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { FormatDatePipe } from '../pipes/format-date.pipe';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { InicioComponent } from '../components/inicio/inicio.component';




@NgModule({
  declarations: [
    ConsultaComponent,
    CreacionComponent,
    PagesComponent,
    FormatDatePipe,
    InicioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    ComponentsModule,
  ],
  exports: [
    ConsultaComponent,
    CreacionComponent,
    PagesComponent,
    FormatDatePipe,
    InicioComponent,
  ],
  providers: []
})
export class PagesModule { }