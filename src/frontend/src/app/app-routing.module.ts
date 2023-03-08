import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { RegisterComponent } from './register/register.component';
import { School42Component } from './school42/school42.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "users", component: UserComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent },
  {path: 'school42/callback', component: School42Component},
  {path: 'register', component: RegisterComponent },
  {path: 'game', component: GameComponent },
  {path: 'chat', component: ChatComponent },
  {path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
