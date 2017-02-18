import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationDetailPage } from '../location-detail/location-detail';

/*
  Generated class for the LocationResults page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-location-results',
  templateUrl: 'location-results.html'
})
export class LocationResultsPage {

  public locations:any;
  constructor(public navCtrl: NavController, public params: NavParams) {

    this.locations = params.get('locations');

  }

  getLocationDetail(location) {

  	this.navCtrl.push(LocationDetailPage,{location:location});

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationResultsPage');
  }

}
