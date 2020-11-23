import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TttComponent } from "./components/ttt/ttt.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component"

const routes: Routes = [
  { path: '', component: TttComponent},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
