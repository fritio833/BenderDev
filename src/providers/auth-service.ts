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
        // login could be user name.  Backend makes the check.

        this.db.loginUser(credentials)
           .subscribe(allowed => {
            //console.log(allowed);
            let access = false;

            if (allowed.status) {

              access = true;
      
              this.currentUser = new User(allowed.data.name, allowed.data.email);

              this.sing.loggedIn = true;

              this.storage.set('loggedIn',true);
              this.storage.set('token',allowed.data.token)
              this.storage.set('email',credentials.email);
              this.storage.set('userName',allowed.data.username);
              this.storage.set('name',allowed.data.name);
              this.storage.set('isFB', allowed.data.is_facebook);
              this.storage.set('fbID', allowed.data.fb_id);
              this.storage.set('fbPic', allowed.data.fb_pic);
              this.storage.set('description', allowed.data.description);

              this.setSingletonData();

              // If favorites exists and this is a new device, set favorites storage
              // TODO:  Work on this later.  Code goes here.

              /*
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
              */
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

  public isLoggedIn() {
    return new Promise((resolve) => {

      this.storage.ready().then(()=>{

        this.storage.get("loggedIn").then((status) =>{
            
            if (status == null ) {

              this.sing.loggedIn = false;
              resolve(false);

            } else {

              this.setSingletonData();
              this.sing.loggedIn = true;
              resolve(true);

            }
        });

      });        
       //this.sing.loggedIn;
    });
  }

  public setSingletonData() {

    console.log("Setting Singleton Data");
    this.storage.ready().then(()=>{

      this.storage.get('fbPic').then((fbPic)=>{
        this.sing.profileIMG = fbPic;
      });

      this.storage.get("userName").then((uName) =>{
        if ( uName != null )
          this.sing.userName = uName;
      });
      this.storage.get("name").then((name) =>{
        if ( name != null)
            this.sing.realName = name;
      });

      this.storage.get("description").then((description) =>{
          this.sing.description = description;
      });

      this.storage.get("token").then((token) =>{
          this.sing.token = token;
      });                 

    });    
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
                   console.log(success);
                   //this.storage.clear();

                });
              } 
          });          
        });


  	    this.storage.remove('loggedIn');
        this.storage.remove('user');
        this.storage.remove('token');
        this.storage.remove('userName');
        this.storage.remove('name');
        this.storage.remove('email');
        this.storage.remove('isFB');
        this.storage.remove('fbID');
        this.storage.remove('fbPic');        
        this.storage.remove('description');
        this.sing.token = '';
  	    this.sing.loggedIn = false;
        
        
        observer.next(true);
        observer.complete();          

      });

    });
  }
}