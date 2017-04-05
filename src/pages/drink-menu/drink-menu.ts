import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BeerDetailPage } from '../beer-detail/beer-detail';

@Component({
  selector: 'page-drink-menu',
  templateUrl: 'drink-menu.html'
})
export class DrinkMenuPage {

  public breweryBeers:any;
  public brewery:any;

  constructor(public navCtrl: NavController, public params: NavParams) {
    this.breweryBeers = params.get('beers');
    this.brewery = params.get('brewery');
    console.log('brewery',this.brewery);
    console.log('beers',this.breweryBeers);
  }

  getBeerDetail(beer) {
  	this.navCtrl.push(BeerDetailPage,{beerId:beer.id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrinkMenuPage');
  }

}
