import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ActionSheetController, Slides, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation, SocialSharing, Camera } from 'ionic-native';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Storage } from '@ionic/storage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';

import { GoogleService } from '../../providers/google-service';
import { BreweryService } from '../../providers/brewery-service';
import { DbService } from '../../providers/db-service';
import { SingletonService } from '../../providers/singleton-service';

declare var cordova: any;

@Component({
  selector: 'page-checkin',
  templateUrl: 'checkin.html'
})
export class CheckinPage {

  @ViewChild(Slides) slides: Slides;
  public beer:any;
  public locations:any;
  public location;
  public locationsLen:number;
  public price:number;
  public socialMessage:string = "";
  public lat:number;
  public lng:number;
  public locChoice:number;
  public glassware:number;
  public servingStyleName:any;
  public loading:any;
  public checkinType:string;
  public promises:any;
  public base64Image:string;
  public imageToUpload:string;
  public beerRating:number = 0;
  public slideIndex:number = 0;
  public showLocationSlide:boolean = false;
  public showPurchaseSlide:boolean = false;
  public maxMsgLen:number = 150;
  public lastImage: string = null; 
  public checkin: FirebaseListObservable<any>;
  public checkinPictureRef: firebase.storage.Reference;
  public firebase:any;

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
  	          public view: ViewController,
  	          public geo:GoogleService,
              public toastCtrl:ToastController,
              public alertCtrl:AlertController,
              public db:DbService,
              public storage:Storage,
              public platform:Platform,
              public sing:SingletonService,
              public beerAPI:BreweryService,
              public actionCtrl:ActionSheetController,
              public angFire:AngularFire,
              public loadingCtrl:LoadingController) {

    this.beer = params.get("beer");
    this.checkinType = params.get("checkinType");  //beer,brewery,place
    this.price = 0;
    this.checkin = angFire.database.list('/checkin');
    this.firebase = angFire.database;
    this.checkinPictureRef = firebase.storage().ref('/checkins/');
    //console.log('wut',this.beer);
    this.fixBeer();
  }

  fixBeer() {

      if (!this.beer.hasOwnProperty('breweries')) {
        this.beer['breweries'] = new Array({name:''}); // fix beers without breweries
      }

      // fix beers with no images
      if (!this.beer.hasOwnProperty('labels')) {
        this.beer['labels'] = {medium:''};
      }
  }   

  moreDetail() {
    console.log('details page');
  }

  cancel() {
    this.view.dismiss();
  }

  priceSiderFormat(price) {
    return price.toFixed(2);
  }


  takePicture(sourceType) {

    var options = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      //allowEdit: true,
      encodingType: Camera.EncodingType.PNG,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    Camera.getPicture(options).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/png;base64," + imageData;
        this.imageToUpload = imageData;
    }, (err) => {
        console.log(err);
    });
  }

  deletePicture() {
    this.base64Image = null;
  }  

  pictureActions() {
    let actionSheet = this.actionCtrl.create({
      title: 'Choose what you want to do with photo.',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },{
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);   
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();    
  }



  fixLocations(lat,lng) {

   let ptypes = '';
   let locPoint:any;
   let userPoint:any;
  
   for (var i = 0; i < this.locations.length; i++ ) {

      ptypes ='';
     
      for (var j = 0; j < this.locations[i].types.length; j++) {
          
          if (this.locations[i].types[j] == 'bar'
              || this.locations[i].types[j] == 'night_club'
              || this.locations[i].types[j] == 'convenience_store'
              || this.locations[i].types[j] == 'gas_station'
              || this.locations[i].types[j] == 'liquor_store'
              || this.locations[i].types[j] == 'food'
              || this.locations[i].types[j] == 'restaurant'
              || this.locations[i].types[j] == 'grocery_or_supermarket') {
            ptypes += this.locations[i].types[j] + ', ';
            break;
          }
      }

      let locPoint = {lat:this.locations[i].geometry.location.lat,lng:this.locations[i].geometry.location.lng};
      let userPoint = {lat:lat,lng:lng};
      this.locations[i]['dist'] = this.geo.getDistance(locPoint,userPoint);
      this.locations[i].place_types = ptypes.replace(/,\s*$/, "").replace(/_/g, " ").replace(/\b[a-z]/g,function(f){return f.toUpperCase();});
    }
    this.locations.sort(this.compare);
    //console.log(locations);

  }

  compare(a,b) {
    //console.log(a);
    //console.log(b);
    if (a.dist < b.dist)
      return -1;
    if (a.dist > b.dist)
      return 1;
    return 0;
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    //console.log("Current index is", currentIndex);
    this.slideIndex = currentIndex;
  }  

  ionViewDidLoad() {

    console.log('ionViewDidLoad CheckinPage');

    Geolocation.getCurrentPosition().then((resp) => {

      this.beerAPI.loadBeerGlassware().subscribe(glass=>{
        this.glassware = glass.data;
        //console.log(this.glassware);
      });

      if ( this.sing.test ) {

        this.lat = this.sing.lat;
        this.lng = this.sing.lng;

      } else {

        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;

      }

    	this.geo.placesNearByMe(this.lat,this.lng)
    	  .subscribe((success)=>{
          this.locations = {};
          this.locations = success.results;
    	  	this.locationsLen = this.locations.length;

          if(this.locationsLen) {

            this.fixLocations(this.lat,this.lng);
            //console.log('resp',this.locations);

            this.promises = new Array()
            for(var i = 0; i < this.locations.length; i++) {
              if (this.locations[i].hasOwnProperty('photos')) {
                this.promises.push(this.getLocationPhotos(this.locations[i].photos[0].photo_reference,i));
              } else {
                this.locations[i]['url'] = null;
              }
            }

            Promise.all(this.promises).then( values => {
              //console.log('val',values);
              this.showLocationSlide = true;       
                
            }).catch((error)=>{
              console.log('error with google',error);
            });
          }

    	  });
    }).catch((error) => {
       console.log('error with geolocation',error);
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

  getLocationPhotos(picId,index) {
    return new Promise(resolve=>{

      this.geo.placePhotos(picId).subscribe(res=>{
        //console.log('photos',res);
        this.locations[index]['url'] = res.url;
        resolve(true);
      });
    });
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

  doCheckin() {

    let locationData:any = {};
    let beerData:any = {};

    //this.showLoading();

    if (this.locationsLen) {
      this.location = this.locations[this.slideIndex];
      console.log(this.location);
    } else
      this.location = null;

    console.log('checkin',this.location);

    if (this.location!=null) {

      this.geo.reverseGeocodeLookup(this.location.geometry.location.lat,this.location.geometry.location.lng)
      .subscribe((success)=> {

        let timestamp = firebase.database.ServerValue.TIMESTAMP;
        locationData = {
          placeId:this.location.place_id,
          name:this.location.name,
          photo:this.location.url,
          placeType:this.location.place_types,
          lat:this.location.geometry.location.lat,
          lng:this.location.geometry.location.lng,
          address:success.address,
          city:success.city,
          state:success.state,
          zip:success.zip,
          country:success.country,
          comments:this.socialMessage,
          img:'',
          dateCreated: timestamp
        }

        if (this.beer != null) {
          locationData['beerId'] = this.beer.id;
          locationData['beerName'] = this.beer.name;
          locationData['beerDisplayName'] = this.beer.nameDisplay;
          locationData['beerStyleName'] = this.beer.style.name;
          locationData['beerStyleShortName'] = this.beer.style.shortName;

          if (this.beer.hasOwnProperty('labels')) {
            locationData['beerLabels'] = this.beer.labels;

            if (this.beer.labels.hasOwnProperty('medium'))
              locationData['beerIMG'] = this.beer.labels.medium;
            else
              locationData['beerIMG'] = '';

          } else {
            locationData['beerLabels'] = '';
            locationData['beerIMG'] = '';
          }

          if (this.beer.hasOwnProperty('abv'))
            locationData['beerABV'] = this.beer.abv;
          else
            locationData['beerABV'] = '';

          if (this.beer.hasOwnProperty('ibu'))
            locationData['beerIBU'] = this.beer.ibu;
          else
            locationData['beerIBU'] = '';        

          if (this.beerRating!=0 && this.beerRating!=null)
            locationData['beerRating'] = this.beerRating;
          else
            locationData['beerRating'] = '';

          if (this.beer.hasOwnProperty('breweries')) {
            locationData['breweryId'] = this.beer.breweries[0].id;
            locationData['breweryName'] = this.beer.breweries[0].name;
            locationData['breweryShortName'] = this.beer.breweries[0].nameShortDisplay;

            if (this.beer.breweries[0].hasOwnProperty('images'))
              locationData['breweryImages'] = this.beer.breweries[0].images;              
            else
              locationData['breweryImages'] = '';
          }
          
          if (this.servingStyleName != null)
            locationData['servingStyleName'] = this.servingStyleName;
          else
            locationData['servingStyleName'] = '';

        }
       
        if (this.base64Image != null) {          
          let timestampStr = String(new Date().getTime());          
          let subDir = timestampStr.substring(timestampStr.length-2,timestampStr.length);

          this.checkinPictureRef.child(locationData.placeId)
              .child(subDir)
              .child(timestampStr+'.png')
              .putString(this.imageToUpload,'base64',{contentType:'image/png'})
              .then(resp=>{
            //console.log('resp',resp);
            locationData['img'] = resp.downloadURL;
            this.checkin.push(locationData);
          });
        } else {
          this.checkin.push(locationData);
        }

        console.log('loc',success);
        this.view.dismiss();
        this.presentToast("Check-in was successful");

      });
    }


    if (this.beer != null) {

    }
       /*
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
      */       
  }

  firstToUpperCase( str ) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
  }

  maxText(msg) {
    //return 150 - msg.length;
    let message = String(msg);
    return this.maxMsgLen - message.length;
  }

  selectLocation(index) {
    this.locChoice = index;
    //console.log(this.locChoice);
  }

}
