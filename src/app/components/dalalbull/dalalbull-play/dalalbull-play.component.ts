import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';

import { DalalbullService } from '../../../services/dalalbull.service';

import { ApiRootHostname_nodir } from '../../../classes/api-root';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { StockMap } from '../../../classes/stock-map';

import { DalalbullStockComponent } from '../dalalbull-stock/dalalbull-stock.component';

import { AuthService } from '../../../services/auth.service';
import { WebsocketService } from '../../../services/websocket.service';
import { CommonService } from '../../../services/common.service';

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
export class DalalbullPlayComponent implements OnInit, OnDestroy {

  tickerSymbols = [];
  tickerData;
  userPortfolio;
  searchKeyword: string = "";
  filteredSearchResults: object[] = [];
  blurStatus: string = 'noblur';
  activeStock: string;
  stockVisibility: string = 'invisible';
  userRanks;

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

  legend = { display: false };

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
  private wsQueue = [];
  private getAPIInterval;

  constructor(
    private dalalbullService: DalalbullService,
    private auth: AuthService,
    private router: Router,
    private websocketService: WebsocketService,
    private commonService: CommonService,
  ) { }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  getAllData() {
    this.getUserPortfolio();
    this.getAllRanks();
    this.getTickerData();
    this.getGraphData();
  }

  ngOnInit() {

    if (this.auth.isAuthenticated()) {
      this.dalalbullService.addDBUser()
        .subscribe(res => {
          this.getAllData();
          // this.getAPIInterval = setInterval(() => {
          //   this.getAllData();
          // }, 5*1000*60);
        });
    } else {
      this.router.navigate(['/signin']);
    }

  }

  isSubstring (s, t) {
    if (s && t)
      return s.toLowerCase().includes(t.toLowerCase());
    return false;
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

  handlePortfolioData(d) {
    if (d.hasOwnProperty('cash_bal'))
      this.userPortfolio = d;
  }

  getUserPortfolio() {
    this.dalalbullService.pullUserPortfolio()
      .subscribe(res => {
        this.handlePortfolioData(res);

        this.wsQueue.push(
          this.websocketService.pullPortfolioData()
            .subscribe(res2 => {
              if (res2.hasOwnProperty('data'))
                this.handlePortfolioData(res2['data']);
            })
        );
      });
  }

  handleTickerData(r) {
    if (r.hasOwnProperty('tickerData')) {
      this.tickerData = r['tickerData'];
      this.tickerSymbols = [];
      this.tickerData.forEach((t) => {
        this.tickerSymbols.push(t.name);
      });
      this.tickerData.forEach((t) => {
        this.tickerSymbols.push(this.stockMap.map[t.name]);
      });
      this.filteredSearchResults = this.tickerData;
    }
  }

  getAllRanks() {
    this.commonService.pullMyRanks()
        .subscribe(myrank => {
          this.userRanks = myrank;
        });
  }

  getTickerData() {
    this.dalalbullService.pullTickerData()
      .subscribe(res => {
        this.handleTickerData(res);

        this.wsQueue.push(
          this.websocketService.pullTickerData()
            .subscribe(res2 => {
              if (res2.hasOwnProperty('data'))
                this.handleTickerData(res2['data']);
            })
        );
      });
  }

  handleGraphData(d) {
    if (d.hasOwnProperty('graph_data')) {
      var p = d["graph_data"].slice(-50);
      this.data.datasets[0].data = [];
      this.data.labels = [];
      for (let x of p) {
        this.data.datasets[0].data.push(x[1]);
        this.data.labels.push(x[0]);
      }
    }
  }

  getGraphData() {
    this.dalalbullService.pullGraphData()
      .subscribe(res => {
        this.handleGraphData(res);

        this.wsQueue.push(
          this.websocketService.pullGraphData()
            .subscribe(res2 => {
              if (res2.hasOwnProperty('data'))
                this.handleGraphData(res2['data']);
            })
        );
      });
  }

  closePanel() {
    this.getUserPortfolio();
    this.activeStock = null;
    this.stockVisibility = 'invisible';
    this.blurStatus = 'noblur';
  }

  ngOnDestroy() {
    // var w;
    // for (w in this.wsQueue)
    //   w.unsubscribe();
    clearInterval(this.getAPIInterval);
  }

}
