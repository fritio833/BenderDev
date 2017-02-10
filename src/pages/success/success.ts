import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChooseCategoryPage } from '../choose-category/choose-category';


/*
  Generated class for the Success page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-success',
  templateUrl: 'success.html'
})
export class SuccessPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  showChooseCategory() {
  	this.navCtrl.setRoot(ChooseCategoryPage);
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

}
