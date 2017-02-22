import { Component } from '@angular/core';
import { NavController, NavParams,ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation, SocialSharing } from 'ionic-native';
import { GoogleService } from '../../providers/google-service';
import { DbService } from '../../providers/db-service';
import { SingletonService } from '../../providers/singleton-service';
import { Storage } from '@ionic/storage';

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
  public lat:number;
  public lng:number;
  public locChoice:number;
  public loading:any;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
  	          public view: ViewController,
  	          public geo:GoogleService,
              public toastCtrl:ToastController,
              public alertCtrl:AlertController,
              public db:DbService,
              public storage:Storage,
              public sing:SingletonService,
              public loadingCtrl:LoadingController) {

    this.beer = params.get("beer");
    this.price = 0;

    //console.log(this.beer);
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

      
      if ( this.sing.test ) {

        this.lat = this.sing.lat;
        this.lng = this.sing.lng;

      } else {

        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;

      }

    	this.geo.placesNearByMe(this.lat,this.lng)
    	  .subscribe((success)=>{
          this.locations = success.results;
    	  	this.locationsLen = this.locations.length;

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

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Checking in. Please wait...'
    });
    this.loading.present();
  }

  tackThisBeer() {

    if (this.locationsLen > 1 && this.locChoice == null) {
      this.presentAlert("Please choose a location");
    } else {
       this.showLoading();
       if (this.locationsLen > 1) {
         this.location = this.locations[this.locChoice];
       } else {
         this.location = this.locations[0];
       }

      this.geo.reverseGeocodeLookup(this.location.geometry.location.lat,this.location.geometry.location.lng)
      .subscribe((success)=> {
        this.storage.get("token").then((tok) => {
          this.db.tackBeer(tok,this.price,this.beer,this.location,success)
            .subscribe((success)=>{
                this.loading.dismiss();
                console.log("success");

                this.view.dismiss();
                this.presentToast("Check-in was successful");
          });
        });      
      });       
    }

    //this.view.dismiss();
  }

  selectLocation(index) {
    this.locChoice = index;
    console.log(this.locChoice);
  }

}
