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

                this.storage.set('loggedIn',true);
                this.storage.set('token',allowed.data.token)
                this.storage.set('email',credentials.email);
                this.storage.set('userName',allowed.data.username);
                this.storage.set('name',allowed.data.name);
                this.storage.set('isFB', allowed.data.is_facebook);
                this.storage.set('fbID', allowed.data.fb_id);
                this.storage.set('fbPic', allowed.data.fb_pic);

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
  	    this.storage.remove('loggedIn');
        this.storage.remove('token');
        this.storage.remove('user');
        this.storage.remove('userName');
        this.storage.remove('name');
        this.storage.remove('email');
        this.storage.remove('isFB');
        this.storage.remove('fbID');
        this.storage.remove('fbPic');        

  	    this.sing.loggedIn = false;
  	    observer.next(true);
  	    observer.complete();
      });

    });
  }
}