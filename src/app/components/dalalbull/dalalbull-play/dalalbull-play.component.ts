import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

// import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import { DalalbullService } from '../../../services/dalalbull.service';

// import { $WebSocket } from 'angular2-websocket/angular2-websocket';

import { ApiRootHostname_nodir } from '../../../classes/api-root';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { StockMap } from '../../../classes/stock-map';

import { DalalbullStockComponent } from '../dalalbull-stock/dalalbull-stock.component';

import { AuthService } from '../../../services/auth.service';
import { WebsocketService } from '../../../services/websocket.service';
// let myTickerWs = new $WebSocket("ws://"+ApiRootHostname_nodir()+"channel/dalalbull/ticker-channel/");
// let myGraphWs = new $WebSocket("ws://"+ApiRootHostname_nodir()+"channel/dalalbull/graph-channel/");
// let myPortfolioWs = new $WebSocket("ws://"+ApiRootHostname_nodir()+"channel/dalalbull/portfolio-channel/");

@Component({
  selector: 'app-dalalbull-play',
  templateUrl: './dalalbull-play.component.html',
  styleUrls: ['./dalalbull-play.component.css', '../dalalbull.component.css'],
  animations: [
    trigger('blurStatus', [
      state('blur', style({
        filter: 'blur(5px)'
      })),
      state('noblur',   style({
        filter: 'none'
      })),
      transition('noblur => blur', animate('500ms ease-in')),
      transition('blur => noblur', animate('500ms ease-out'))
    ]),
    trigger('visibility', [
      state('invisible', style({
        display: 'none'
      })),
      state('visible',   style({
        display: 'auto'
      })),
      transition('invisible => visible', animate('500ms ease-in')),
      transition('visible => invisible', animate('500ms ease-out'))
    ])
  ]
})
export class DalalbullPlayComponent implements OnInit {

  tickerSymbols = [];
  tickerData;
  userPortfolio;
  searchKeyword: string = "";
  filteredSearchResults: object[] = [];
  blurStatus: string = 'noblur';
  activeStock: string;
  stockVisibility: string = 'invisible';

  data = {
    labels: [],
    datasets: [
      {
        label: 'NIFTY 50',
        data: [],
        fill: false,
        borderColor: '#00e311',
        lineTension: .1
      },
    ],
  };

  options = {
    responsive: true,
    tooltips: {
      mode: 'label',
    },
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          display: true,
          color: 'rgba(255, 255, 255, .2)'
        },
        scaleLabel: {
          display: true,
          labelString: 'Time'
        }
      }],
      yAxes: [{
        display: true,
        gridLines: {
          display: true,
          color: 'rgba(255, 255, 255, .2)'
        },
        scaleLabel: {
          display: true,
          labelString: 'Stock Value'
        }
      }]
    }
  };


  @ViewChild(DalalbullStockComponent) child: DalalbullStockComponent;

  public stockMap: StockMap = new StockMap();

  constructor(
    private dalalbullService: DalalbullService,
    private auth: AuthService,
    private router: Router,
    private socket: WebsocketService
  ) { }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  ngOnInit() {

    if (this.auth.isAuthenticated()) {
      this.dalalbullService.addDBUser()
        .subscribe(res => {
          this.getUserPortfolio();
          this.getTickerData();
          this.getGraphData();
        });
    } else {
      this.router.navigate(['/signin']);
    }

  }

  isSubstring (s, t) {
    if(s&&t){
      return s.toLowerCase().includes(t.toLowerCase());
    }
    else{
      return false;
    }
  }


  search(haystack, needle) {
    return haystack.filter(s => this.isSubstring(s.name, needle));
  }

  refreshSearchStatus() {
    if (this.searchKeyword) {
      var result = this.search(this.tickerData, this.searchKeyword);
      this.filteredSearchResults = result;
    } else {
      this.filteredSearchResults = this.tickerData;
    }
  }

  openStockPanel(symbol: string) {
    this.activeStock = null;
    setTimeout(() => {
      this.activeStock = symbol;
      this.stockVisibility = 'visible';
      this.blurStatus = 'blur';
    }, 300);
  }

  getUserPortfolio() {
    this.dalalbullService.pullUserPortfolio()
      .subscribe(res => {
        this.userPortfolio = res;
      });

    // myPortfolioWs.onMessage(
    //   (msg: MessageEvent)=> {
    //     var data = JSON.parse(msg.data);
    //     if (!data.accept) {
    //       this.userPortfolio = {};
    //       this.userPortfolio.rank = data.rank;
    //       this.userPortfolio.net_worth = data.net_worth;
    //       this.userPortfolio.cash_bal = data.cash_bal;
    //       this.userPortfolio.margin = data.margin;
    //     }
    //   },
    //   {autoApply: false}
    // );
  }

  getTickerData() {
    this.dalalbullService.pullTickerData()
      .subscribe(res => {
        this.tickerData = res["tickerData"];
        this.tickerSymbols = [];
        this.tickerData.forEach((t) => {
          this.tickerSymbols.push(t.name);
        });
        this.tickerData.forEach((t) => {
          this.tickerSymbols.push(this.stockMap.map[t.name]);
        });
        this.filteredSearchResults = this.tickerData;
      });

    // myTickerWs.onMessage(
    //     (msg: MessageEvent)=> {
    //       var data = JSON.parse(msg.data);
    //       if (data.tickerData) {
    //         // console.log(this.tickerData);
    //         this.tickerData = [];
    //         setTimeout(() => {
    //           this.tickerData = data.tickerData;
    //           this.filteredSearchResults = this.tickerData;
    //         }, 5);
    //       }
    //     },
    //     {autoApply: false}
    // );
  }

  getGraphData() {
    this.dalalbullService.pullGraphData()
      .subscribe(res => {
        console.log(res);
        var p = res["graph_data"];
        this.changeGraphData(p);

        // this.socket.graphDataPull();
      });
  }



  changeGraphData(p) {
    this.data.datasets[0].data = [];
    this.data.labels = [];
    for (let x of p) {
      this.data.datasets[0].data.push(x[1]);
      this.data.labels.push(x[0]);
    }
    // myGraphWs.onMessage(
    //     (msg: MessageEvent)=> {
    //       var data = msg.data;

    //       if (data.graph_data) {
    //         var new_data = data.graph_data;
    //         this.chart.chart.config.data.labels = [];
    //         this.chart.chart.config.data.datasets[0].data = [];
    //         this.chart.ngOnChanges({});

    //         setTimeout(() => {
    //           this.lineChartLabels.push(new_data[0]);
    //           this.lineChartData[0].data.push(parseFloat(new_data[1]));
    //           this.chart.ngOnChanges({});
    //         }, 5);
    //       }
    //     },
    //     {autoApply: false}
    // );
  }
  closePanel() {
    // this.getUserPortfolio();
    this.activeStock = null;
    this.stockVisibility = 'invisible';
    this.blurStatus = 'noblur';
  }

}
