import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Ionic2RatingModule } from 'ionic2-rating';

import { FbProvider } from '../providers/fb-provider';
import { BreweryService } from '../providers/brewery-service';
import { SingletonService } from '../providers/singleton-service';
import { AuthService } from '../providers/auth-service';
import { DbService } from '../providers/db-service';
import { LocationService } from '../providers/location-service';
import { GoogleService } from '../providers/google-service';
import { ConnectivityService } from '../providers/connectivity-service';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { CreateAccountFinalPage } from '../pages/create-account-final/create-account-final';
import { SuccessPage } from '../pages/success/success';
import { ChooseCategoryPage } from '../pages/choose-category/choose-category';
import { ChooseBeerTypePage } from '../pages/choose-beer-type/choose-beer-type';
import { BeerListPage } from '../pages/beer-list/beer-list';
import { SwipePage } from '../pages/swipe/swipe';
import { SearchPage } from '../pages/search/search';
import { BeerDetailPage } from '../pages/beer-detail/beer-detail';
import { MyPubPage } from '../pages/my-pub/my-pub';
import { LoginPage } from '../pages/login/login';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ProfilePage } from '../pages/profile/profile';
import { ReviewsPage } from '../pages/reviews/reviews';
import { FriendsPage } from '../pages/friends/friends';
import { ReviewBeerPage } from '../pages/review-beer/review-beer';
import { HomePage } from '../pages/home/home';
import { MyRatingsPage } from '../pages/my-ratings/my-ratings';
import { LocationResultsPage } from '../pages/location-results/location-results';
import { LocationDetailPage } from '../pages/location-detail/location-detail';
import { CheckinPage }  from '../pages/checkin/checkin';
import { TackMapPage } from '../pages/tack-map/tack-map';
import { LocationMapPage } from '../pages/location-map/location-map';
import { SearchStartPage } from '../pages/search-start/search-start';
import { SearchBeerPage } from '../pages/search-beer/search-beer';
import { SearchLocationPage } from '../pages/search-location/search-location';
import { SearchBeerFilterPage } from '../pages/search-beer-filter/search-beer-filter';
import { SearchLocationKeyPage } from '../pages/search-location-key/search-location-key';
import { SearchLocationFilterPage } from '../pages/search-location-filter/search-location-filter';
import { SearchBreweriesPage } from '../pages/search-breweries/search-breweries';
import { BreweryDetailPage } from '../pages/brewery-detail/brewery-detail';
import { SelectLocationPage } from '../pages/select-location/select-location';
import { LocationDetailsMorePage } from '../pages/location-details-more/location-details-more';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CreateAccountPage,
    CreateAccountFinalPage,
    SuccessPage,
    ChooseCategoryPage,
    ChooseBeerTypePage,
    BeerListPage,
    BeerDetailPage,
    SwipePage,
    SearchPage,
    MyPubPage,
    LoginPage,
    FavoritesPage,
    ProfilePage,
    ReviewsPage,
    FriendsPage,
    ReviewBeerPage,
    HomePage,
    MyRatingsPage,
    LocationResultsPage,
    LocationDetailPage,
    LocationDetailsMorePage,
    CheckinPage,
    TackMapPage,
    LocationMapPage,
    SearchStartPage,
    SearchBeerPage,
    SearchLocationPage,
    SearchBeerFilterPage,
    SearchLocationKeyPage,
    SearchLocationFilterPage,
    SearchBreweriesPage,
    BreweryDetailPage,
    SelectLocationPage

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CreateAccountPage,
    CreateAccountFinalPage,
    SuccessPage,
    ChooseCategoryPage,
    ChooseBeerTypePage,
    BeerListPage,
    BeerDetailPage,
    SwipePage,
    SearchPage,
    MyPubPage,
    LoginPage,
    FavoritesPage,
    ProfilePage,
    ReviewsPage,
    FriendsPage,
    ReviewBeerPage,
    HomePage,
    MyRatingsPage,
    LocationResultsPage,
    LocationDetailPage,
    LocationDetailsMorePage,
    CheckinPage,
    TackMapPage,
    LocationMapPage,
    SearchStartPage,
    SearchBeerPage,
    SearchLocationPage,
    SearchBeerFilterPage,
    SearchLocationKeyPage,
    SearchLocationFilterPage,
    SearchBreweriesPage,
    BreweryDetailPage,
    SelectLocationPage
  ],
  providers: [{provide: ErrorHandler, 
              useClass: IonicErrorHandler},
              BreweryService,
              Storage,
              FbProvider,
              SingletonService,
              AuthService,
              DbService,
              LocationService,
              GoogleService,
              ConnectivityService]
})
export class AppModule {}
