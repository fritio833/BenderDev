import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { GoogleService } from '../../providers/google-service';
import { LocationDetailPage } from '../location-detail/location-detail';
import { SingletonService } from '../../providers/singleton-service';
import { ConnectivityService } from '../../providers/connectivity-service';

declare var google;
declare var GoogleMap;

@Component({
  selector: 'page-search-location',
  templateUrl: 'search-location.html'
})
export class SearchLocationPage {

  @ViewChild('map') mapElement;
  public locations:any;
  public nextNearByToken:any;
  public predictions:any;
  public predictionsLen:number = 0;
  public showMap:boolean = false;
  public map:any;
  public mapInitialised: boolean = false;
  public apiKey: any = 'AIzaSyAKs0BGHgtV5I--IvIwsGkD3c_EFV0yXtY';
  public loading:any; 

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public toastCtrl:ToastController,
  	          public sing:SingletonService,
  	          public loadingCtrl:LoadingController,
  	          public conn:ConnectivityService,
  	          public geo:GoogleService) {

  }

  doSearchLocation(evt) {
  	console.log(evt);
  }

  fixLocations(locations) {

   let ptypes = '';
  
   for (var i = 0; i < locations.length; i++ ) {

      ptypes ='';
      
      if (!locations[i].hasOwnProperty('opening_hours')) {
         locations[i]['opening_hours'] = {open_now:2};
      } else if (locations[i].opening_hours.open_now) {
        locations[i].opening_hours.open_now = 1;
      } else {
         locations[i].opening_hours.open_now = 0;
      }
    
      for (var j = 0; j < locations[i].types.length; j++) {
          
          if (locations[i].types[j] == 'bar'
              || locations[i].types[j] == 'night_club'
              || locations[i].types[j] == 'convenience_store'
              || locations[i].types[j] == 'gas_station'
              || locations[i].types[j] == 'liquor_store'
              || locations[i].types[j] == 'grocery_or_supermarket') {
            ptypes += locations[i].types[j] + ', ';
          }
      }
      locations[i].place_types = ptypes.replace(/,\s*$/, "").replace(/_/g, " ");
    }
    return locations;
  }

  autoLocationSearch(event) {
    console.log(event);
    
	if (event.type == "input") {
	    this.geo.placesAutocomplete(event.target.value).subscribe((success)=>{
	      this.predictions = success.predictions;
	      this.predictionsLen = success.predictions.length;
	      //console.log(this.predictions);

      });
	}
  }

  autoSearchCancel(event){
  	this.predictionsLen = 0;
  	this.predictions = new Array();
  }

  showLocalMap() {
  	this.showMap = true;

  	if (!this.mapInitialised)
  	  this.loadGoogleMaps();
  	else
  	  this.setLocationMarkers();
  }

  showLocalList() {
  	this.showMap = false;
  }

  getLocal() {

    Geolocation.getCurrentPosition().then((resp) => {

      this.geo.placesNearByRadius(resp.coords.latitude,resp.coords.longitude,50000)
        .subscribe((success)=>{
           
           this.locations = this.fixLocations(success.results);
           this.nextNearByToken = success.next_page_token;
        });
       
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getMoreLocal(infiniteScroll) {

    setTimeout(() => {
      this.geo.placesNearByNextToken(this.nextNearByToken).subscribe((success)=>{

        let locationsNext:any;

        locationsNext = this.fixLocations(success.results);

        if (success.hasOwnProperty('next_page_token'))
          this.nextNearByToken = success.next_page_token;

        for (let i = 0; i < locationsNext.length; i++) {
          this.locations.push(locationsNext[i]);
        }

        infiniteScroll.complete();
        //console.log(locationsNext);

        if (!success.hasOwnProperty('next_page_token')) {
          infiniteScroll.enable(false);
        }

      });
    }, 1000);
  }  

  getLocationDetail(location) {

    this.geo.placeDetail(location.place_id).subscribe((resp)=>{

      //console.log(resp.result.types);

      for (var i=0;i<resp.result.types.length;i++) {

          if (resp.result.types[i].match('night_club|food|bar|grocery_or_supermarket|liquor_store|gas_station|convenience_store')) {
            this.navCtrl.push(LocationDetailPage,{location:resp.result});
            return;
          }
      }
      console.log(resp.result.types);
      this.presentToast('Not a place that would sell alcoholic beverages');

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

  showLocationFilter() {

  }

  initMap() {

    this.mapInitialised = true;
    let markers = [];//some array
    let records;
   
    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var im = 'images/icons/bluecircle.png';

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);

    markers = this.setLocationMarkers();


    let options = {timeout: 10000, enableHighAccuracy: false, maximumAge:3000};
    Geolocation.getCurrentPosition(options).then((resp) => {         

        let myLat = resp.coords.latitude;
        let myLng = resp.coords.longitude;
        let myLatLng = new google.maps.LatLng(myLat,myLng);

        var userMarker = new google.maps.Marker({
            position: myLatLng,
            map: this.map,
            title: 'My Current Location',
            animation: google.maps.Animation.DROP,
            icon: im
        });
        markers.push(userMarker);

	    var bounds = new google.maps.LatLngBounds();
	    for (var i = 0; i < markers.length; i++) {
	      bounds.extend(markers[i].getPosition());
	    }
	    this.map.fitBounds(bounds);
	    this.loading.dismiss();     
        

    }).catch((error) => {
      console.log('Error getting location');      
    });
  }

  setLocationMarkers() {

  	let markers = [];//some array
	var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var labelIndex = 0;

    for (let i = 0; i < this.locations.length; i++) {

    	let lat = parseFloat(this.locations[i].geometry.location.lat);
    	let lng = parseFloat(this.locations[i].geometry.location.lng);
    	let locName = this.locations[i].name;
    	let placeType = this.locations[i].place_types;

    	let latLng = new google.maps.LatLng(lat,lng);
        let infowindow = new google.maps.InfoWindow();

        if ( labelIndex >= 26)
        	labelIndex = 0;

        var marker = new google.maps.Marker({
          position: latLng,
          title: locName,
          label: String(i+1),
          map: this.map
        });
        //marker.setMap(this.map);
        markers.push(marker);

	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
	          infowindow.setContent(`<h5>${locName}</h5><p>${placeType}</p>`);
	          infowindow.open(this.map, marker);
	        }
	    })(marker, i));
    }

    return markers;

      
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
    console.log('ionViewDidLoad SearchLocationPage');

    this.getLocal();
  }

}
