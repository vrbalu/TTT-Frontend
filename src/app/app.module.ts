import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/layout/header/header.component';
import {TttComponent} from './components/ttt/ttt.component';
import {BodyComponent} from './components/layout/body/body.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SidePanelComponent} from './components/side-panel/side-panel.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoginComponent} from './components/login/login.component';
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from 'angularx-social-login';
import {MatPseudoCheckboxModule} from '@angular/material/core';
import {AdministrationComponent} from './components/administration/administration.component';
import {StatsComponent} from './components/stats/stats.component';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TttComponent,
    BodyComponent,
    SidePanelComponent,
    RegistrationComponent,
    LoginComponent,
    AdministrationComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
    FormsModule,
    SocialLoginModule,
    MatPseudoCheckboxModule,
    MatSortModule,
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '547797194739-ins99o64tog07np0n91rqpfb3vr8bl7u.apps.googleusercontent.com'
          )
        },
      ]
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
