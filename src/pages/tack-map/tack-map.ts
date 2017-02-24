import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';
import { ConnectivityService } from '../../providers/connectivity-service';
import { DbService } from '../../providers/db-service';
import { SingletonService } from '../../providers/singleton-service';

declare var google;
declare var GoogleMap;
/*
  Generated class for the TackMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tack-map',
  templateUrl: 'tack-map.html'
})
export class TackMapPage {

  @ViewChild('map') mapElement;
  public map:any;
  public mapInitialised: boolean = false;
  public apiKey: any = 'AIzaSyAKs0BGHgtV5I--IvIwsGkD3c_EFV0yXtY';
  public loading:any;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public conn:ConnectivityService,
  	          public loadingCtrl:LoadingController,
  	          public db:DbService,
  	          public sing:SingletonService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TackMapPage');

    this.loadGoogleMaps();
  }

  initMap() {

  	//console.log('init map');
  	//console.log('isOnline',this.conn.isOnline());


    this.mapInitialised = true;
    let markers = [];//some array
    let records;
   

    this.db.getTacks(this.sing.token).subscribe((mapMarkers)=>{
       
      records = mapMarkers.data;

      for (let i = 0; i < records.length; i++) {

        let latLng = new google.maps.LatLng(parseFloat(records[i].lat),parseFloat(records[i].lng));

        var infowindow = new google.maps.InfoWindow();

        var marker = new google.maps.Marker({
          position: latLng,
          title: records[i].name,
          map: this.map
        });
        //marker.setMap(this.map);
        markers.push(marker);

	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
	          infowindow.setContent(records[i].name);
	          infowindow.open(this.map, marker);
	        }
	    })(marker, i));        

      } // end for loop
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
      }
      this.map.fitBounds(bounds);
 
  	});

    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
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

}
