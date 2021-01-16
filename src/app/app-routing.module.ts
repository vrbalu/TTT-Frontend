import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TttComponent } from './components/ttt/ttt.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from "./guards/auth.service";

const routes: Routes = [
  { path: '', component: TttComponent, canActivate: [AuthService]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
