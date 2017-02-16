import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,LoadingController,AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';


import { ValidationService } from '../../providers/validation-service';
import { DbService } from '../../providers/db-service';
import { AuthService } from '../../providers/auth-service';

import { MyPubPage } from '../my-pub/my-pub';
import { SuccessPage } from '../success/success';



/*
  Generated class for the CreateAccountFinal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-account-final',
  templateUrl: 'create-account-final.html'
})
export class CreateAccountFinalPage {

  public email:any;
  public name:any;
  public userName:any;
  public pword:any;
  public birthDay:any
  public gender:any;
  public newUserForm:any;
  public genderForm:any;
  public agree:boolean;
  public submitAttempt;
  public duplicateUser:boolean;
  public duplicateEmail:boolean;
  public loading:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController,
     public form: FormBuilder, public db: DbService,public loadingCtrl: LoadingController, public alertCtrl: AlertController, public auth:AuthService) {

     this.duplicateUser = false;
     this.duplicateEmail = false;


	this.newUserForm = this.form.group({
	  email : ['',Validators.compose([Validators.required, 
	              Validators.maxLength(30),
	              ValidationService.emailValidator])],
	  name : ['',Validators.compose([Validators.required,
	                  Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(30)])],
	  birthDay : ['',Validators.compose([Validators.required,ValidationService.ageValidator])],
	  agree : [false,Validators.compose([Validators.required,ValidationService.mustBeTrue])],
	  pword : ['',
	            Validators.compose([Validators.required,
	            Validators.maxLength(30),
	            Validators.minLength(5)])],
	  userName : ['',Validators.compose([Validators.required,
	                 Validators.maxLength(30),
	                 Validators.pattern('[0-9a-zA-Z]*')])]
	});

    this.genderForm = this.form.group({
      gender : ['',Validators.required]
    });
 
  }

  saveUser() {

    this.submitAttempt = true;

    if (this.newUserForm.controls.userName.value != null && this.newUserForm.controls.userName.value.length) {
	
		this.db.checkDuplicateUsername(this.newUserForm.controls.userName.value)
		  .subscribe((value)=>{

		    if (value.data) {
              this.duplicateUser = true;
		    } else {
		      this.duplicateUser = false;
		    }
		  },(error)=> {
		    console.log(error);
		  });
    }

    if (this.newUserForm.controls.email.value != null && this.newUserForm.controls.email.value.length) {
	
		this.db.checkDuplicateEmail(this.newUserForm.controls.email.value)
		  .subscribe((value)=>{

		    if (value.data) {
              this.duplicateEmail = true;
		    } else {
		      this.duplicateEmail = false;
		    }
            
		  },(error)=> {
		    console.log(error);
		  });
    }
   
    // Validation checked and we write to database
    if ( this.newUserForm.valid && !this.duplicateUser && !this.duplicateEmail) {

        this.presentLoading();

        // Submit the data through http JSON
         this.db.saveUser(this.newUserForm.controls.email.value,
			 this.newUserForm.controls.userName.value,
			 this.newUserForm.controls.name.value,
			 this.genderForm.controls.gender.value,
			 this.newUserForm.controls.pword.value,
			 this.newUserForm.controls.birthDay.value,
			 '',
			 '',
			 '')
		  .subscribe((value)=>{
	        console.log(value);
		  },(error)=> {
		    console.log(error);
		  },()=>{

		  	  this.loginEmail(this.newUserForm.controls.email.value,this.newUserForm.controls.pword.value);

		  });
    } else {

         //TODO:  Prompt screen of errors
         this.presentAlert("Fix the following erros to continue.");
    }
  }

  loginEmail(email,password) {

    let loginCredentials = {email:email,password:password};

    this.auth.login(loginCredentials).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
        this.loading.dismiss();
        this.navCtrl.setRoot(MyPubPage)
        });
      }
    },
    error => {
      console.log(error);
    });    
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountFinalPage');
  }

  cancel() {
    this.view.dismiss();
  }

  presentLoading() {
	  this.loading = this.loadingCtrl.create({
	    content: 'Creating account. Please wait...'
	  });

	  this.loading.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }  

}
