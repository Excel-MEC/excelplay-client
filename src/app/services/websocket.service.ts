import { Injectable } from '@angular/core';

import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import { ApiRootHostname } from '../classes/api-root';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  input = new QueueingSubject<string>()

  constructor() { }

  wsConnect(url) {  
    return websocketConnect('ws://' + ApiRootHostname() + url, this.input);
  }

  pullGraphData() {
    const { messages, connectionStatus } = this.wsConnect('/dalalbullws/channel/graph/');
    return messages;
  }

  pullTickerData() {
    const { messages, connectionStatus } = this.wsConnect('/dalalbullws/channel/ticker/');
    return messages;
  }

  pullPortfolioData() {
    const { messages, connectionStatus } = this.wsConnect('/dalalbullws/channel/portfolio/');
    return messages;
  }

}
