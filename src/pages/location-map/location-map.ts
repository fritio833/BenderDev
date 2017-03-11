import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, ViewController, NavParams } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service';

declare var google;
declare var GoogleMap;

@Component({
  selector: 'page-location-map',
  templateUrl: 'location-map.html'
})
export class LocationMapPage {

  @ViewChild('map') mapElement;
  public map:any;
  public mapInitialised: boolean = false;
  public locationLat:any;
  public locationLng:any;
  public locationName:any;
  public loading:any;
  public apiKey: any = 'AIzaSyAKs0BGHgtV5I--IvIwsGkD3c_EFV0yXtY';

  constructor(public navCtrl: NavController,
              public view: ViewController,
              public conn:ConnectivityService,
              public loadingCtrl:LoadingController,
  	          public params: NavParams) {

  	this.locationLat = params.get('lat');
  	this.locationLng = params.get('lng');
  	this.locationName = params.get('locName');

  }

  cancel() {
    this.view.dismiss();
  }

  initMap() {

    this.mapInitialised = true;

    let latLng = new google.maps.LatLng(parseFloat(this.locationLat),parseFloat(this.locationLng));
    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latLng,
      zoom: 15        
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      position: latLng,
      title: this.locationName,
      map: this.map
    });

    marker.setMap(this.map);
  }

  loadGoogleMaps() {
    
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
      content: 'Loading. Please wait...',
      duration:2000
    });
    this.loading.present();
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationMapPage');
    this.initMap();
  }

}
