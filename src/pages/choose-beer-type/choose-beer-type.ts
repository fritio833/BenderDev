import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { BeerListPage } from '../beer-list/beer-list';

/*
  Generated class for the ChooseBeerType page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-choose-beer-type',
  templateUrl: 'choose-beer-type.html'
})
export class ChooseBeerTypePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseBeerTypePage');
  }

}
