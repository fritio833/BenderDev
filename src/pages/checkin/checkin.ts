import { Component } from '@angular/core';
import { NavController, NavParams,ViewController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation, SocialSharing } from 'ionic-native';
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
  public locations;
  public location;
  public locationsLen:number;
  public price:number;
  public socialMessage:string;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
  	          public view: ViewController,
  	          public geo:GoogleService,
              public toastCtrl:ToastController,
              public alertCtrl:AlertController) {

    this.beer = params.get("beer");
    this.price = 0;
    console.log(this.beer);
  }

  cancel() {
    this.view.dismiss();
  }

  priceSiderFormat(price) {
    return price.toFixed(2);
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
          this.locations = success.results;
          //this.locationsLen = this.locations.length;
    	  	this.locationsLen = this.locations.length;
          this.location = this.locations[0]; 
          console.log(this.locations[0]);
          console.log('beer name',this.beer.name);
    	  });
    });

    //this.geo.placesNearByMe()
  }

  shareOnFacebook() {

      let image:string = this.beer.labels.large;

      SocialSharing.shareViaFacebook('message me',null,'http://benderapp.com').then((success)=>{
         //Enter bender points here
      }).catch((error) => {
         this.presentAlert("Make sure you have the Facebook app installed.");
      });

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }     

}
