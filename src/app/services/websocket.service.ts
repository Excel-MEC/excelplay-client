import { Injectable } from '@angular/core';

import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() { }

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
