import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

let databaseServiceUrl = 'http://benderapp.servebeer.com/bender/';

/*
  Generated class for the DbService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbService {

  constructor(public http: Http) {
     //console.log('Hello DbService Provider');
  }

  public setLikeBeer(beerId) {

    return this.http.get(databaseServiceUrl + 'likes/?action=set' + '&beerid=' + beerId)
        .map(res => res.json());
  }

  public getLikeBeer(beerId) {

    return this.http.get(databaseServiceUrl + 'likes/?action=get' + '&beerid=' + beerId)
        .map(res => res.json());
  }

  public checkDuplicateUsername(uname) {

    return this.http.get(databaseServiceUrl + 'user/?action=udup' + '&uname=' + uname)
  		.map(res => res.json());
  }

  public checkDuplicateEmail(email) {

    return this.http.get(databaseServiceUrl + 'user/?action=edup' + '&email=' + email)
  		.map(res => res.json());
  }

  public saveUser(email,username,name,gender,password,birthday,isFB,facebookID,fbPic) {

    return this.http.get(databaseServiceUrl + 'user/?action=save' 
         + '&email=' + email
         + '&username=' + username
         + '&name=' + name
         + '&gender=' + gender
         + '&password=' + password
         + '&birthday=' + birthday
         + '&isFB=' + isFB
         + '&facebookID=' + facebookID
         + '&fbPic=' + fbPic)
  		.map(res => res.json());
  }
  
  public loginFacebook(FacebookId) {
  		
    return this.http.get(databaseServiceUrl + 'user/?action=loginFB' 
         + '&facebookid=' + FacebookId)
  		.map(res => res.json());
  }

  public loginUser(email,password) {

    return this.http.get(databaseServiceUrl + 'user/?action=login' 
         + '&email=' + email
         + '&pword=' + password)
  		.map(res => res.json());
  }

  public writeBeerReview(token,beerReview,beerRating,beerId) {

    return this.http.post(databaseServiceUrl+'reviews/write/',
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

    return this.http.get(databaseServiceUrl + 'reviews/?action=GetBeerReviews&beerid=' + beerId)
      .map(res => res.json());
  }

  public saveFavoriteBeers(token,beers) {
    return this.http.post(databaseServiceUrl+'favorites/write/',{action:'favbeer',token:token,beers:beers})
      .map(res => res.json());    
  }

  public getFavoriteBeers(token) {
    return this.http.get(databaseServiceUrl + 'favorites/?action=GetFavBeers&token=' + token)
      .map(res => res.json());    
  }

}
