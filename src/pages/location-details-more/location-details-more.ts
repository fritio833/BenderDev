import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Ionic2RatingModule } from 'ionic2-rating';
import { GoogleService } from '../../providers/google-service';

import { LocationMapPage } from '../location-map/location-map';

declare var window: any;
declare var cordova: any;

@Component({
  selector: 'page-location-details-more',
  templateUrl: 'location-details-more.html'
})

export class LocationDetailsMorePage {

  public location:any;
  public locationHours:any;
  public locationOpen:any;
  public locationPhoto:any;
  public locationRating:any;
  public locationReviews:any;

  constructor(public navCtrl: NavController, 
              public params: NavParams,
              public platform:Platform, 
              public goog:GoogleService) {
    this.location = params.get('location');
    this.locationPhoto = params.get('photo');
  }

  fixPlaceType(placeType) {
    let pType = '';
    switch(placeType) {
      case 'bar': pType = 'Bar'; break;
      case 'convenience_store': pType = 'Convenience Store'; break;
      case 'night_club': pType = 'Night Clubs'; break;
      case 'grocery_or_supermarket': pType = 'Grocery Store'; break;
      case 'liquor_store': pType = 'Liquor Store'; break;
      case 'restaurant': pType = 'Restaurant'; break;
      case 'gas_station': pType = 'Gas Station'; break;
      default: pType = placeType;
    }
    return pType;
  }  

  priceLevel(price) {
    let str = '';
    switch(price) {
      case 1: str = '$ - Very Affordable'; break;
      case 2: str = '$$ - Affordable'; break;
      case 3: str = '$$$ - Expensive'; break;
      case 4: str = '$$$$ - Very Expensive'; break;
      default: str = '';
    }
    return str;
  }

  callIt(phoneNo) {
    phoneNo = encodeURIComponent(phoneNo);
    window.location = "tel:"+phoneNo;
  }
  
  goToPlaceWebsite(url) {
    window.open(encodeURI(url),'_system');
  }

  viewMap() {
    this.navCtrl.push(LocationMapPage,
                                      { lat:this.location.geometry.location.lat,
                                        lng:this.location.geometry.location.lng,
                                        locName:this.location.name
                                      });
  }

  getBackgroundImg(pic) {
    let img:any;
    img = {backgroundImage:''};
   
    if(pic == null)
      return;
    else {
      img.backgroundImage = 'url('+pic+')';
      return img;
    }
  }

  getGoogleStaticMap() {
    return this.goog.getStaticMap(this.location.geometry.location.lat,this.location.geometry.location.lng);
  }

  goToNavApp() {
      let destination = this.location.geometry.location.lat+','+this.location.geometry.location.lng;

      if(this.platform.is('ios')){
        window.open('maps://?q=' + destination, '_system');
      } else {
        let label = encodeURIComponent(this.location.name);
        console.log('label',label);
        window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationDetailsMorePage');

    this.locationRating = this.location.rating;

    if (this.location.hasOwnProperty('opening_hours')) {
      this.locationHours = this.location.opening_hours.weekday_text;
      this.locationOpen = this.location.opening_hours.open_now;
    }
    else {
      this.locationHours = null;
      this.locationOpen = null;
    }

    // get reviews
    if (this.location.hasOwnProperty('reviews')) {
      this.locationReviews = this.location.reviews;
    }
   

    //console.log('photo',this.locationPhoto);
    //console.log('loc',this.location);

  }

}
