import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { GoogleService } from '../../providers/google-service';

declare var window: any;

@Component({
  selector: 'page-brewery-detail-more',
  templateUrl: 'brewery-detail-more.html'
})
export class BreweryDetailMorePage {

  public brewery:any;
  public location:any;
  public locationPhoto:any;
  public locationOpen:any;
  public locationRating:any;
  public breweryDescription:string;
  public breweryHours:string;
  public locationHours:any;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
  	          public platform: Platform,
  	          public geo:GoogleService) {
  	this.brewery = params.get('brewery');
    this.location = params.get('location');
    this.locationPhoto = params.get('photo');
    console.log('locBrew',this.location);
    console.log('brewInfo',this.brewery);
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

  callIt(phoneNo) {
    phoneNo = encodeURIComponent(phoneNo);
    window.location = "tel:"+phoneNo;
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
    
  getGoogleStaticMap() {
      return this.geo.getStaticMap(this.brewery.latitude,this.brewery.longitude);
  }

  goToNavApp() {
      let destination = this.brewery.latitude + ',' + this.brewery.longitude;

      if(this.platform.is('ios')){
        window.open('maps://?q=' + destination, '_system');
      } else {
        let label = encodeURIComponent(this.location.name);
        window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }    
  }
      
  goToPlaceWebsite(url) {
    window.open(encodeURI(url),'_system');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BreweryDetailMorePage');

    // get rating from google places
    if (this.location != null && this.location.hasOwnProperty('rating'))
      this.locationRating = this.location.rating;    

    // check if open
    if (this.location != null && this.location.hasOwnProperty('opening_hours'))
      this.locationOpen = this.location.opening_hours.open_now;

    if (this.brewery.hasOwnProperty('brewery')) {
      this.breweryDescription = this.brewery.brewery.description;
    } else {
      this.breweryDescription = null;	
    }

    if (this.location.hasOwnProperty('opening_hours')) {

      this.locationHours = this.location.opening_hours.weekday_text;

    } else if (this.brewery.hasOwnProperty('hoursOfOperation')) {

      this.breweryHours = this.brewery.hoursOfOperation;

    } else {
      this.breweryHours = null;
      this.locationHours = null;	
    }    

  }

}
