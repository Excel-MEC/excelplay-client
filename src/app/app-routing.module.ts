import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { KryptosComponent } from './components/kryptos/kryptos.component';
import { KryptosPlayComponent } from './components/kryptos/kryptos-play/kryptos-play.component';
import { KryptosRanklistComponent } from './components/kryptos/kryptos-ranklist/kryptos-ranklist.component';
import { KryptosRulesComponent } from './components/kryptos/kryptos-rules/kryptos-rules.component';

import { DalalbullComponent } from './components/dalalbull/dalalbull.component';
import { DalalbullPlayComponent } from './components/dalalbull/dalalbull-play/dalalbull-play.component';
import { DalalbullRulesComponent } from './components/dalalbull/dalalbull-rules/dalalbull-rules.component';
import { DalalbullRanklistComponent } from './components/dalalbull/dalalbull-ranklist/dalalbull-ranklist.component';
import { DalalbullHistoryComponent } from './components/dalalbull/dalalbull-history/dalalbull-history.component';


import { SigninComponent } from './components/signin/signin.component';
import { CallbackComponent } from './components/callback/callback.component';

export const AppRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'games', children: [
        { path: 'kryptos', component: KryptosComponent, children: [
        { path: '', component: KryptosPlayComponent },
        { path: 'ranklist', component: KryptosRanklistComponent },
        { path: 'rules', component: KryptosRulesComponent }
        ] },
    //   { path: 'hashinclude', component: HashincludeComponent, children: [
    //     { path: '', component: HashincludePlayComponent },
    //     { path: 'ranklist', component: HashincludeRanklistComponent },
    //     { path: 'submissions', component: HashincludeStatusComponent },
    //     { path: 'rules', component: HashincludeRulesComponent },
    //     { path: 'my-submissions', component: HashincludeMysubComponent },
    //     { path: ':question_id', component: HashincludePlayComponent },
    //   ] },
      // { path: 'dalalbull', component: DalalbullFakeComponent },
      { path: 'dalalbull', component: DalalbullComponent, children: [
        { path: '', component: DalalbullPlayComponent },
        { path: 'ranklist', component: DalalbullRanklistComponent },
        { path: 'rules', component: DalalbullRulesComponent },
        { path: 'history', component: DalalbullHistoryComponent },
        { path: 'history/:tab', component: DalalbullHistoryComponent },
      ] },
    //   { path: 'echo', component: EchoComponent, children: [
    //     { path: '', component: EchoPlayComponent },
    //     { path: 'ranklist', component: EchoRanklistComponent },
    //     { path: 'rules', component: EchoRulesComponent }
    //   ] },
    ] },
    ];