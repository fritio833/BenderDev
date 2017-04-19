import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton-service';
import { Beer } from '../../models/beer';

import { LoginPage } from '../login/login';
import { ReviewBeerPage } from '../review-beer/review-beer';
import { CheckinPage } from '../checkin/checkin';
import { Ionic2RatingModule } from 'ionic2-rating';



import firebase from 'firebase';

@Component({
  selector: 'page-beer-detail',
  templateUrl: 'beer-detail.html',
  providers: [BreweryService]
})
export class BeerDetailPage {

  public beerId:string;
  public beer:Beer;
  public hideSave:boolean = false;
  public beerLikes:number;
  public beerReviews:any;
  public overallBeerRating:number;
  public beerReviewCount:number;
  public favBeerRef:any;
  public checkins:FirebaseListObservable<any>;
  public checkinLen:number;
  public uid:any;
  public beerLoaded:boolean = false;
  public checkinsPerPage:number;
  public limit:any;
  public lastKey:string;
  public queryable:boolean = true;  

  constructor( public navCtrl: NavController, 
               public navParams: NavParams, 
               public beerAPI: BreweryService, 
               public storage:Storage, 
               public toastCtrl:ToastController, 
               public sing:SingletonService,
               public angFire:AngularFire,
               public modalCtrl:ModalController) {

    this.beerId = navParams.get('beerId');
    this.checkinsPerPage = this.sing.checkinsPerPage;
    this.limit = new BehaviorSubject(this.checkinsPerPage);    
    //this.getLikeBeer(this.beerId);

    this.storage.ready().then(()=>{
      this.storage.get('uid').then(uid=>{
        this.uid = uid;
        this.favBeerRef = firebase.database();        
      });
    });
    /*
    this.checkins =  this.angFire.database.list('/checkin/beers/'+this.beerId,{
      query:{
        orderByChild:'dateCreated'
      }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;;

    // sort by date
    this.checkins.subscribe(resp=>{
      this.checkinLen = resp.length;
      //console.log('resp',resp);   
    });
    */
  }

  getCheckIns() {
    this.checkins =  this.angFire.database.list('/checkin/beers/'+this.beerId,{
      query:{
        orderByChild:'priority',
        limitToFirst: this.limit
      }
    });
  
    this.angFire.database.list('/checkin/beers/'+this.beerId,{
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
        } else {
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

  ionViewDidLoad() {

    console.log('ionViewDidLoad BeerDetailPage');

    this.getCheckIns();

    this.beerAPI.loadBeerById(this.beerId).subscribe(beer => {
      this.beer = beer;
      this.loadBeer(this.beer);
      //console.log(this.beer);
      this.getBeerReviews();
      setTimeout(()=>{this.beerLoaded = true;},500);
      
    });
  }
 
  loadBeer(data) {

    this.beer = data.data;

    // fix beers with no images
    if (!this.beer.hasOwnProperty('labels')) {
      this.beer['labels'] = {icon:'images/no-image.jpg',
                             medium:'images/no-image.jpg',
                             large:'images/no-image.jpg'};
    }

    // fix breweries without pictures
    if (!this.beer['breweries'][0].hasOwnProperty('images')) {
      this.beer['breweries'][0].images = {icon:'images/no-image.jpg',
                                          medium:'images/no-image.jpg',
                                          large:'images/no-image.jpg'};  
    }

    // fix no beer category
 	  if (!this.beer.hasOwnProperty('style')) {
      this.beer['style'] = {category:{name:'',createDate:'',id:''}};
    }

    // fix no description in available    
 	  if (!this.beer.hasOwnProperty('available')) {
      this.beer['available'] = {description:'',name:'',id:''};
    }

    if (!this.beer.hasOwnProperty('glass')) {
      this.beer['glass'] = {createDate:'',name:'',id:''};
    }    
    //console.log('detail',this.beer);
  }

  saveBeerToFavorites(beerId) {
    this.beer['timestamp'] = firebase.database.ServerValue.TIMESTAMP;
    this.favBeerRef.ref('/favorite_beers/'+this.uid+'/'+beerId).set(this.beer);
    this.presentToast(this.beer.name + ' saved to favorites.');
  }

  checkIn(beer) {
    
    let modal = this.modalCtrl.create(CheckinPage,{checkinType:'beer',beer:beer});
    modal.onDidDismiss(()=> {
      this.getBeerReviews();
    });
    modal.present();
    
  }

  getBeerReviews() {

     let beerRatingTotal:number = 0;
     this.beerReviewCount = 0;
     /*
     this.db.getBeerReviewsById(this.beerId).subscribe(success=>{

      this.beerReviews = success.data;

      for (let i = 0; i < this.beerReviews.length; i++) {

        if (parseInt(this.beerReviews[i].beer_rating)) {
          beerRatingTotal += parseInt(this.beerReviews[i].beer_rating);
          this.beerReviewCount++;  
        }
      }

      this.overallBeerRating = beerRatingTotal  / this.beerReviewCount;


    });
    */
  }

  removeBeerFromFavorites(beerId) {
       
      this.storage.get("beers").then((beerArray)=>{   

        for (let i = 0; i < beerArray.length; i++) {
        
          if (beerArray[i].id == beerId ){
            this.presentToast(beerArray[i].name + " removed from favorites.");
            beerArray.splice(i,1);
            this.storage.set('beers',beerArray);

            return;
          }
        }          

      });
  }

  doLogin() {

    this.navCtrl.push(LoginPage);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  reviewBeer(beer) {

    let modal = this.modalCtrl.create(ReviewBeerPage,{
                                         beerId:beer.id,
                                         beerName:beer.name,
                                         beerPic:beer.labels.icon
                                       });
    modal.onDidDismiss(()=> {
      this.getBeerReviews();
    });
    modal.present();

  }

  ionViewWillEnter() { 
       
      // console.log("HERE VIEW WILL ENTER"); 

  }  


}
