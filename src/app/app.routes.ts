import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ChatComponent} from './chat/chat.component';
import {AuthGuard} from './login.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: ChatComponent, canActivate: [AuthGuard]},
];
