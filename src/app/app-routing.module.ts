import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TttComponent } from './components/ttt/ttt.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from './guards/auth.service';
import {AdministrationComponent} from './components/administration/administration.component';
import {StatsComponent} from './components/stats/stats.component';

const routes: Routes = [
  { path: '', component: TttComponent, canActivate: [AuthService]},
  { path: 'registration', component: RegistrationComponent},
  { path: 'administration', component: AdministrationComponent , canActivate: [AuthService]},
  { path: 'stats', component: StatsComponent , canActivate: [AuthService]},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
