import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { GoogleService } from '../../providers/google-service';



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
  	          public view: ViewController,
  	          public geo:GoogleService) {

    this.beer = params.get("beer");
    console.log(this.beer);
  }

  cancel() {
    this.view.dismiss();
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinPage');

    Geolocation.getCurrentPosition().then((resp) => {
        let lat:number;
        let lng:number;
    	//lat = resp.coords.latitude;
    	//lng = resp.coords.longitude;
        lat = 30.466237;
        lng = -84.269281;
    	this.geo.placesNearByMe(lat,lng)
    	  .subscribe((success)=>{
    	  	console.log(success);
    	  });
    });

    //this.geo.placesNearByMe()
  }

}
