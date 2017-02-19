import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';

/*
  Generated class for the Checkin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-checkin',
  templateUrl: 'checkin.html'
})
export class CheckinPage {

  public beer:any;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
  	          public view: ViewController) {

    this.beer = params.get("beer");
    console.log(this.beer);
  }

  cancel() {
    this.view.dismiss();
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinPage');
  }

}
