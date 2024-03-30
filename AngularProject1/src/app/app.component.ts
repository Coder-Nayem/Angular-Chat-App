import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'chatClient';

  hubConnection!: HubConnection;

  Messages: Message[] = [];

  user!: string | null;
  msg: string = "test message";


  constructor() {


    this.hubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7250/mychat")
      .withAutomaticReconnect()
      .withServerTimeout(1000 * 30)
      .build();



  }


  ngOnInit(): void {

    while (!this.user)
      this.user = prompt("enter name");





    this.hubConnection.on('Receive', (user, message) => {

      this.Messages.push(new Message(user, message));
    });


    this.hubConnection.on('ReceiveImg', (user, message) => {

      this.Messages.push(new Message(user, message, true));
    });


    this.hubConnection.start();
  }


  SendMsg() {

    this.hubConnection.invoke("Send", this.user, this.msg);
  }


  fileSelect(ev: any) {


    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.hubConnection.invoke("SendImg", this.user, reader.result);
    };

  }

}



export class Message {
  constructor(public UserName: string, public Text: string, public IsImage: boolean = false) {

  }
}
