import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { GoogleService } from '../../providers/google-service';
import { LocationDetailPage } from '../location-detail/location-detail';
import { SingletonService } from '../../providers/singleton-service';
import { ConnectivityService } from '../../providers/connectivity-service';
import { SearchLocationKeyPage } from '../search-location-key/search-location-key';
import { SearchLocationFilterPage } from '../search-location-filter/search-location-filter';

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
  public markers:any;
  public filter:any;
  public geoLat:any;
  public geoLng:any;
  public infScroll:any;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public toastCtrl:ToastController,
  	          public sing:SingletonService,
  	          public loadingCtrl:LoadingController,
              public alertCtrl:AlertController,
  	          public popCtrl:PopoverController,
  	          public conn:ConnectivityService,
              public modalCtrl:ModalController,
  	          public geo:GoogleService) {

  }

  doSearchLocation(evt) {
  	console.log(evt);
  }

  fixLocations(locations) {

   let ptypes = '';
  
   for (var i = 0; i < locations.length; i++ ) {

      ptypes ='';
     
      if (this.sing.getLocation().geo) {

        let lat = parseFloat(locations[i].geometry.location.lat);
        let lng = parseFloat(locations[i].geometry.location.lng);
        let locPoint = {lat:lat,lng:lng};
        let userPoint = {lat:this.geoLat,lng:this.geoLng};
        let dist = this.geo.getDistance(locPoint,userPoint,true);
        locations[i]['distance'] = Math.round(dist * 10) / 10;
      }
      
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
  	else {
      this.clearMarkers();
  	  this.setLocationMarkers();
      this.setBounds();
    }
  }

  showLocalList() {
  	this.showMap = false;
  }

  getLocal() {

    Geolocation.getCurrentPosition().then((resp) => {

      this.geoLat = resp.coords.latitude;
      this.geoLng = resp.coords.longitude;

      this.geo.placesNearByRadius(this.geoLat,this.geoLng)
        .subscribe((success)=>{
           
           this.locations = this.fixLocations(success.results);
           this.nextNearByToken = success.next_page_token;
        });
       
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getMoreLocal(infiniteScroll) {

    this.infScroll = infiniteScroll; 

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
    let modal = this.modalCtrl.create(SearchLocationFilterPage,{filter:this.filter});
    modal.onDidDismiss(filter => {
      //console.log('filter',filter);

      if (filter!=null) {

        this.filter = filter;
        this.geo.placesNearByRadius(this.geoLat,
                                    this.geoLng,
                                    this.filter.distance,
                                    this.filter).subscribe((resp)=>{

          // console.log('resp',resp);
           this.locations = [];
           this.locations = this.fixLocations(resp.results);
           this.nextNearByToken = resp.next_page_token;
           //this.infScroll.enable(true);
           console.log('nextToken',this.nextNearByToken);
           if (this.showMap && this.markers.length) {
              this.clearMarkers();
              this.setLocationMarkers();
           }

        });
      }

    });
    modal.present(); 
  }

  setBounds() {
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i].getPosition());
        }
        this.map.fitBounds(bounds);

    }, 500);
  }

  initMap() {

    this.mapInitialised = true;

    let options = {timeout: 10000, enableHighAccuracy: false, maximumAge:3000};
    Geolocation.getCurrentPosition(options).then((resp) => {         

        let myLat = resp.coords.latitude;
        let myLng = resp.coords.longitude;
        this.setLocationMap(myLat,myLng)

	    this.loading.dismiss();     
        

    }).catch((error) => {
      console.log('Error getting location');      
    });
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      if (this.markers[i].title != "My Current Location")
        this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  setLocationMarkers() {

    this.markers = [];//some array
    let records;
    let infowindow = new google.maps.InfoWindow();

    for (let i = 0; i < this.locations.length; i++) {

    	let lat = parseFloat(this.locations[i].geometry.location.lat);
    	let lng = parseFloat(this.locations[i].geometry.location.lng);
    	let locName = this.locations[i].name;
      let locLabel = String(i+1);
    	let latLng = new google.maps.LatLng(lat,lng);
     

      var marker = new google.maps.Marker({
          position: latLng,
          title: locName,
          label: locLabel,
          map: this.map
      });
      //marker.setMap(this.map);
      this.markers.push(marker);

      let temp = this;
	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
            temp.showInfoWindow(temp.locations[i]);
	        }
	    })(marker, i));	    
    }
    return this.markers;  	
  }

  setLocationMap(myLat,myLng) {

    this.markers = [];//some array
    let records; 
	  var im = 'images/icons/bluecircle.png'; 

    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    this.markers = this.setLocationMarkers();

    let myLatLng = new google.maps.LatLng(myLat,myLng);

    var userMarker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'My Current Location',
        animation: google.maps.Animation.DROP,
        icon: im
    });
    this.markers.push(userMarker);    

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].getPosition());
    }
    this.map.fitBounds(bounds);
      
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

  showMarkerKey() {
  	let popover = this.popCtrl.create(SearchLocationKeyPage,{locations:this.locations});
  	popover.present();

    popover.onDidDismiss(success=>{
      //console.log(success);
      if (success!=null) {
        let lat = parseFloat(success.geometry.location.lat);
        let lng = parseFloat(success.geometry.location.lng);

        var laLatLng = new google.maps.LatLng(lat,lng);
        this.map.panTo(laLatLng);
        this.map.setZoom(18);
      }
    });
  }

  showInfoWindow(location) {
    let alert = this.alertCtrl.create({
      title: location.name,
      message: location.place_types,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'View Detail',
          handler: () => {
            this.getLocationDetail(location);
          }
        }
      ]
    });
    alert.present();    
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
