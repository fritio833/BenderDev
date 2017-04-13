import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton-service';
import { DbService } from '../../providers/db-service';
import { Beer } from '../../models/beer';

import { LoginPage } from '../login/login';
import { ReviewBeerPage } from '../review-beer/review-beer';
import { CheckinPage } from '../checkin/checkin';
import { Ionic2RatingModule } from 'ionic2-rating';

import firebase from 'firebase';

/*
  Generated class for the BeerDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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
  public uid:any;

  constructor( public navCtrl: NavController, 
               public navParams: NavParams, 
               public beerAPI: BreweryService, 
               public storage:Storage, 
               public toastCtrl:ToastController, 
               public sing:SingletonService,
               public db:DbService, 
               public modalCtrl:ModalController) {

    this.beerId = navParams.get('beerId');
    this.getLikeBeer(this.beerId);

    this.storage.ready().then(()=>{
      this.storage.get('uid').then(uid=>{
        this.uid = uid;
        this.favBeerRef = firebase.database();        
      });
    });

    //console.log("beerid",this.beerId);

  }

  ionViewDidLoad() {

    // console.log('ionViewDidLoad BeerDetailPage');

    this.beerAPI.loadBeerById(this.beerId).subscribe(beer => {
      this.beer = beer;
      this.loadBeer(this.beer);
      //console.log(this.beer);
      this.getBeerReviews();
      
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
     // Get beer reviews by beer id
     this.db.getBeerReviewsById(this.beerId).subscribe(success=>{

      this.beerReviews = success.data;
      // console.log(this.beerReviews);

      // Get overall Beer Ratings:  TODO: Create a backend make the calculation TABLE: beer_rating
      for (let i = 0; i < this.beerReviews.length; i++) {

        // if the beer rating is zero, they never bothered to rate.  Ignore.
        if (parseInt(this.beerReviews[i].beer_rating)) {
          beerRatingTotal += parseInt(this.beerReviews[i].beer_rating);
          this.beerReviewCount++;  
        }
      }

      this.overallBeerRating = beerRatingTotal  / this.beerReviewCount;


      });
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

  setLikeBeer(beerId) {

    this.db.setLikeBeer(beerId).subscribe((value) => {
      //console.log(value);
    }, (error) => {
      console.log(error);
    },() => {
      //console.log('success');
      this.presentToast("You liked this beer.");
      this.getLikeBeer(beerId);
    });

  }

  getLikeBeer(beerId) {
    this.db.getLikeBeer(beerId).subscribe((value) => {
      //console.log('beer likes',value.data); 
      this.beerLikes = value.data;
    }, (error) => {
      console.log(error);
    },() => {
      //console.log('success');

    });

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
