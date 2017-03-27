import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the SearchLocationKey page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search-location-key',
  templateUrl: 'search-location-key.html'
})
export class SearchLocationKeyPage {

  public locations:any;

  constructor(public navCtrl: NavController, public params: NavParams, public view: ViewController) {
  	this.locations = params.get('locations');
  }

  selectLocation(event) {
  	this.view.dismiss(event);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchLocationKeyPage');
  }

}
