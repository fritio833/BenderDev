import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SearchBeerPage } from '../search-beer/search-beer';
import { SearchLocationPage } from '../search-location/search-location';

@Component({
  selector: 'page-search-start',
  templateUrl: 'search-start.html'
})
export class SearchStartPage {

  constructor(public navCtrl: NavController, public view: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchStartPage');
  }

  cancel() {
    this.view.dismiss();
  }

  doSearch(type){
  	this.view.dismiss(type);
  }
}
