import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SingletonService } from './singleton-service';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

/*
  Generated class for the DbService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbService {

  public databaseServiceUrl:string;

  constructor(public http: Http,
              public sing:SingletonService, 
              public platform:Platform) {

     console.log('Hello DbService Provider');
     this.databaseServiceUrl = this.sing.databaseServiceUrl;

    if (this.platform.is('cordova')) {
      this.databaseServiceUrl = 'http://benderapp.servebeer.com/bender/';          
    } else {
      this.databaseServiceUrl = 'bender/';
    }         
  }

  public setLikeBeer(beerId) {

    return this.http.get(this.databaseServiceUrl + 'likes/?action=set' + '&beerid=' + beerId)
        .map(res => res.json());
  }

  public getLikeBeer(beerId) {

    return this.http.get(this.databaseServiceUrl + 'likes/?action=get' + '&beerid=' + beerId)
        .map(res => res.json());
  }

  public checkDuplicateUsername(uname) {

    return this.http.get(this.databaseServiceUrl + 'user/?action=udup' + '&uname=' + uname)
  		.map(res => res.json());
  }

  public checkDuplicateEmail(email) {

    return this.http.get(this.databaseServiceUrl + 'user/?action=edup' + '&email=' + email)
  		.map(res => res.json());
  }

  public saveUser(email,username,name,password,birthday,isFB,facebookID,fbPic) {

    return this.http.get(this.databaseServiceUrl + 'user/?action=save' 
         + '&email=' + email
         + '&username=' + username
         + '&name=' + name
         + '&password=' + password
         + '&birthday=' + birthday
         + '&isFB=' + isFB
         + '&facebookID=' + facebookID
         + '&fbPic=' + fbPic)
  		.map(res => res.json());
  }
  
  public loginFacebook(FacebookId) {
  		
    return this.http.get(this.databaseServiceUrl + 'user/?action=loginFB' 
         + '&facebookid=' + FacebookId)
  		.map(res => res.json());
  }

  public tackBeer(token,price,beer,loc,locGeo) {

    console.log(loc.types);

    return this.http.get(this.databaseServiceUrl + 'checkin/?action=tackbeer' 
         + '&token=' + token
         + '&price=' + price
         + '&name=' + loc.name
         + '&place_id=' + loc.place_id
         + '&beer_id=' + beer.id
         + '&loc_types=' + loc.types.join()
         + '&beer_name=' + beer.name
         + '&loc_rating=' + loc.rating
         + '&company=' + beer.breweries[0].name
         + '&loc_lat=' + loc.geometry.location.lat
         + '&loc_lng=' + loc.geometry.location.lng
         + '&address=' + locGeo.address
         + '&city=' + locGeo.city
         + '&state=' + locGeo.state
         + '&zip=' + locGeo.zip
         + '&county=' + locGeo.county
         + '&country=' + locGeo.country)
      .map(res => res.json());
  }

  public loginUser(credentials) {

    console.log("credentials",credentials);
    return this.http.get(this.databaseServiceUrl + 'user/?action=login' 
         + '&email=' + credentials.email
         + '&pword=' + credentials.password
         + '&socialLogin=' + credentials.socialLogin)
  		.map(res => res.json());
  }

  public getTacks(token) {
    return this.http.get(this.databaseServiceUrl+'markers/?action=mytacks'+'&token='+token)
      .map(res => res.json());    
  }

  public writeBeerReview(token,beerReview,beerRating,beerId) {

    return this.http.post(this.databaseServiceUrl+'reviews/write/',
              {
                action:'reviewbeer', 
                token: token,
                review: beerReview,
                rating: beerRating,
                beerid: beerId
              })
      .map(res => res.json());
  }

  public getBeerReviewsById(beerId) {

    return this.http.get(this.databaseServiceUrl + 'reviews/?action=GetBeerReviews&beerid=' + beerId)
      .map(res => res.json());
  }

  public saveFavoriteBeers(token,beers) {
    return this.http.post(this.databaseServiceUrl+'favorites/write/',{action:'favbeer',token:token,beers:beers})
      .map(res => res.json());    
  }

  public getFavoriteBeers(token) {
    return this.http.get(this.databaseServiceUrl + 'favorites/?action=GetFavBeers&token=' + token)
      .map(res => res.json());    
  }

  public getMostTackedDrinks(token) {
    return this.http.get(this.databaseServiceUrl + 'drinks/?action=mostTacked&token=' + token)
      .map(res => res.json());    
  }

}
