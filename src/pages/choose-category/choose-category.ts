import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChooseBeerTypePage } from '../choose-beer-type/choose-beer-type';

/*
  Generated class for the ChooseCategory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-choose-category',
  templateUrl: 'choose-category.html'
})
export class ChooseCategoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  showBeerTypes() {
  	this.navCtrl.push(ChooseBeerTypePage);
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseCategoryPage');
  }

}
