import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the MyRatings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-ratings',
  templateUrl: 'my-ratings.html'
})
export class MyRatingsPage {

  public reviews = new Array();
  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public storage:Storage) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyRatingsPage');
	  this.storage.get('reviews').then((reviewArray)=>{
	    this.reviews = reviewArray;
	    console.log('lkj',reviewArray);
	  });    
  }

}
