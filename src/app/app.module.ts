import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthService } from "./shared/services/auth.service";
import { AuthGuard } from './shared/guard/auth.guard';
import { UserListService } from "./user-list.service";
import { AngularMaterialModule } from './angular-material.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faUser, faHashtag, faGamepad, faVenusMars, faChevronRight, faChevronDown, faBookmark } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MatchesComponent } from './matches/matches.component';
import { CreateMatchComponent } from './create-match/create-match.component';
import { ScheduleComponent } from './modals/schedule/schedule.component';
import { TournamentSignUpComponent } from './tournament-sign-up/tournament-sign-up.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarMatchComponent } from './modals/calendar-match/calendar-match.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfirmScreenComponent } from './modals/confirm-screen/confirm-screen.component'

@NgModule({
  declarations: [
    AppComponent,
    TopNavbarComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    MatchesComponent,
    CreateMatchComponent,
    ScheduleComponent,
    TournamentSignUpComponent,
    CalendarComponent,
    CalendarMatchComponent,
    ProfileComponent,
    ConfirmScreenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot([
      { path: '', component: MatchesComponent, canActivate: [AuthGuard] },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'verify-email-address', component: VerifyEmailComponent },
      { path: 'create-match', component: CreateMatchComponent},
      { path: 'tournaments', component: TournamentSignUpComponent},
      { path: 'profile', component: ProfileComponent}
    ]),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
  ],
  providers: [AuthService, UserListService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faEnvelope, faLock, faUser, faHashtag, faGamepad, faVenusMars, faChevronRight, faChevronDown, faBookmark);
  }
}
