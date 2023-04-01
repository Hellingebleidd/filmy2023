import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Client, over } from 'stompjs';


export interface ChatMsg{
  name: string,
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url = environment.websocket_url
  socket?: WebSocket
  stompClient?: Client
  nick=''

  constructor() { }

  connect():Observable<boolean>{
    //prerabam callback na observable
    return new Observable(subscriber => {
      //vnutorna funkcia zavoalna vtedy ked niekto na druhom konci urobi subsrcibe - studena rura
      this.socket = new WebSocket(this.url)
      this.stompClient = over(this.socket)
      this.stompClient.connect({},frame => subscriber.next(true), error => subscriber.next(false))
      return () => {
        //spusti sa ked nastane unsubsricbe
        this.disconnect()
      }
    })
  }

  disconnect(){
    this.stompClient?.disconnect(()=>{})
  }

  sendNickName(nick: string){
    // this.stompClient?.send('/app/hello', {}, `{"name": "${nick}"}`)
    this.stompClient?.send('/app/hello', {}, JSON.stringify({name: nick}))
    this.nick=nick
  }

  sendMessage(message: string){ //or nudes? :))
    this.stompClient?.send('/app/message', {}, JSON.stringify({name: this.nick, message}))
  }

  listenGreetings(): Observable<string>{
    return new Observable(sub => {
      this.stompClient?.subscribe('/topic/greetings', resp => sub.next(JSON.parse(resp.body).content))
    })
  }

  listenMessages(): Observable<ChatMsg>{
    return new Observable(sub => {
      this.stompClient?.subscribe('/topic/messages', resp => sub.next(JSON.parse(resp.body)))
    })
  }

}
