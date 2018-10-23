import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { AuthService } from './auth.service';
import { Service } from 'src/app/classes/service';

@Injectable()
export class DalalbullService extends Service {

  constructor(
    protected router: Router,
    protected http: HttpClient,
    protected cookieService: CookieService,
    protected auth: AuthService
  ) {
    super(router, http, cookieService, auth);
  }

  addDBUser() {
    return this.makeGETAPICall('/dalalbull/api/handshake/');
  }

  pullTickerData() {
    return this.makeGETAPICall('/dalalbull/api/ticker/');
  }

  pullGraphData() {
    return this.makeGETAPICall('/dalalbull/api/graph/');
  }

  pullUserPortfolio() {
    return this.makeGETAPICall('/dalalbull/api/portfolioview/');
  }

  pullCompanyData(symbol: string) {
    let body = new FormData();
    body.append('company', symbol);
    return this.makePOSTAPICall('/dalalbull/api/companydetails', body);
  }

  buyStock(quantity, company, pending) {
    let body = new FormData();
    body.append('quantity', quantity);
    body.append('b_ss', 'Buy');
    body.append('company', company);
    body.append('pending', pending==null?'':pending);
    return this.makePOSTAPICall('/dalalbull/api/buy/', body);
  }

  shortSellStock(quantity, company, pending) {
    let body = new FormData();
    body.append('quantity', quantity);
    body.append('b_ss', 'Short Sell');
    body.append('company', company);
    body.append('pending', pending==null?'':pending);
    return this.makePOSTAPICall('/dalalbull/api/buy/', body);
  }

  sellOrSCStock(sell_sc, quantity, company, pending) {
    let body = new FormData();
    body.append('quantity', quantity);
    body.append('tradeType', sell_sc=='sell'?'Sell':'Short Cover');
    body.append('company', company);
    body.append('pending', pending==null?'':pending);

    return this.makePOSTAPICall('/dalalbull/api/sell/', body);
  }

  pullBoughtStock() {
    return this.makeGETAPICall('/dalalbull/api/sell/');
  }

  pullTransactionHistory_completed() {
    return this.makeGETAPICall('/dalalbull/api/history/');
  }

  pullTransactionHistory_pending() {
    return this.makeGETAPICall('/dalalbull/api/pending/');
  }

  pullRanklist() {
    return null;
    // return this.makeGETAPICall('/dalalbull/api/leaderboard/');
  }

  pullStockInHand() {
    return this.makeGETAPICall('/dalalbull/api/sell/');
  }

}
