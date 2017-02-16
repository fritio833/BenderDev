import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { SingletonService } from './singleton-service';
import { DbService } from './db-service';

export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;

  constructor(public sing:SingletonService,public storage:Storage, public db:DbService) {}
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!

        this.db.loginUser(credentials.email,credentials.password)
           .subscribe(allowed => {
            //console.log(allowed);
            let access = false;

            if (allowed.status) {

              access = true;
      
              this.currentUser = new User(allowed.data.name, allowed.data.email);

              this.sing.loggedIn = true;
              this.sing.userName = allowed.data.username;
              console.log('allowed',allowed.data.token);

              this.storage.set('loggedIn',true);
              this.storage.set('token',allowed.data.token)
              this.storage.set('email',credentials.email);
              this.storage.set('userName',allowed.data.username);
              this.storage.set('name',allowed.data.name);
              this.storage.set('isFB', allowed.data.is_facebook);
              this.storage.set('fbID', allowed.data.fb_id);
              this.storage.set('fbPic', allowed.data.fb_pic);

              // Get Favorite Beers
              this.db.getFavoriteBeers(allowed.data.token).subscribe((beersObj)=>{

                  console.log('beerObj',beersObj);
                  
                  
                  if (beersObj.status) {
                    
                    let beersArray = new Array();
                    let beers = JSON.parse(beersObj.data.beers);

                    for (let i = 0; i < beers.length; i++) {
                      beersArray.push(beers[i]);
                    }
                    this.storage.set('beers',beersArray);
                  
                  }
                  
                  
                  
              });

            } else {
               access = false;
               console.log('login fail');
            }

            observer.next(access);
            observer.complete();

         },error => {
            console.log(error);
         });

      });
    }
  }
 
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;

      this.storage.ready().then(()=>{

        // store favorites before we destroy it
        this.storage.get('beers').then((beers)=>{

          console.log('beers to delete',beers);
          this.storage.get('token').then((token)=>{

              // If we have no beers to save, don't bother saving nothing.
              if(beers!=null){

                this.db.saveFavoriteBeers(token,JSON.stringify(beers)).subscribe((success)=>{
                   //console.log(success);
                   this.storage.clear();
                   observer.next(true);
                   observer.complete();
                });
              } else {
                this.storage.clear();
                observer.next(true);
                observer.complete();
             }
          });          
        });

         /*
  	    this.storage.remove('loggedIn');
        this.storage.remove('user');
        this.storage.remove('userName');
        this.storage.remove('name');
        this.storage.remove('email');
        this.storage.remove('isFB');
        this.storage.remove('fbID');
        this.storage.remove('fbPic');        

  	    this.sing.loggedIn = false;
        */
        //observer.next(true);
        //observer.complete();          

      });

    });
  }
}