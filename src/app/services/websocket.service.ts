import { Injectable } from '@angular/core';

import { webSocket } from 'rxjs/webSocket';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import { ApiRootHostname } from '../classes/api-root';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  input = new QueueingSubject<string>()

  constructor() { }

  graphDataPull() {
    const { messages, connectionStatus } = websocketConnect('ws://' + ApiRootHostname() + '/dalalbull/api/graph-channel/', this.input);
    const messagesSubscription = messages.subscribe((message) => {
      console.log('received message:', message)
    })
  }

  poll(url: string) {
    let subject = webSocket(url);
    subject.subscribe(
      (msg) => console.log('message received: ' + msg),
      (err) => console.log(err),
      () => console.log('complete')
    );
    subject.next(JSON.stringify({ op: 'hello' }));
  }

}
