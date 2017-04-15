import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, NavParams, ActionSheetController, LoadingController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Camera } from 'ionic-native';
import { AuthService } from '../../providers/auth-service';
import { ValidationService } from '../../providers/validation-service';

import firebase from 'firebase';

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html'
})
export class ProfileEditPage {

  public uid:any;
  public profileForm:any;
  public profileRef:any;
  public profileIMG:string = 'images/default-profile.png';
  public displayName:string;
  public loading:any;
  public imageToUpload:string;
  public oldIMG:string;
  public userRef:any;
  public profilePicSeqRef:any;
  public profilePictureRef: firebase.storage.Reference;
  public deleteProPictureRef: firebase.storage.Reference;
  public percentIMGLoaded:number;

  constructor(public navCtrl: NavController, 
              public view: ViewController,
              public form: FormBuilder,
              public auth: AuthService,
              public alertCtrl: AlertController,
              public loadingCtrl:LoadingController,
              public toastCtrl:ToastController,
              public actionCtrl:ActionSheetController,
              public params: NavParams) {

  	this.uid = params.get('uid');
  	this.profileForm = this.form.group({
  	  email : ['',Validators.compose([Validators.required, 
  	              Validators.maxLength(30),
  	              ValidationService.emailValidator])],
  	  name : ['',Validators.compose([Validators.required,
  	                  Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(30)])]
  	});
    this.profilePictureRef = firebase.storage().ref('/profiles/');
    this.deleteProPictureRef = firebase.storage().ref('/profiles/');
    this.profilePicSeqRef = firebase.database().ref('/sequences/profileIMG/');
    this.userRef = firebase.database();
    this.loadProfileData();
  }

  loadProfileData() {
    this.showLoading();
    this.profileRef = firebase.database().ref('users/'+this.uid).once('value').then(snapshot => {
      console.log('snap',snapshot.val());
      this.displayName = snapshot.val().name;
      if (snapshot.val().photo!=null && snapshot.val().photo !='') {
        this.profileIMG = snapshot.val().photo;
        this.oldIMG = decodeURIComponent(snapshot.val().photo);
        console.log('oldImage',this.oldIMG.match(/\d{3}\/\d{3}\/\d{3}\/\d{12}\.png|PNG/g));
      }
        
      
    this.profileForm.setValue({
      name:snapshot.val().name, 
      email:snapshot.val().email
    });      
      this.loading.dismiss();
    });
  }

  close() {
  	this.view.dismiss();
  }

  getImgSeqDirectory(num) {
    let str:String = String(num);
    var pad = "000000000000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    let sub1 = ans.substring(0,3);
    let sub2 = ans.substring(3,6);
    let sub3 = ans.substring(6,9);
    let img = ans+'.png';
    return {sub1:sub1,sub2:sub2,sub3:sub3,img:img}; 
  }

  saveProfile() {
    if (this.profileForm.valid) {

      let user = this.auth.getUser();
      if (this.profileForm.controls.name.value.toUpperCase() !== this.displayName.toUpperCase()) {
        let updateName = {name:this.profileForm.controls.name.value};
        this.userRef.ref('users/' + this.uid).update(updateName);

        user.updateProfile({
          displayName: this.profileForm.controls.name.value
        }).then(function() {
          // Update successful.
        }, function(error) {
          // An error happened.
        });        

        this.presentToast('Display name has been changed');

      }

      if (user.email.toUpperCase() !== this.profileForm.controls.email.value.toUpperCase()) {
        this.reauthEmail();
      } else {
        this.view.dismiss();
      }
    }
  }

  changeEmail(password) {
    let user = this.auth.getUser();
    let credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
    console.log('cred',credential);
    
    user.reauthenticate(credential).then(success=> {
      user.updateEmail(this.profileForm.controls.email.value).then(resp=>{
        console.log('resp',resp);
        user.sendEmailVerification();
        let updateEmail = {email:this.profileForm.controls.email.value};
        this.userRef.ref('users/' + this.uid).update(updateEmail);
        this.presentToast('Email has been changed');
        this.view.dismiss();    
      }).catch(error=>{
        this.presentToast(error.message);
        console.log('error',error);
      });
      
    }, error=> {
      console.log('error',error);
      this.presentToast(error.message);
      // An error happened.
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

  getProfilePicSeq() {
   return new Promise(resolve=>{
    let checkinSeq = null;
    this.profilePicSeqRef.transaction(value=>{
      checkinSeq = (value||0)+1;
      return (value||0)+1;
    },(complete)=>{
      resolve(checkinSeq);
    });
   });
  }

  takePicture(sourceType) {
    this.showLoading();
    var options = {
      quality: 100,
      targetWidth: 250,
      targetHeight: 250,
      allowEdit: true,
      encodingType: Camera.EncodingType.PNG,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    Camera.getPicture(options).then((imageData) => {
      // imageData is a base64 encoded string
        this.profileIMG = "data:image/png;base64," + imageData;
        this.imageToUpload = imageData;
        let user = this.auth.getUser();

        if (this.profileIMG != null) {
          this.getProfilePicSeq().then(value=>{
            let subDir = this.getImgSeqDirectory(value);

            this.profilePictureRef.child(subDir.sub1)
              .child(subDir.sub2)
              .child(subDir.sub3)
              .child(subDir.img)
              .putString(this.imageToUpload,'base64',{contentType:'image/png'})
              .then(resp=>{
              
              let photoURL = {photo:resp.downloadURL};
              this.userRef.ref('users/' + this.uid).update(photoURL);
             
              let pictToDelete = this.oldIMG.match(/\d{3}\/\d{3}\/\d{3}\/\d{12}\.png|PNG/g);

              if (pictToDelete.length && this.oldIMG.search(/firebasestorage/) !== -1) {
                this.deleteProPictureRef.child(pictToDelete[0]).delete().then(delResp=>{
                  this.oldIMG = decodeURIComponent(resp.downloadURL);
                }).catch(error=>{
                  console.log('error',error);
                });
              }

              user.updateProfile({
                photoURL: photoURL
              }).then(function() {
                // Update successful.
              }, function(error) {
                // An error happened.
              });

              this.presentToast("Avatar has been changed");
              this.loading.dismiss(); 
            });
          });
        }
    }, (err) => {
        console.log(err);
        this.loading.dismiss();
    });
  }

  reauthEmail() {
    let prompt = this.alertCtrl.create({
      title: 'Reauthenticate Email',
      message: "Enter email password to change",
      inputs: [
        {
          name: 'password',
          placeholder:'Password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change',
          handler: data => {
            //console.log('Saved clicked');
            this.changeEmail(data.password);
          }
        }
      ]
    });
    prompt.present();
  }

  changeProfileImg() {
    let actionSheet = this.actionCtrl.create({
      title: 'Choose what you want to do with photo.',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },{
          text: 'Use Camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);   
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();    
  }

  showLoadingImg() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();    
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }   

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileEditPage');
  }

}
