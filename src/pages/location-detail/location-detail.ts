import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { GoogleService } from '../../providers/google-service';
import { Geolocation } from 'ionic-native';
import { ConnectivityService } from '../../providers/connectivity-service';
import { Ionic2RatingModule } from 'ionic2-rating';

declare var google;
declare var GoogleMap;

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
  public mapInitialised: boolean = false;
  public loading:any;
  public apiKey: any = 'AIzaSyAKs0BGHgtV5I--IvIwsGkD3c_EFV0yXtY';

  constructor(public navCtrl: NavController, 
  	          public params: NavParams,
              public conn:ConnectivityService,
              public loadingCtrl:LoadingController,
  	          public loc:LocationService,
  	          public geo:GoogleService) {

    this.placeId = params.get("placeId");

  }

  initMap() {

    this.mapInitialised = true;
    let markers = [];//some array
    let records;
    /*
      records = mapMarkers.data;

      let latLng = new google.maps.LatLng(parseFloat(records[i].lat),parseFloat(records[i].lng));

      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        position: latLng,
        title: records[i].name,
        map: this.map
      });
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(`<h5>${records[i].name}</h5>`);
            infowindow.open(this.map, marker);
          }
      })(marker, i));        

      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
      }
      this.map.fitBounds(bounds);
 

    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    */
  }

  loadGoogleMaps() {
    this.showLoading();
    this.addConnectivityListeners();
 
    if (typeof google == "undefined" || typeof google.maps == "undefined" ) {
 
      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();
   
      if(this.conn.isOnline()){
        console.log("online, loading map");
   
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }
   
        let script = document.createElement("script");
        script.id = "googleMaps";
   
        if(this.apiKey){
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';       
        }
   
        document.body.appendChild(script);  
   
      } 
    } else {
 
      if(this.conn.isOnline()){
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }
    }
  }  

  addConnectivityListeners(){
 
    let onOnline = () => {
 
      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
 
          this.loadGoogleMaps();
 
        } else {
 
          if(!this.mapInitialised){
            this.initMap();
          }
 
          this.enableMap();
        }
      }, 2000);
 
    };
 
    let onOffline = () => {
      this.disableMap();
    };
 
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
 
  }

  disableMap(){
    console.log("disable map");
  }
 
  enableMap(){
    console.log("enable map");
  }  

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading map. Please wait...',
      duration:2000
    });
    this.loading.present();
  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad LocationDetailPage');

    this.geo.placeDetail(this.placeId).subscribe((resp)=>{

      this.location = resp.result;
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

      console.log('resp',this.location);

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

    });    
  }

}
