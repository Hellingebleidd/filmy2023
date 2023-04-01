import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat/chat.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
