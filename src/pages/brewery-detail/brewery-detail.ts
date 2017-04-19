import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, Platform } from 'ionic-angular';
import { GoogleService } from '../../providers/google-service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SingletonService } from '../../providers/singleton-service';

import { BeerDetailPage } from '../beer-detail/beer-detail';
import { LocationMapPage } from '../location-map/location-map';
import { BreweryDetailMorePage } from '../brewery-detail-more/brewery-detail-more';
import { DrinkMenuPage } from '../drink-menu/drink-menu';
import { CheckinPage } from '../checkin/checkin';

declare var window: any;
declare var cordova: any;

@Component({
  selector: 'page-brewery-detail',
  templateUrl: 'brewery-detail.html'
})
export class BreweryDetailPage {

  public brewery:any;
  public breweryBeers:any;
  public breweryDescription:string;
  public breweryHours:string;
  public location:any;
  public locationOpen:any;
  public locationPhoto:any;
  public locationReviews:any;
  public loading:any;
  public locationPhotosArray = new Array();
  public showPhotos:boolean = false;  
  public locationRating:any;
  public checkins:FirebaseListObservable<any>;
  public checkinLen:number;
  public checkinsPerPage:number;
  public limit:any;
  public lastKey:string;
  public queryable:boolean = true;  

  constructor(public navCtrl: NavController, 
              public params: NavParams,
              public geo: GoogleService,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              public angFire: AngularFire,
              public sing: SingletonService,
              public modalCtrl:ModalController) {

  	this.brewery = params.get('brewery');
    this.breweryBeers = params.get('beers');
    this.location = params.get('place');
    //console.log('place',this.location);
    //console.log('brewery',this.brewery);

    this.checkinsPerPage = sing.checkinsPerPage;
    this.limit = new BehaviorSubject(this.checkinsPerPage);    

    if (this.brewery.hasOwnProperty('brewery')) {
      this.breweryDescription = this.brewery.brewery.description;
    } else {
      this.breweryDescription = null;	
    }

    if (this.brewery.hasOwnProperty('hoursOfOperation')) {
      this.breweryHours = this.brewery.hoursOfOperation;
    } else {
      this.breweryHours = null;	
    }

    if (!this.brewery.brewery.hasOwnProperty('images')) {
      
      this.brewery['brewery']['images'] = {icon:'images/no-image.jpg',
                                           medium:'images/no-image.jpg',
                                           squareMedium:'images/no-image.jpg', 
                                           large:'images/no-image.jpg'};      
    }
    

    if (this.breweryBeers.hasOwnProperty('data')) {
    	this.breweryBeers = this.breweryBeers.data;
    	this.fixBreweryBeers();
    } else {
    	this.breweryBeers = new Array();
    }
    //console.log('brewery',this.brewery);

    this.checkins =  this.angFire.database.list('/checkin/brewery/'+this.brewery.id,{
      query:{
        orderByChild:'dateCreated'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;;

    this.checkins.subscribe(resp=>{
      this.checkinLen = resp.length;
    });

  }

  getCheckIns() {
    this.checkins =  this.angFire.database.list('/checkin/brewery/'+this.brewery.id,{
      query:{
        orderByChild:'priority',
        limitToFirst: this.limit
      }
    });
  
    this.angFire.database.list('/checkin/brewery/'+this.brewery.id,{
      query: {
        orderByChild: 'priority',
        limitToLast: 1
      }
    }).subscribe((data) => {
      // Found the last key
      if (data.length > 0) {
        this.lastKey = data[0].$key;
      } else {
        this.lastKey = '';
      }
    });
  
    this.checkins.subscribe(resp=>{
      this.checkinLen = resp.length;
      //console.log('resp',resp);
      if (resp.length > 0) {
        // If the last key in the list equals the last key in the database
        if (resp[resp.length - 1].$key === this.lastKey) {
          this.queryable = false;
        } else if(resp.length < this.checkinsPerPage){
          this.queryable = false;
        }else {
          this.queryable = true;
        }
      }      
    });
  }

  getMoreCheckins(infiniteScroll) {
   //console.log('inf',infiniteScroll);
    setTimeout(() => {
      if (this.queryable)
        this.limit.next(this.limit.getValue()+this.checkinsPerPage);

        infiniteScroll.complete();

      if (!this.queryable)
        infiniteScroll.enable(false);
    }, 1000);
  }  

  fixBreweryBeers() {

    let numThumbNulls:number = 0;
    let showAll:boolean = false;

  	for (var i = 0; i < this.breweryBeers.length; i++) {
      
  	  if (!this.breweryBeers[i].hasOwnProperty('labels')) {
  	  	this.breweryBeers[i]['labels'] = {icon:'zzz',medium:'images/no-image.jpg'};
        numThumbNulls++;
  	  } 

  	  if (!this.breweryBeers[i].hasOwnProperty('style')) {
  	    this.breweryBeers[i]['style'] = {shortName:''};	
  	  }
  	}
    this.breweryBeers.sort(this.compare);
    //console.log(this.breweryBeers);
  }

  compare(a,b) {
    if (a.labels.icon < b.labels.icon)
      return -1;
    if (a.labels.icon > b.labels.icon)
      return 1;
    return 0;
  }  

  showMap(beer) {
    
    let modal = this.modalCtrl.create(LocationMapPage,
                                      { lat:beer.latitude,
                                        lng:beer.longitude,
                                        locName:beer.name
                                      });
    modal.present();
  }

  getGoogleStaticMap() {
      return this.geo.getStaticMap(this.brewery.latitude,this.brewery.longitude);
  }

  callIt(phoneNo) {
    phoneNo = encodeURIComponent(phoneNo);
    window.location = "tel:"+phoneNo;
  }

  checkIn(brewery) {
    
    let modal = this.modalCtrl.create(CheckinPage,{
                                                    checkinType:'brewery',
                                                    brewery:this.brewery,
                                                    location:this.location,
                                                    beers:this.breweryBeers
                                                  });
    modal.onDidDismiss(()=> {
      // this.getBeerReviews();
    });
    modal.present();
    
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

  showAllPhotos() {

   this.showLoading('Loading Pictures');
   this.getPlacePhotos().then(success=>{
      this.showPhotos = true;
      this.loading.dismiss();
   });

  }

  showLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
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

  viewMore() {
     this.navCtrl.push(BreweryDetailMorePage,{location:this.location,
                                              brewery:this.brewery,
                                              photo:this.locationPhoto}); 
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

  showDrinkMenu() {
    this.navCtrl.push(DrinkMenuPage,{beers:this.breweryBeers,brewery:this.brewery,location:this.location});
  }

  getBeerDetail(beer) {
    this.navCtrl.push(BeerDetailPage,{beerId:beer.id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BreweryDetailPage');

    // get rating from google places
    if (this.location != null && this.location.hasOwnProperty('rating'))
      this.locationRating = this.location.rating;

    // check if open
    if (this.location != null && this.location.hasOwnProperty('opening_hours'))
      this.locationOpen = this.location.opening_hours.open_now;

    // get picture
    if (this.location != null && this.location.hasOwnProperty('photos')) {
      this.geo.placePhotos(this.location.photos[0].photo_reference).subscribe((photo)=>{
        this.locationPhoto = photo.url;
      });
    } else {
      // this.locationPhoto = '../images/bar3.jpg';
      this.locationPhoto = null;
    }

    // get reviews
    if (this.location.hasOwnProperty('reviews')) {
      this.locationReviews = this.location.reviews;
    }    

    // get photo array
    if (this.location.hasOwnProperty('photos')) {
      this.locationPhotosArray = this.location.photos;
    }     

  }

}
