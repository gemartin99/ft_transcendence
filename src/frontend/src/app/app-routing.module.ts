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
import { ProfilesComponent } from './profiles/profiles.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateRoomComponent } from './chat/rooms/create-room/create-room.component';
import { LogoutComponent } from './logout/logout.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { MatchComponent } from './game/match/match.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { EditTwoFactorComponent } from './two-factor/edit-two-factor/edit-two-factor.component';
import { GameOptionsComponent } from './game/game-options/game-options.component';



const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "users", component: UserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'school42/callback', component: School42Component },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard]  },
  { path: 'game', component: GameComponent, canActivate: [AuthGuard]  },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard]  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
  { path: 'chat/create-room', component: CreateRoomComponent, canActivate: [AuthGuard]  },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]  },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'profiles/:id', component: ProfilesComponent, canActivate: [AuthGuard] },
  { path: 'game/match/:id', component: MatchComponent, canActivate: [AuthGuard] },
  { path: 'two-factor', component: TwoFactorComponent, canActivate: [AuthGuard] },
  { path: 'security/settings', component: EditTwoFactorComponent, canActivate: [AuthGuard] },
  { path: 'game/settings', component: GameOptionsComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
