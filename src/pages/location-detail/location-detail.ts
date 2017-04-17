import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Platform } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Ionic2RatingModule } from 'ionic2-rating';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { LocationService } from '../../providers/location-service';
import { GoogleService } from '../../providers/google-service';
import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton-service';

import { LocationMapPage } from '../location-map/location-map';
import { LocationDetailsMorePage } from '../location-details-more/location-details-more';
import { CheckinPage } from '../checkin/checkin';
import { DrinkMenuPage } from '../drink-menu/drink-menu';

import firebase from 'firebase';

declare var window;

@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html'
})
export class LocationDetailPage {

  @ViewChild('map') mapElement;
  public placeId:any;
  public locScore:any;
  public locImages:any;
  public locMap:any;
  public location:any;
  public locationRating:any;
  public locationHours:any;
  public locationOpen:any;
  public locationPhoto:any;
  public locationLat:any;
  public locationLng:any;
  public locationReviews:any;
  public loading:any;
  public checkins:FirebaseListObservable<any>;
  public checkinLen:number;
  public breweryBeers = new Array();
  public locationPhotosArray = new Array();
  public showPhotos:boolean = false;

  constructor(public navCtrl:NavController, 
  	          public params:NavParams,
              public loadingCtrl:LoadingController,
  	          public loc:LocationService,
              public modalCtrl:ModalController,
              public beerAPI:BreweryService,
              public sing:SingletonService,
              public platform:Platform,
              public angFire:AngularFire,
  	          public geo:GoogleService) {

    this.location = params.get("location");
    this.checkins =  this.angFire.database.list('/checkin/locations/'+this.location.place_id,{
      query:{
        orderByChild:'dateCreated'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;;

    // sort by date
    this.checkins.subscribe(resp=>{
      this.checkinLen = resp.length;
      //console.log('resp',resp);   
    });
  }

  showLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  viewMap() {
    let modal = this.modalCtrl.create(LocationMapPage,
                                      { lat:this.locationLat,
                                        lng:this.locationLng,
                                        locName:this.location.name
                                      });
    modal.present();
  }

  getBackgroundImg(pic) {
    let img:any;
    img = {backgroundImage:''};
    if(pic == null || pic == '')
      return;
    else {
      img.backgroundImage = 'url('+pic+')';
      return img;
    }
  }

  fixBreweryBeers() {

    for (var i = 0; i < this.breweryBeers.length; i++) {
      if (!this.breweryBeers[i].hasOwnProperty('labels')) {
        this.breweryBeers[i]['labels'] = {icon:'images/no-image.jpg',medium:'images/no-image.jpg'};
      }
      if (!this.breweryBeers[i].hasOwnProperty('style')) {
        this.breweryBeers[i]['style'] = {shortName:''};  
      }
    }
  }

  viewMore() {
     this.navCtrl.push(LocationDetailsMorePage,{location:this.location,
                                                photo:this.locationPhoto}); 
  }

  showDrinkMenu() {
    this.navCtrl.push(DrinkMenuPage,{location:this.location});
  }

  isBrewery() {

    this.beerAPI.findBreweriesByGeo(this.locationLat,this.locationLng,1).subscribe((brewery)=>{

      if (brewery.hasOwnProperty('data')) {

        for (let i=0;i<brewery.data.length;i++) {

          let breweryAPIName = brewery.data[i].brewery.nameShortDisplay.toLowerCase();
          let locationName = this.location.name.toLowerCase();
 
          // brewery found.  Get beers.
          if (locationName.indexOf(breweryAPIName) !== -1) {
            //console.log('test:'+breweryAPIName+'|'+locationName,locationName.indexOf(breweryAPIName));
            this.beerAPI.loadBreweryBeers(brewery.data[i].brewery.id).subscribe((beers)=>{
              
              if (beers.hasOwnProperty('data')) {
                this.breweryBeers = beers.data;
                this.fixBreweryBeers();
              }
              //console.log(beers);
            });
          }
        }
        //console.log('brewery',brewery);
      }
    });
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

  callIt(phoneNo) {
    phoneNo = encodeURIComponent(phoneNo);
    window.location = "tel:"+phoneNo;
  }

  checkIn() {
    let modal = this.modalCtrl.create(CheckinPage,{ location:this.location,checkinType:'place'});
    modal.present();    
  }

  getGoogleStaticMap() {
    return this.geo.getStaticMap(this.locationLat,this.locationLng);
  }

  goToNavApp() {
      let destination = this.locationLat + ',' + this.locationLng;

      if(this.platform.is('ios')){
        window.open('maps://?q=' + destination, '_system');
      } else {
        let label = encodeURIComponent(this.location.name);
        window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }    
  }

  showAllPhotos() {

   this.showLoading('Loading Pictures');
   this.getPlacePhotos().then(success=>{
      this.showPhotos = true;
      this.loading.dismiss();
   });

  }

  getPlacePhotos() {
    return new Promise(resolve => {

      for (let i = 1; i < this.locationPhotosArray.length; i++) {

        this.geo.placePhotos(this.locationPhotosArray[i].photo_reference).subscribe((photo)=>{
            this.locationPhotosArray[i]['url'] = photo.url;
            if (i == (this.locationPhotosArray.length-1))
              resolve(true);
        });
      }
    });
  }

  getTimestamp(prevTime) {
    return this.sing.timeDifference(new Date().getTime(),prevTime,true);
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad LocationDetailPage');

    this.locationRating = this.location.rating;

    // get picture
    if (this.location.hasOwnProperty('photos')) {
      this.geo.placePhotos(this.location.photos[0].photo_reference).subscribe((photo)=>{
        this.locationPhoto = photo.url;
      });
    } else {
      // this.locationPhoto = '../images/bar3.jpg';
      this.locationPhoto = null;
    }

    if (this.location.hasOwnProperty('opening_hours')) {
      //this.locationHours = this.location.opening_hours.weekday_text;
      let dayOfWeek = this.location.opening_hours.periods[new Date().getDay()];
      this.locationOpen = this.location.opening_hours.open_now;
      this.locationHours = this.sing.getFormattedTime(dayOfWeek.open.time) 
                          + ' - ' + this.sing.getFormattedTime(dayOfWeek.close.time);

    }
    else {
      this.locationHours = null;
      this.locationOpen = null;
    }    

    // get lat, lng
    if (this.location.hasOwnProperty('geometry')) {
      this.locationLat = this.location.geometry.location.lat;
      this.locationLng = this.location.geometry.location.lng;
    }

    // get reviews
    if (this.location.hasOwnProperty('reviews')) {
      this.locationReviews = this.location.reviews;
    }

    // get photo array
    if (this.location.hasOwnProperty('photos')) {
      this.locationPhotosArray = this.location.photos;
    }     

    let ptypes ='';
    
    for (var i = 0; i < this.location.types.length; i++) {
        
        if (this.location.types[i] == 'bar'
            || this.location.types[i] == 'night_club'
            || this.location.types[i] == 'convenience_store'
            || this.location.types[i] == 'liquor_store'
            || this.location.types[i] == 'gas_station'
            || this.location.types[i] == 'grocery_or_supermarket') {
          ptypes += this.fixPlaceType(this.location.types[i]) +', ';
        }
    }

    this.location.place_types = ptypes.replace(/,\s*$/, "").replace(/_/g, " ");
    //console.log('location',this.location);
  }

}
