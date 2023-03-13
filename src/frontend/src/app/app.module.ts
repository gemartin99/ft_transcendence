import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { School42Component } from './school42/school42.component';
import { GameComponent } from './game/game.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';


import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CreateRoomComponent } from './chat/rooms/create-room/create-room.component';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';
import { LogoutComponent } from './logout/logout.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { JoinRoomComponent } from './chat/rooms/join-room/join-room.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { MatchComponent } from './game/match/match.component';
import { ChatUseroptionsComponent } from './chat/chat-useroptions/chat-useroptions.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { EditTwoFactorComponent } from './two-factor/edit-two-factor/edit-two-factor.component';
const config: SocketIoConfig = { url: 'http://crazy-pong.com:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    LoginComponent,
    School42Component,
    GameComponent,
    RegisterComponent,
    ProfileComponent,
    ChatComponent,
    CreateRoomComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    LogoutComponent,
    EditProfileComponent,
    JoinRoomComponent,
    ProfilesComponent,
    MatchComponent,
    ChatUseroptionsComponent,
    TwoFactorComponent,
    EditTwoFactorComponent
  ],
  imports: [
    MatListModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    FontAwesomeModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
