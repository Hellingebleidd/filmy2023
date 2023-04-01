import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/services/message.service';
import { ChatMsg, ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy{

  nick = ''
  messages: ChatMsg[] = []
  messageToSend = ''
  connected = false
  conectSubscription?: Subscription
  @ViewChild ('msgInput') messageInput?: ElementRef
  

  constructor(private chatService: ChatService, private messageService: MessageService){}

  ngOnDestroy(): void {
    this.chatService.disconnect()
  }

  onConnect(){
    this.conectSubscription = this.chatService.connect().subscribe(isConnected => {
      if(isConnected){
        this.connected=true
        this.chatService.listenGreetings().subscribe( grt => {
          this.messages = [...this.messages, {name: 'SERVER', message: grt}]
        })
        this.chatService.listenMessages().subscribe( msg => {
          this.messages = [...this.messages, msg]
        })
        this.chatService.sendNickName(this.nick)
        setTimeout(this.messageInput?.nativeElement.focus(), 0)
      }else{
        this.messageService.errorMessage("server unavailable")
      }
    })
  }

  onSend(){
    this.chatService.sendMessage(this.messageToSend)
    this.messageToSend = ''
  }

  onDisconnect(){
    this.conectSubscription?.unsubscribe()
    this.connected=false
    // this.chatService.disconnect()
    
  }
}
