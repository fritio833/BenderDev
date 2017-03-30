import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Ionic2RatingModule } from 'ionic2-rating';

import { LocationService } from '../../providers/location-service';
import { GoogleService } from '../../providers/google-service';
import { BreweryService } from '../../providers/brewery-service';

import { LocationMapPage } from '../location-map/location-map';


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
  public breweryBeers = new Array();

  constructor(public navCtrl:NavController, 
  	          public params:NavParams,
              public loadingCtrl:LoadingController,
  	          public loc:LocationService,
              public modalCtrl:ModalController,
              public beerAPI:BreweryService,
  	          public geo:GoogleService) {

    //this.placeId = params.get("placeId");
    this.location = params.get("location");
    this.showLoading();
  }



  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading. Please wait...',
      duration:2000
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

  ionViewDidLoad() {

    console.log('ionViewDidLoad LocationDetailPage');

    this.locationRating = this.location.rating;

    if (this.location.hasOwnProperty('opening_hours')) {
      this.locationHours = this.location.opening_hours.weekday_text;
      this.locationOpen = this.location.opening_hours.open_now;
    }
    else {
      this.locationHours = null;
      this.locationOpen = null;
    }

    // get picture
    if (this.location.hasOwnProperty('photos')) {
      this.geo.placePhotos(this.location.photos[0].photo_reference).subscribe((photo)=>{
        this.locationPhoto = photo.url;
      });
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
    //console.log('resp',this.location);

    let ptypes ='';
    
    for (var i = 0; i < this.location.types.length; i++) {
        
        if (this.location.types[i] == 'bar'
            || this.location.types[i] == 'night_club'
            || this.location.types[i] == 'convenience_store'
            || this.location.types[i] == 'liquor_store'
            || this.location.types[i] == 'grocery_or_supermarket') {
          ptypes += this.location.types[i] + ', ';
        }
    }

    this.location.place_types = ptypes.replace(/,\s*$/, "").replace(/_/g, " ");
    this.loading.dismiss();
    console.log('location',this.location);

  }

}
