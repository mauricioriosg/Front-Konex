import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConsultaComponent } from './consulta/consulta.component';
import { CreacionComponent } from './creacion/creacion.component';
import { InicioComponent } from '../components/inicio/inicio.component';
import { LoginComponent } from '../auth/login/login.component';

const routes: Routes = [
    {
      path: 'consulta',
      component: ConsultaComponent
    },
    {
      path: 'creacion',
      component: CreacionComponent
    },
    {
      path: 'inicio',
      component: InicioComponent
    },
    {
      path: 'login',
      component: LoginComponent,
    },
  ]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  })
  export class PagesRoutingModule { }