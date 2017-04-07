import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, PopoverController, AlertController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton-service';
import { GoogleService } from '../../providers/google-service';
import { ConnectivityService } from '../../providers/connectivity-service';

import { BreweryDetailPage } from '../brewery-detail/brewery-detail';
import { SelectLocationPage } from '../select-location/select-location';
import { SearchLocationKeyPage } from '../search-location-key/search-location-key';

declare var google;
declare var GoogleMap;

@Component({
  selector: 'page-search-breweries',
  templateUrl: 'search-breweries.html'
})
export class SearchBreweriesPage {

  @ViewChild('map') mapElement;
  public breweries = new Array();
  public brewerySearch:any;
  public brewerySearchLen:number=0;
  public numPages:number;
  public showMap:boolean = false;
  public map:any;
  public loading:any;
  public mapInitialised: boolean = false;
  public apiKey: any = 'AIzaSyAKs0BGHgtV5I--IvIwsGkD3c_EFV0yXtY';  
  public city:string;
  public markers:any;
  public qBreweryAuto:string = "";

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public sing: SingletonService,
  	          public geo: GoogleService,
  	          public loadingCtrl:LoadingController,
  	          public modalCtrl: ModalController,
  	          public alertCtrl:AlertController,
  	          public popCtrl:PopoverController,
  	          public conn:ConnectivityService, 
  	          public beerAPI:BreweryService) {}

  getMoreBreweries(evt) {
  	console.log('evt',evt);
  }

  changeCity() {

    let modal = this.modalCtrl.create(SelectLocationPage);
    modal.onDidDismiss(citySet => {
      // console.log('filter',filter);
      if (citySet) {
      	this.getBreweries();
      	//this.mapInitialised = false;
      }
    });
    modal.present();

  }

  getDetail(brewery) {
    console.log(brewery);
    let breweryId;
    let foundBrewpub:number = -1;
    this.showLoading('Loading Brewery...');
        
    if (!brewery.hasOwnProperty('breweryId') && brewery.hasOwnProperty('id')) {

      this.beerAPI.loadBreweryLocations(brewery.id).subscribe((success)=>{

        for (let i = 0; i < success.data.length; i++) {
          if (success.data[i].locationType == 'brewpub' || success.data[i].openToPublic == 'Y') {
            foundBrewpub = i;
            break;
          }
        }

        if (foundBrewpub == -1) {
          foundBrewpub = 0;
        }

        this.beerAPI.loadLocationById(success.data[foundBrewpub].id).subscribe((pub)=>{
          //console.log('pub',pub);
          
          this.beerAPI.loadBreweryBeers(pub.data.breweryId).subscribe((beers)=>{
              //console.log('beers',beers);
              this.navCtrl.push(BreweryDetailPage,{brewery:pub.data,beers:beers});
          });
          
        });
      });
      
    } else {

      // Use Google Places to associated with BreweryDB
      let breweryName = encodeURIComponent(brewery.brewery.name);
      console.log('breweryName',breweryName);
      this.geo.getPlaceByOrigin(breweryName,brewery.latitude,brewery.longitude).subscribe(pub=>{
        //console.log('pub',pub);
        if (pub.results.length) {
          //Get place detail
          this.geo.placeDetail(pub.results[0].place_id).subscribe(detail=>{
            //console.log('detail',detail);

            this.beerAPI.loadBreweryBeers(brewery.breweryId).subscribe((beers)=>{
                //console.log('beers',beers);
                this.loading.dismiss();
                this.navCtrl.push(BreweryDetailPage,{brewery:brewery,beers:beers,place:detail.result});
            });
          });
        } else {
            this.beerAPI.loadBreweryBeers(brewery.breweryId).subscribe((beers)=>{
                //console.log('beers',beers);
                this.loading.dismiss();
                this.navCtrl.push(BreweryDetailPage,{brewery:brewery,beers:beers,place:null});
            });          
        }
      });
    }
  }

  fixBreweries(breweries) {

    for (var i=0;i<breweries.length;i++) {

      // fix beers with no images
      if (!breweries[i]['brewery'].hasOwnProperty('images')) {
        breweries[i]['brewery']['images'] = {icon:null,
                                             medium:'images/no-image.jpg',
                                             squareMedium:'images/no-image.jpg', 
                                             large:'images/no-image.jpg'};
      }
      breweries[i].name = breweries[i].brewery.name; 
    }
    return breweries;
  } 

  autoBrewerySearch(event) {

    this.qBreweryAuto = event.target.value;

  	if (event.type == "input" && event.target.value.length) {
  	    this.beerAPI.findBreweriesByName(event.target.value).subscribe((success)=>{
  	      // console.log(success);
  	      if (success.hasOwnProperty('data')) {
	  	      this.brewerySearch = success.data;
	  	      console.log(this.brewerySearch);
	  	      this.brewerySearchLen = success.data.length;  	      	
  	      } else {
	  	      this.brewerySearch = new Array();
	  	      this.brewerySearchLen = 0;  	      	
  	      }

        });
  	} else {
  	    this.brewerySearch = new Array();
  	    this.brewerySearchLen = 0;
  	}
  }

  getBreweries() {

    this.showLoading('Loading Breweries...');
    // Get breweries at user's current location
    if (this.sing.getLocation().geo){

	    let options = {timeout: 5000, enableHighAccuracy: true, maximumAge:3000};
	    Geolocation.getCurrentPosition(options).then((resp) => {

        this.sing.geoLat = resp.coords.latitude;
        this.sing.geoLng = resp.coords.longitude;

	      this.geo.reverseGeocodeLookup(resp.coords.latitude,resp.coords.longitude)
			    .subscribe((success)=>{
			    this.sing.geoCity = success.city;
			    this.sing.geoState = success.state;
			    console.log('Geolocation with high accuracy.');
		    });            

	      this.beerAPI.findBreweriesByGeo(resp.coords.latitude,resp.coords.longitude)
	      .subscribe((breweries)=>{
	        //console.log(breweries);          
          if (breweries.hasOwnProperty('data')) {
            this.breweries = this.fixBreweries(breweries.data);
            this.numPages = breweries.numberOfPages;            
          } else {
            this.breweries = new Array();
            this.numPages = 0;
            this.showNoBreweries();
          }
          this.loading.dismiss();        
	      });

	    }).catch((error) => {
	        console.log('Error getting location using high accuracy', error);
	    });
    } else { // breweries from user's selected city
	      this.beerAPI.findBreweriesByGeo(this.sing.getLocation().lat,this.sing.getLocation().lng)
	      .subscribe((breweries)=>{
	        //console.log('cityBrew',breweries);
          if (breweries.hasOwnProperty('data')) {
            this.breweries = this.fixBreweries(breweries.data);
            this.numPages = breweries.numberOfPages;            
          } else {
            this.breweries = new Array();
            this.numPages = 0;
            this.showNoBreweries();
          }
          this.loading.dismiss();         
	      });    	
    }
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }  

  showBreweryMap() {
  	this.showMap = true;

  	if (!this.mapInitialised)
  	  this.loadGoogleMaps();
  	else {
  	  this.setLocationMarkers();
  	  this.setMapBounds();
  	}
  }

  showBreweryList() {
  	this.showMap = false;
  }  

  initMap() {

    this.mapInitialised = true;
    this.setLocationMap();
	  this.loading.dismiss();       
       
  }

  showMarkerKey() { 
  	let popover = this.popCtrl.create(SearchLocationKeyPage,{locations:this.breweries});
  	popover.present();

    popover.onDidDismiss(success=>{
      //console.log(success);
      if (success!=null) {
        let lat = parseFloat(success.latitude);
        let lng = parseFloat(success.longitude);

        var laLatLng = new google.maps.LatLng(lat,lng);
        this.map.panTo(laLatLng);
        this.map.setZoom(18);
      }
    });
  }

  setMapBounds() {
  	setTimeout(() => {
  		google.maps.event.trigger(this.map, 'resize');
  	    var bounds = new google.maps.LatLngBounds();
  	    for (var i = 0; i < this.markers.length; i++) {
  	      bounds.extend(this.markers[i].getPosition());
  	    }
  	    this.map.fitBounds(bounds);

  	}, 500);
  }

  setLocationMap() {

    this.markers = [];//some array
    let records; 

    let mapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
    this.markers = this.setLocationMarkers();

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].getPosition());
    }


	  setTimeout(() => {
		  google.maps.event.trigger(this.map, 'resize');
	      this.map.fitBounds(bounds);
	  }, 500);    
   
  }

  setLocationMarkers() {
  	this.clearMarkers();
    let myLatLng:any;
    let im = 'images/icons/bluecircle.png';     
    //this.markers = [];//some array
    let records;
    let infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < this.breweries.length; i++) {

	  let lat = parseFloat(this.breweries[i].latitude);
	  let lng = parseFloat(this.breweries[i].longitude);
      myLatLng = new google.maps.LatLng(lat,lng);
      let locLabel = String(i+1);

      var marker = new google.maps.Marker({
          position: myLatLng,
          title: this.breweries[i].brewery.name,
          label: locLabel,
          map: this.map
      });
      //marker.setMap(this.map);
      this.markers.push(marker);

      let temp = this;
	    google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
            temp.showInfoWindow(temp.breweries[i]);
	        }
	    })(marker, i));      

    }

    if (this.sing.getLocation().geo) {

      myLatLng = new google.maps.LatLng(this.sing.geoLat,this.sing.geoLng);

      var userMarker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          title: 'My Current Location',
          animation: google.maps.Animation.DROP,
          icon: im
      });
      this.markers.push(userMarker);      
    }    
    return this.markers;  	
  }  

  loadGoogleMaps() {
    this.showLoading('Loading map. Please wait...');
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

  showLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  showNoBreweries() {
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      message: 'No breweries located in '+this.sing.getSelectCity()+'.  If the brewery does exist, please tell us about it.',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit Brewery',
          handler: () => {
            //this.getDetail(brewery);
          }
        }
      ]
    });
    alert.present();    
  }   

  showInfoWindow(brewery) {

    let alert = this.alertCtrl.create({
      title: brewery.brewery.name,
      message: '<div align="center"><img src="' + brewery.brewery.images.icon + '"/></div>',
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
            this.getDetail(brewery);
          }
        }
      ]
    });
    alert.present();    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBreweriesPage');
    this.getBreweries();
    
  }

}
