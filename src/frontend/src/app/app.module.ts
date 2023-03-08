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
    LogoutComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
