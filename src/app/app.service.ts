import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Property, Location, Pagination } from './app.models';
import { AppSettings } from './app.settings';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from './shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FmlsService } from './shared/services/fmls.service';
import { fadeInItems } from '@angular/material/menu';

export class Data{
  constructor(public properties: Property[],
              public compareList: Property[],
              public favorites: Property[],
              public locations: Location[]) {}
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public Data

  public url = environment.url + '/assets/data/'; 
  public apiKey = 'AIzaSyBBkiWPUUuEJVu8B_Cf3rYL_URJfrmZ2Wc';
  
  constructor(public http:HttpClient, 
              private bottomSheet: MatBottomSheet, 
              private snackBar: MatSnackBar,
              public appSettings:AppSettings,
              public dialog: MatDialog,
              public translateService: TranslateService,
              // public fmls: FmlsService,
              @Inject(PLATFORM_ID) private platformId: Object) {
                let compareTMP = [];
                if (localStorage.getItem('compare') !== null){
                  compareTMP = JSON.parse(localStorage.getItem('compare'));
                }
                let favoritesTMP = [];
                if (localStorage.getItem('favorites') !== null){
                  favoritesTMP = JSON.parse(localStorage.getItem('favorites'));
                }
                //Otros
                this.Data = new Data(
                    [], // properties
                    compareTMP, // compareList
                    favoritesTMP, // favorites
                    []  // locations
                )
              }
    
  public getProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties.json');
  }

  public getPropertyById(id): Observable<Property>{
    return this.http.get<Property>(this.url + 'property-' + id + '.json');
  }

  public getFeaturedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'featured-properties.json');
  } 

  public getRelatedProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'related-properties.json');
  }

  public getPropertiesByAgentId(agentId): Observable<Property[]>{
    return this.http.get<Property[]>(this.url + 'properties-agentid-' + agentId + '.json');
  }

  public getLocations(): Observable<Location[]>{
    return this.http.get<Location[]>(this.url + 'locations.json');
  }

  public getAddress(lat = 34.1192869, lng = -84.033103){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey);
    
  }

  public getLatLng(address){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?key='+this.apiKey+'&address='+address);
  }

  public getFullAddress(lat = 34.1192869, lng = -84.033103){ 
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+this.apiKey).subscribe(data =>{ 
      return data['results'][0]['formatted_address'];
    });
  }

  stringCompare: any;
  objectCompare: any;
  stringfavorites: any;
  objectfavorites: any;

  public addToCompare(property:Property, component, direction){
    if(!this.Data.compareList.filter(item=>item.id == property.id)[0]){
      this.Data.compareList.push(property);
      this.stringCompare = localStorage.setItem("compare", JSON.stringify(this.Data.compareList)); 
      this.bottomSheet.open(component, {
        direction: direction
      }).afterDismissed().subscribe(isRedirect=>{  
        if(isRedirect){
          if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0,0);
          }
        }        
      });
    } 
  }

  public addToFavorites(property:Property, direction){
    if(!this.Data.favorites.filter(item=>item.id == property.id)[0]){
      this.Data.favorites.push(property);
      this.stringfavorites = localStorage.setItem("favorites", JSON.stringify(this.Data.favorites));
      this.snackBar.open('La propiedad "' + property.title + '" ha sido agregada a favoritos.', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction: direction 
      });  
    }    
  }

  public openConfirmDialog(title:string, message:string) {  
    const dialogData = new ConfirmDialogModel(title, message); 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    }); 
    return dialogRef; 
  }

  public openAlertDialog(message:string) {   
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "400px",
      data: message
    }); 
    return dialogRef; 
  }

  public getTranslateValue(key:string, param:string = null){  
    let value = null;
    this.translateService.get(key, { param: param }).subscribe((res: string) => {
      value = res;
    }) 
    return value; 
  }

  public getPropertyTypes(){
    return [ 
      { id: 1, name: 'Oficina' },
      { id: 2, name: 'Casa' },
      { id: 3, name: 'Apartamento' }
    ]
  }

  public getPropertyStatuses(){
    return [ 
      { id: 1, name: 'En Venta' },
      { id: 2, name: 'En Renta' },
      { id: 3, name: 'Casa Abierta' },
      { id: 4, name: 'Sin Tarifas' },
      { id: 5, name: 'Oferta' },
      { id: 6, name: 'Vendida' }
    ]
  }

  public getCities(){
    return [
      { id: 22, name: 'Abbeville' }, 
      { id: 1, name: 'Acworth' },
      { id: 23, name: 'Adairsville' },
      { id: 24, name: 'Adel' },
      { id: 21, name: 'Ailey' },
      { id: 25, name: 'Alamo' },
      { id: 26, name: 'Albany' },
      { id: 27, name: 'Alma' },
      { id: 28, name: 'Alpharetta' },
      { id: 29, name: 'Ambrose' },
      { id: 30, name: 'Americus' },
      { id: 31, name: 'Andersonville' },
      { id: 32, name: 'Aragon' },
      { id: 33, name: 'Arcade' },
      { id: 34, name: 'Arlington' },
      { id: 35, name: 'Arnoldsville' },
      { id: 36, name: 'Ashburn' },
      { id: 37, name: 'Athens' },
      { id: 2, name: 'Atlanta' },
      { id: 38, name: 'Attapulgus' },
      { id: 39, name: 'Auburn' },
      { id: 40, name: 'Augusta' },
      { id: 3, name: 'Austell' },
      { id: 41, name: 'Avera' },
      { id: 42, name: 'Avondale Estates' },
      { id: 43, name: 'Baconton' },
      { id: 44, name: 'Bainbridge' },
      { id: 45, name: 'Baldwin' },
      { id: 46, name: 'Bail Ground' },
      { id: 47, name: 'Barnesville' },
      { id: 48, name: 'Baxley' },
      { id: 49, name: 'Bellville' },
      { id: 50, name: 'Berkeley Lake' },
      { id: 51, name: 'Blackshear' },
      { id: 52, name: 'Blairsville' },
      { id: 53, name: 'Blakely' },
      { id: 54, name: 'Blommingdale' },
      { id: 55, name: 'Blue Ridge' },
      { id: 56, name: 'Blythe' },
      { id: 57, name: 'Boston' },
      { id: 58, name: 'Bostwick' },
      { id: 59, name: 'Bowdon' },
      { id: 60, name: 'Bowman' },
      { id: 61, name: 'Braswell' },
      { id: 62, name: 'Bremen' },
      { id: 63, name: 'Bronwood' },
      { id: 64, name: 'Brooklet' },
      { id: 65, name: 'Broxton' },
      { id: 66, name: 'Brunswick' },
      { id: 67, name: 'Buchanan' },
      { id: 68, name: 'Buena Vista' },
      { id: 69, name: 'Buford' },
      { id: 70, name: 'Butler' },
      { id: 71, name: 'Byron' },
      { id: 72, name: 'Cairo' },
      { id: 73, name: 'Calhoun' },
      { id: 74, name: 'Canon' },
      { id: 75, name: 'Canton' },
      { id: 76, name: 'Carlton' },
      { id: 77, name: 'Carnesville' },
      { id: 78, name: 'Carrollton' },
      { id: 79, name: 'Cartersville' },
      { id: 80, name: 'Cave Spring' },
      { id: 81, name: 'Cedartown' },
      { id: 82, name: 'Centerville' },
      { id: 83, name: 'Chamblee' },
      { id: 84, name: 'Chatsworth' },
      { id: 85, name: 'Chattahoochee Hills' },
      { id: 86, name: 'Chickamauga' },
      { id: 87, name: 'Clarksville' },
      { id: 88, name: 'Clarkston' },
      { id: 89, name: 'Claxton' },
      { id: 90, name: 'Clayton' },
      { id: 91, name: 'Cleveland' },
      { id: 92, name: 'Climax' },
      { id: 93, name: 'Cobbtown' },
      { id: 94, name: 'Cochran' },
      { id: 95, name: 'Coleman' },
      { id: 4, name: 'College Park' },
      { id: 97, name: 'Collins' },
      { id: 98, name: 'Colquitt' },
      { id: 99, name: 'Columbus' },
      { id: 96, name: 'Corner' },
      { id: 97, name: 'Commerce' },
      { id: 98, name: 'Conyers' },
      { id: 99, name: 'Coolidge' },
      { id: 100, name: 'Cordele' },
      { id: 101, name: 'Cornelia' },
      { id: 102, name: 'Covington' },
      { id: 103, name: 'Crawford' },
      { id: 104, name: 'Crawfordville' },
      { id: 105, name: 'Culloden' },
      { id: 106, name: 'Cumming' },
      { id: 107, name: 'Cusseta' },
      { id: 108, name: 'Cuthbert' },
      { id: 5, name: 'Dacula' },
      { id: 109, name: 'Dahlonega' },
      { id: 110, name: 'Daisy' },
      { id: 111, name: 'Dallas' },
      { id: 112, name: 'Dalton' },
      { id: 113, name: 'Danielsville' },
      { id: 114, name: 'Darien' },
      { id: 115, name: 'Davisboro' },
      { id: 116, name: 'Dawson' },
      { id: 117, name: 'Dawsonville' },
      { id: 118, name: 'Dearing' },
      { id: 119, name: 'Decatur' },
      { id: 120, name: 'Demorest' },
      { id: 121, name: 'Denton' },
      { id: 122, name: 'De Soto' },
      { id: 123, name: 'Dillard' },
      { id: 124, name: 'Doerun' },
      { id: 125, name: 'Donaldsonville' },
      { id: 126, name: 'Doraville' },
      { id: 127, name: 'Douglas' },
      { id: 128, name: 'Douglasville' },
      { id: 129, name: 'Dublin' },
      { id: 130, name: 'Dudley' },
      { id: 6, name: 'Duluth' },
      { id: 131, name: 'Dunwoody' },
      { id: 132, name: 'East Dublin' },
      { id: 133, name: 'East Ellijay' },
      { id: 134, name: 'East Point' },
      { id: 135, name: 'Eastman' },
      { id: 136, name: 'Eatonton' },
      { id: 137, name: 'Edge Hill' },
      { id: 138, name: 'Edison' },
      { id: 139, name: 'Elberton' },
      { id: 140, name: 'Ellaville' },
      { id: 7, name: 'Ellenwood' },
      { id: 141, name: 'Ellijay' },
      { id: 142, name: 'Emerson' },
      { id: 143, name: 'Eton' },
      { id: 144, name: 'Euharlle' },
      { id: 145, name: 'Fairburn' },
      { id: 146, name: 'Fairmount' },
      { id: 147, name: 'Fargo' },
      { id: 148, name: 'Fitzgerald' },
      { id: 149, name: 'Flemington' },
      { id: 150, name: 'Flovilla' },
      { id: 151, name: 'Flowery Branch' },
      { id: 152, name: 'Folkston' },
      { id: 8, name: 'Forest Park' },
      { id: 153, name: 'Forsyth' },
      { id: 154, name: 'Fort Benning' },
      { id: 155, name: 'Fort Gaines' },
      { id: 156, name: 'Fort Oglethrope' },
      { id: 157, name: 'Fort Valley' },
      { id: 158, name: 'Franklin' },
      { id: 9, name: 'Gainesville' },
      { id: 159, name: 'Garden City' },
      { id: 160, name: 'Georgetown' },
      { id: 161, name: 'Gibson' },
      { id: 162, name: 'Gillsville' },
      { id: 163, name: 'Glennville' },
      { id: 164, name: 'Glenwood' },
      { id: 165, name: 'Gordon' },
      { id: 166, name: 'Graham' },
      { id: 167, name: 'Grantville' },
      { id: 168, name: 'Gray' },
      { id: 169, name: 'Grayson' },
      { id: 170, name: 'Greensboro' },
      { id: 171, name: 'Greenville' },
      { id: 172, name: 'Griffin' },
      { id: 173, name: 'Grovetown' },
      { id: 174, name: 'Gumbranch' },
      { id: 175, name: 'Guyton' },
      { id: 176, name: 'Hagan' },
      { id: 177, name: 'Hahira' },
      { id: 178, name: 'Hamilton' },
      { id: 10, name: 'Hamptom' },
      { id: 179, name: 'Hapeville' },
      { id: 180, name: 'Hardwick' },
      { id: 181, name: 'Harlem' },
      { id: 182, name: 'Harrison' },
      { id: 183, name: 'Hartwell' },
      { id: 184, name: 'Hawkinsville' },
      { id: 185, name: 'Hazlehurst' },
      { id: 186, name: 'Helen' },
      { id: 187, name: 'Helena' },
      { id: 188, name: 'Hephzibah' },
      { id: 189, name: 'Hiltonia' },
      { id: 190, name: 'Hinesville' },
      { id: 191, name: 'Hiram' },
      { id: 192, name: 'Hoboken' },
      { id: 193, name: 'Hogansville' },
      { id: 194, name: 'Holly Springs' },
      { id: 195, name: 'Homeland' },
      { id: 196, name: 'Homerville' },
      { id: 197, name: 'Hoschton' },
      { id: 198, name: 'Howard' },
      { id: 199, name: 'Hull' },
      { id: 200, name: 'Ideal' },
      { id: 201, name: 'Ila' },
      { id: 202, name: 'Irwinton' },
      { id: 203, name: 'Isle of Hope' },
      { id: 204, name: 'Jackson' },
      { id: 205, name: 'Jakin' },
      { id: 206, name: 'Jasper' },
      { id: 207, name: 'Jefferson' },
      { id: 208, name: 'Jeffersonville' },
      { id: 209, name: 'Jesup' },
      { id: 210, name: 'Johns Creek' },
      { id: 211, name: 'Jonesboro' },
      { id: 212, name: 'Kennesaw' },
      { id: 213, name: 'Kingsland' },
      { id: 214, name: 'Kingston' },
      { id: 215, name: 'La Fayette' },
      { id: 216, name: 'LaGrange' },
      { id: 217, name: 'Lake City' },
      { id: 218, name: 'Lake Park' },
      { id: 219, name: 'Lakeland' },
      { id: 220, name: 'Lavonia' },
      { id: 11, name: 'Lawrenceville' },
      { id: 221, name: 'Leary' },
      { id: 222, name: 'Leesburg' },
      { id: 223, name: 'Lenox' },
      { id: 224, name: 'Leslie' },
      { id: 225, name: 'Lexington' },
      { id: 12, name: 'Lilburn' },
      { id: 226, name: 'Lilly' },
      { id: 227, name: 'Lincolnton' },
      { id: 228, name: 'Lithonia' },
      { id: 229, name: 'Locust Grove' },
      { id: 230, name: 'Loganville' },
      { id: 231, name: 'Lookout Mountain' },
      { id: 232, name: 'Louisville' },
      { id: 233, name: 'Lovejoy' },
      { id: 234, name: 'Ludowici' },
      { id: 235, name: 'Lula' },
      { id: 236, name: 'Lumber City' },
      { id: 237, name: 'Lumpkin' },
      { id: 238, name: 'Luthersville' },
      { id: 239, name: 'Lyons' },
      { id: 240, name: 'Macon' },
      { id: 241, name: 'Madison' },
      { id: 242, name: 'Manassas' },
      { id: 243, name: 'Manchester' },
      { id: 244, name: 'Mansfield' },
      { id: 13, name: 'Marietta' },
      { id: 245, name: 'Marshallville' },
      { id: 246, name: 'Matthews' },
      { id: 247, name: 'McCaysville' },
      { id: 14, name: 'Mcdonought' },
      { id: 248, name: 'McRae' },
      { id: 249, name: 'Menasville' },
      { id: 250, name: 'Meigs' },
      { id: 251, name: 'Menlo' },
      { id: 252, name: 'Metter' },
      { id: 253, name: 'Midville' },
      { id: 254, name: 'Midway' },
      { id: 255, name: 'Milledgeville' },
      { id: 256, name: 'Millen' },
      { id: 257, name: 'Milner' },
      { id: 258, name: 'Milton' },
      { id: 259, name: 'Mineral Bluff' },
      { id: 260, name: 'Molena' },
      { id: 261, name: 'Monroe' },
      { id: 262, name: 'Montezuma' },
      { id: 263, name: 'Montgomery' },
      { id: 264, name: 'Monticello' },
      { id: 265, name: 'Morgan' },
      { id: 266, name: 'Morrow' },
      { id: 267, name: 'Morven' },
      { id: 268, name: 'Moultrie' },
      { id: 269, name: 'Mount Vernon' },
      { id: 270, name: 'Mount Zion' },
      { id: 271, name: 'Nahunta' },
      { id: 272, name: 'Nashville' },
      { id: 273, name: 'Nelson' },
      { id: 274, name: 'Newnan' },
      { id: 275, name: 'Newton' },
      { id: 276, name: 'Nicholls' },
      { id: 277, name: 'Nicholson' },
      { id: 15, name: 'Norcross' },
      { id: 278, name: 'Norman Park' },
      { id: 279, name: 'Norwood' },
      { id: 280, name: 'Oakwood' },
      { id: 281, name: 'Ocilla' },
      { id: 282, name: 'Oconee' },
      { id: 283, name: 'Offerman' },
      { id: 284, name: 'Oglethorpe' },
      { id: 285, name: 'Oliver' },
      { id: 286, name: 'Omega' },
      { id: 287, name: 'Oxford' },
      { id: 288, name: 'Palmetto' },
      { id: 289, name: 'Patterson' },
      { id: 290, name: 'Pavo' },
      { id: 291, name: 'Payne' },
      { id: 292, name: 'Peachthree City' },
      { id: 293, name: 'Pearson' },
      { id: 294, name: 'Pelham' },
      { id: 295, name: 'Pembroke' },
      { id: 296, name: 'Pendergrass' },
      { id: 297, name: 'Perry' },
      { id: 298, name: 'Phillipsburg' },
      { id: 299, name: 'Pine Lake' },
      { id: 300, name: 'Pine Mountain Valley' },
      { id: 301, name: 'Pinehurst' },
      { id: 302, name: 'Pitts' },
      { id: 303, name: 'Plains' },
      { id: 304, name: 'Plainville' },
      { id: 305, name: 'Pooler' },
      { id: 306, name: 'Port Wentworth' },
      { id: 307, name: 'Poulan' },
      { id: 308, name: 'Powder Springs' },
      { id: 309, name: 'Preston' },
      { id: 310, name: 'Quitman' },
      { id: 311, name: 'Ray City' },
      { id: 312, name: 'Rebecca' },
      { id: 313, name: 'Reidsville' },
      { id: 314, name: 'Remerton' },
      { id: 315, name: 'Resaca' },
      { id: 16, name: 'Rex' },
      { id: 316, name: 'Riceboro' },
      { id: 317, name: 'Richland' },
      { id: 318, name: 'Richmond Hill' },
      { id: 319, name: 'Rincon' },
      { id: 320, name: 'Ringgold' },
      { id: 321, name: 'Riverdale' },
      { id: 322, name: 'Roberta' },
      { id: 323, name: 'Rochelle' },
      { id: 324, name: 'Rockingham' },
      { id: 325, name: 'Rockmart' },
      { id: 326, name: 'Rome' },
      { id: 327, name: 'Roopville' },
      { id: 328, name: 'Rossville' },
      { id: 329, name: 'Roswell' },
      { id: 330, name: 'Royston' },
      { id: 331, name: 'Rutledge' },
      { id: 332, name: 'Saint Marys' },
      { id: 333, name: 'Sandersville' },
      { id: 334, name: 'Sandy Springs' },
      { id: 335, name: 'Santa Claus' },
      { id: 336, name: 'Savannah' },
      { id: 337, name: 'Scotland' },
      { id: 338, name: 'Screven' },
      { id: 339, name: 'Senoia' },
      { id: 340, name: 'Sharon' },
      { id: 341, name: 'Shellman' },
      { id: 342, name: 'Shiloh' },
      { id: 343, name: 'Skidaway Island' },
      { id: 344, name: 'Smithville' },
      { id: 17, name: 'Smyrna' },
      { id: 18, name: 'Snellville' },
      { id: 345, name: 'Social Circle' },
      { id: 346, name: 'Soperton' },
      { id: 347, name: 'Sparta' },
      { id: 348, name: 'Springfield' },
      { id: 349, name: 'Stapleton' },
      { id: 350, name: 'Statenville' },
      { id: 351, name: 'Stateshoro' },
      { id: 352, name: 'Statham' },
      { id: 19, name: 'Stockbridge' },
      { id: 20, name: 'Stone Mountain' },
      { id: 353, name: 'Sugar Hill' },
      { id: 354, name: 'Summerville' },
      { id: 355, name: 'Sunny Side' },
      { id: 356, name: 'Suwanee' },
      { id: 357, name: 'Swainsboro' },
      { id: 358, name: 'Sycamore' },
      { id: 359, name: 'Sylvania' },
      { id: 360, name: 'Sylvester' },
      { id: 361, name: 'Talbotton' },
      { id: 362, name: 'Tallapoosa' },
      { id: 363, name: 'Temple' },
      { id: 364, name: 'Tennille' },
      { id: 365, name: 'Thomaston' },
      { id: 366, name: 'Thomasville' },
      { id: 367, name: 'Thomson' },
      { id: 368, name: 'Tifton' },
      { id: 369, name: 'Toccoa' },
      { id: 370, name: 'Trenton' },
      { id: 371, name: 'Tucker' },
      { id: 372, name: 'Tunnel Hill' },
      { id: 373, name: 'Twin City' },
      { id: 374, name: 'Tybee Island' },
      { id: 375, name: 'Ty Ty' },
      { id: 376, name: 'Unadilla' },
      { id: 377, name: 'Union City' },
      { id: 378, name: 'Union Point' },
      { id: 379, name: 'Unionville' },
      { id: 380, name: 'Uvalda' },
      { id: 381, name: 'Valdosta' },
      { id: 382, name: 'Varnell' },
      { id: 383, name: 'Vidalia' },
      { id: 384, name: 'Vidette' },
      { id: 385, name: 'Vienna' },
      { id: 386, name: 'Villa Rica' },
      { id: 387, name: 'Waco' },
      { id: 388, name: 'Wadley' },
      { id: 389, name: 'Waleska' },
      { id: 390, name: 'Walnut Grove' },
      { id: 391, name: 'Walthourville' },
      { id: 392, name: 'Warm Springs' },
      { id: 393, name: 'Warner Robins' },
      { id: 394, name: 'Warrenton' },
      { id: 395, name: 'Warwick' },
      { id: 396, name: 'Washington' },
      { id: 397, name: 'Watkinsville' },
      { id: 398, name: 'Waverly Hall' },
      { id: 399, name: 'Waycross' },
      { id: 400, name: 'Waynesboro' },
      { id: 401, name: 'West Point' },
      { id: 402, name: 'Whigham' },
      { id: 403, name: 'White' },
      { id: 404, name: 'White Plains' },
      { id: 405, name: 'Whitemarsh Island' },
      { id: 406, name: 'Wildwood Island' },
      { id: 407, name: 'Willacoochee' },
      { id: 408, name: 'Wilmington Island' },
      { id: 409, name: 'Winder' },
      { id: 410, name: 'Winterville' },
      { id: 411, name: 'Woodbine' },
      { id: 412, name: 'Woodbury' },
      { id: 413, name: 'Woodland' },
      { id: 414, name: 'Woodstock' },
      { id: 415, name: 'Woodville' },
      { id: 416, name: 'Wrens' },
      { id: 417, name: 'Wrightsville' },
      { id: 419, name: 'Yatesville' },
      { id: 418, name: 'Young Harris' },
      { id: 420, name: 'Zebulon' },
    ]
  }

  public getNeighborhoods(){
    return [      
      { id: 1, name: 'Astoria', cityId: 1 },
      { id: 2, name: 'Midtown', cityId: 1 },
      { id: 3, name: 'Chinatown', cityId: 1 }, 
      { id: 4, name: 'Austin', cityId: 2 },
      { id: 5, name: 'Englewood', cityId: 2 },
      { id: 6, name: 'Riverdale', cityId: 2 },      
      { id: 7, name: 'Hollywood', cityId: 3 },
      { id: 8, name: 'Sherman Oaks', cityId: 3 },
      { id: 9, name: 'Highland Park', cityId: 3 },
      { id: 10, name: 'Belltown', cityId: 4 },
      { id: 11, name: 'Queen Anne', cityId: 4 },
      { id: 12, name: 'Green Lake', cityId: 4 }      
    ]
  }

  public getStreets(){
    return [      
      { id: 1, name: 'Astoria Street #1', cityId: 1, neighborhoodId: 1},
      { id: 2, name: 'Astoria Street #2', cityId: 1, neighborhoodId: 1},
      { id: 3, name: 'Midtown Street #1', cityId: 1, neighborhoodId: 2 },
      { id: 4, name: 'Midtown Street #2', cityId: 1, neighborhoodId: 2 },
      { id: 5, name: 'Chinatown Street #1', cityId: 1, neighborhoodId: 3 }, 
      { id: 6, name: 'Chinatown Street #2', cityId: 1, neighborhoodId: 3 },
      { id: 7, name: 'Austin Street #1', cityId: 2, neighborhoodId: 4 },
      { id: 8, name: 'Austin Street #2', cityId: 2, neighborhoodId: 4 },
      { id: 9, name: 'Englewood Street #1', cityId: 2, neighborhoodId: 5 },
      { id: 10, name: 'Englewood Street #2', cityId: 2, neighborhoodId: 5 },
      { id: 11, name: 'Riverdale Street #1', cityId: 2, neighborhoodId: 6 }, 
      { id: 12, name: 'Riverdale Street #2', cityId: 2, neighborhoodId: 6 },
      { id: 13, name: 'Hollywood Street #1', cityId: 3, neighborhoodId: 7 },
      { id: 14, name: 'Hollywood Street #2', cityId: 3, neighborhoodId: 7 },
      { id: 15, name: 'Sherman Oaks Street #1', cityId: 3, neighborhoodId: 8 },
      { id: 16, name: 'Sherman Oaks Street #2', cityId: 3, neighborhoodId: 8 },
      { id: 17, name: 'Highland Park Street #1', cityId: 3, neighborhoodId: 9 },
      { id: 18, name: 'Highland Park Street #2', cityId: 3, neighborhoodId: 9 },
      { id: 19, name: 'Belltown Street #1', cityId: 4, neighborhoodId: 10 },
      { id: 20, name: 'Belltown Street #2', cityId: 4, neighborhoodId: 10 },
      { id: 21, name: 'Queen Anne Street #1', cityId: 4, neighborhoodId: 11 },
      { id: 22, name: 'Queen Anne Street #2', cityId: 4, neighborhoodId: 11 },
      { id: 23, name: 'Green Lake Street #1', cityId: 4, neighborhoodId: 12 },
      { id: 24, name: 'Green Lake Street #2', cityId: 4, neighborhoodId: 12 }      
    ]
  }

  public getFeatures(){
    return [ 
      { id: 1, name: 'Aire acondicionado', selected: false },
      { id: 2, name: 'Parrillera', selected: false },
      { id: 3, name: 'Secadora', selected: false },
      { id: 4, name: 'Microondas', selected: false }, 
      { id: 5, name: 'Refrigerador', selected: false },
      { id: 6, name: 'TV Cable', selected: false },
      { id: 7, name: 'Sauna', selected: false },
      { id: 8, name: 'WiFi', selected: false },
      { id: 9, name: 'Fireplace', selected: false },
      { id: 10, name: 'Piscina', selected: false },
      { id: 11, name: 'Gimnasio', selected: false },
    ]
  }


  public getHomeCarouselSlides(){
    return this.http.get<any[]>(this.url + 'slides.json');
  }


  public filterData(data, params: any, sort?, page?, perPage?){ 
   
    if(params){

      if(params.propertyType){
        data = data.filter(property => property.propertyType == params.propertyType.name)
      }

      if(params.propertyStatus && params.propertyStatus.length){       
        let statuses = [];
        params.propertyStatus.forEach(status => { statuses.push(status.name) });           
        let properties = [];
        data.filter(property =>
          property.propertyStatus.forEach(status => {             
            if(statuses.indexOf(status) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.price){
        if(this.appSettings.settings.currency == 'USD'){          
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale >= params.price.from ){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent >= params.price.from ){
                return true;
              } 
              return false;
            });
          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale <= params.price.to){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent <= params.price.to){
                return true;
              } 
              return false;
            });          
          }
        }
        if(this.appSettings.settings.currency == 'EUR'){
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale >= params.price.from ){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent >= params.price.from ){
                return true;
              } 
              return false;
            });

          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale <= params.price.to){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent <= params.price.to){
                return true;
              } 
              return false;
            });
          }
        }        
      }  

      if(params.city){
        data = data.filter(property => property.city == params.city.name)
      }

      if(params.zipCode){
        data = data.filter(property => property.zipCode == params.zipCode)
      }
      
      if(params.neighborhood && params.neighborhood.length){       
        let neighborhoods = [];
        params.neighborhood.forEach(item => { neighborhoods.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.neighborhood.forEach(item => {             
            if(neighborhoods.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.street && params.street.length){       
        let streets = [];
        params.street.forEach(item => { streets.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.street.forEach(item => {             
            if(streets.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.bedrooms){
        if(params.bedrooms.from){
          data = data.filter(property => property.bedrooms >= params.bedrooms.from)
        }
        if(params.bedrooms.to){
          data = data.filter(property => property.bedrooms <= params.bedrooms.to)
        }
      } 
      
      if(params.bathrooms){
        if(params.bathrooms.from){
          data = data.filter(property => property.bathrooms >= params.bathrooms.from)
        }
        if(params.bathrooms.to){
          data = data.filter(property => property.bathrooms <= params.bathrooms.to)
        }
      } 

      if(params.garages){
        if(params.garages.from){
          data = data.filter(property => property.garages >= params.garages.from)
        }
        if(params.garages.to){
          data = data.filter(property => property.garages <= params.garages.to)
        }
      } 

      if(params.area){
        if(params.area.from){
          data = data.filter(property => property.area.value >= params.area.from)
        }
        if(params.area.to){
          data = data.filter(property => property.area.value <= params.area.to)
        }
      } 

      if(params.yearBuilt){
        if(params.yearBuilt.from){
          data = data.filter(property => property.yearBuilt >= params.yearBuilt.from)
        }
        if(params.yearBuilt.to){
          data = data.filter(property => property.yearBuilt <= params.yearBuilt.to)
        }
      }

      if(params.courtesy){
        data = data.filter(property => property.courtesy == params.courtesy.name)
      }

      if(params.features){       
        let arr = [];
        params.features.forEach(feature => { 
          if(feature.selected)
            arr.push(feature.name);
        });  
        if(arr.length > 0){
          let properties = [];
          data.filter(property =>
            property.features.forEach(feature => {             
              if(arr.indexOf(feature) > -1){                 
                if(!properties.includes(property)){
                  properties.push(property);
                }                
              }
            })
          );
          data = properties;
        }         
        
      }
      
    }

    // console.log('data:',data)
    
    for(let i = 0; i < data.length; i = i + perPage){
      data = [...new Set(data.slice(i, data.length))]
    }
    
    // console.log('data for:',data)
    //for show more properties mock data 
    // for (var index = 0; index < 2; index++) {
    //   data = data.concat(data);        
    // }     
     
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public newfilterData(data, params: any, sort?, page?, perPage?){ 
   
    if(params){

      if(params.propertyType){
        data = data.filter(property => property.propertyType == params.propertyType.name)
      }

      if(params.propertyStatus && params.propertyStatus.length){       
        let statuses = [];
        params.propertyStatus.forEach(status => { statuses.push(status.name) });           
        let properties = [];
        data.filter(property =>
          property.propertyStatus.forEach(status => {             
            if(statuses.indexOf(status) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.price){
        if(this.appSettings.settings.currency == 'USD'){          
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale >= params.price.from ){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent >= params.price.from ){
                return true;
              } 
              return false;
            });
          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceDollar.sale && property.priceDollar.sale <= params.price.to){
                return true;
              }
              if(property.priceDollar.rent && property.priceDollar.rent <= params.price.to){
                return true;
              } 
              return false;
            });          
          }
        }
        if(this.appSettings.settings.currency == 'EUR'){
          if(params.price.from){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale >= params.price.from ){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent >= params.price.from ){
                return true;
              } 
              return false;
            });

          }
          if(params.price.to){
            data = data.filter(property => {
              if(property.priceEuro.sale && property.priceEuro.sale <= params.price.to){
                return true;
              }
              if(property.priceEuro.rent && property.priceEuro.rent <= params.price.to){
                return true;
              } 
              return false;
            });
          }
        }        
      }  

      if(params.city){
        data = data.filter(property => property.city == params.city.name)
      }

      if(params.zipCode){
        data = data.filter(property => property.zipCode == params.zipCode)
      }
      
      if(params.neighborhood && params.neighborhood.length){       
        let neighborhoods = [];
        params.neighborhood.forEach(item => { neighborhoods.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.neighborhood.forEach(item => {             
            if(neighborhoods.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.street && params.street.length){       
        let streets = [];
        params.street.forEach(item => { streets.push(item.name) });           
        let properties = [];
        data.filter(property =>
          property.street.forEach(item => {             
            if(streets.indexOf(item) > -1){                 
              if(!properties.includes(property)){
                properties.push(property);
              }                
            }
          })
        );
        data = properties;
      }

      if(params.bedrooms){
        if(params.bedrooms.from){
          data = data.filter(property => property.bedrooms >= params.bedrooms.from)
        }
        if(params.bedrooms.to){
          data = data.filter(property => property.bedrooms <= params.bedrooms.to)
        }
      } 
      
      if(params.bathrooms){
        if(params.bathrooms.from){
          data = data.filter(property => property.bathrooms >= params.bathrooms.from)
        }
        if(params.bathrooms.to){
          data = data.filter(property => property.bathrooms <= params.bathrooms.to)
        }
      } 

      if(params.garages){
        if(params.garages.from){
          data = data.filter(property => property.garages >= params.garages.from)
        }
        if(params.garages.to){
          data = data.filter(property => property.garages <= params.garages.to)
        }
      } 

      if(params.area){
        if(params.area.from){
          data = data.filter(property => property.area.value >= params.area.from)
        }
        if(params.area.to){
          data = data.filter(property => property.area.value <= params.area.to)
        }
      } 

      if(params.yearBuilt){
        if(params.yearBuilt.from){
          data = data.filter(property => property.yearBuilt >= params.yearBuilt.from)
        }
        if(params.yearBuilt.to){
          data = data.filter(property => property.yearBuilt <= params.yearBuilt.to)
        }
      }

      if(params.courtesy){
        data = data.filter(property => property.courtesy == params.courtesy.name)
      }

      if(params.features){       
        let arr = [];
        params.features.forEach(feature => { 
          if(feature.selected)
            arr.push(feature.name);
        });  
        if(arr.length > 0){
          let properties = [];
          data.filter(property =>
            property.features.forEach(feature => {             
              if(arr.indexOf(feature) > -1){                 
                if(!properties.includes(property)){
                  properties.push(property);
                }                
              }
            })
          );
          data = properties;
        }         
        
      }
      
    }

    // console.log(data)
    
    // if (data.length >= 20){
      // for(let i = 0; i < data.length; i = i + perPage){
      //   data = [...new Set(data.slice(i, data.length))]
      // }
    // }

    //for show more properties mock data 
    // for (var index = 0; index < 2; index++) {
    //   data = data.concat(data);        
    // }     
     
    this.sortData(sort, data);
    return this.paginator(data, page, perPage)
  }

  public sortData(sort, data){
    if(sort){
      switch (sort) {
        case 'Nuevo':
          data = data.sort((a, b)=> {return <any>new Date(b.published) - <any>new Date(a.published)});           
          break;
        case 'Viejo':
          data = data.sort((a, b)=> {return <any>new Date(a.published) - <any>new Date(b.published)});           
          break;
        case 'Popular':
          data = data.sort((a, b) => { 
            if(a.ratingsValue/a.ratingsCount < b.ratingsValue/b.ratingsCount){
              return 1;
            }
            if(a.ratingsValue/a.ratingsCount > b.ratingsValue/b.ratingsCount){
              return -1;
            }
            return 0; 
          });
          break;
        case 'Precio (Bajo a Alto)':
          if(this.appSettings.settings.currency == 'USD'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        case 'Precio (Alto a Bajo)':
          if(this.appSettings.settings.currency == 'USD'){
            data = data.sort((a,b) => {
              if((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)){
                return 1;
              }
              if((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          if(this.appSettings.settings.currency == 'EUR'){
            data = data.sort((a,b) => {
              if((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.v.rent)){
                return 1;
              }
              if((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.priceEuro.rent)){
                return -1;
              }
              return 0;  
            }) 
          }
          break;
        default:
          break;
      }
    }
    return data;
  }

  public paginator(items, page?, perPage?) {
    var page = page || 1,
    perPage = perPage || 1,
    offset = (page - 1) * perPage,   
    paginatedItems = items.slice(offset).slice(0, perPage),
    totalPages = Math.ceil(items.length / perPage);
    return {
      data: paginatedItems,
      pagination:{
        page: page,
        perPage: perPage,
        prePage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length + 12,
        totalPages: totalPages,
      }
    };
  }



  public getTestimonials(){
    return [
        { 
            text: 'Muy buen servicio los recomiendo. Muy buena ayuda desde el principio hasta el final👍👌👌. Son excelentes, muy eficientes si quieren comprar o vender llámalos a ellos ahora.', 
            author: 'Alberto Arias', 
            // position: 'General Director', 
            image: 'assets/images/profile/Alberto Arias.jpg' 
        },
        { 
            text: 'excelente equipo los recomiendo al 100 más k ayudar se toman tan serio y con tanto amor su trabajo k a uno le aclaran cada duda cada paso en el proseso de la compra gracias por la ayuda, mil bendiciones.', 
            author: 'Martha Mary Lopez', 
            // position: 'Housewife', 
            image: 'assets/images/profile/Martha Mary Lopez.jpg' 
        },
        { 
            text: '¡Guau! ¿Por dónde empiezo? Esta experiencia no ha sido más que increíble, por supuesto que hubo baches en el camino pero el equipo siempre estuvo atento a nuestras necesidades y nuestras preocupaciones. Si estás buscando comprar o vender tu casa, definitivamente te recomiendo esta agencia, ¡siempre te atenderán a ti y a tus necesidades!', 
            author: 'Zoima Rocha', 
            // position: 'Blogger', 
            image: 'assets/images/profile/Zoima Rocha.jpg' 
        },
        { 
            text: '100% Recomendado, son un excelente equipo que me ayudaron a comprar y vender mi casa. Te aclaran todas tus dudas y si no sabes algo te ayudan.', 
            author: 'Emanuel Esquivel', 
            // position: 'Marketing Manager', 
            image: 'assets/images/profile/Emanuel Esquivel.jpg' 
        }
    ];
  }

  public getImagesNosotros(){
    return [
      {
        image: 'assets/images/fotosContact/BookSpanish.png'
      },
      {
        image: 'assets/images/fotosContact/BookEnglish.png'
      },
      {
        image: 'assets/images/fotosContact/image3.jpg'
      },
      {
        image: 'assets/images/fotosContact/image6.jpg'
      },
    ];
  }

  public getAgents(){
    return [        
        { 
            id: 1,
            fullName: 'Irma Bastidas',
            // desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Alborada House',
            email: 'alboradahouserb@gmail.com',
            phone: '+1 (678) 541-4793',
            social: {
              facebook: 'https://www.facebook.com/profile.php?id=100086620599382',
              // twitter: 'lusia',
              // linkedin: 'https://www.linkedin.com/in/carmela-moreno-1a7392148/',
              instagram: 'https://www.instagram.com/alboradahouse/',
              // website: 'https://lusia.manuel.com'
            },
            ratingsCount: 6,
            ratingsValue: 480,
            image: 'assets/images/agents/irma.jpg' 
        },
        { 
            id: 2,
            fullName: 'Hector Rodriguez',
            // desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
            organization: 'Alborada House',
            email: 'alboradahouserb@gmail.com',
            phone: '+1 (678) 541-4793',
            social: {
              facebook: 'https://www.facebook.com/profile.php?id=100086620599382',
              // twitter: '',
              // linkedin: '',
              instagram: 'https://www.instagram.com/alboradahouse/',
              // website: 'https://andy.warhol.com'
            },
            ratingsCount: 4,
            ratingsValue: 400,
            image: 'assets/images/agents/hector.jpg' 
        },        
        // { 
        //     id: 3,
        //     fullName: 'Tereza Stiles',
        //     // desc: 'Phasellus sed metus leo. Donec laoreet, lacus ut suscipit convallis, erat enim eleifend nulla, at sagittis enim urna et lacus.',            
        //     organization: 'Mi Hogar En Atlanta',
        //     email: 'mihogarenatlanta@gmail.com ',
        //     phone: '(214) 617-2614',
        //     social: {
        //       facebook: '',
        //       twitter: '',
        //       linkedin: '',
        //       instagram: '',
        //       // website: 'https://tereza.stiles.com'
        //     },
        //     ratingsCount: 4,
        //     ratingsValue: 380,
        //     image: 'assets/images/agents/a-3.jpg' 
        // }
    ];
  }



  public getClients(){
    return [  
        { name: 'aloha', image: 'assets/images/clients/aloha.png' },
        { name: 'dream', image: 'assets/images/clients/dream.png' },  
        { name: 'congrats', image: 'assets/images/clients/congrats.png' },
        { name: 'best', image: 'assets/images/clients/best.png' },
        { name: 'original', image: 'assets/images/clients/original.png' },
        { name: 'retro', image: 'assets/images/clients/retro.png' },
        { name: 'king', image: 'assets/images/clients/king.png' },
        { name: 'love', image: 'assets/images/clients/love.png' },
        { name: 'the', image: 'assets/images/clients/the.png' },
        { name: 'easter', image: 'assets/images/clients/easter.png' },
        { name: 'with', image: 'assets/images/clients/with.png' },
        { name: 'special', image: 'assets/images/clients/special.png' },
        { name: 'bravo', image: 'assets/images/clients/bravo.png' }
    ];
  }


}
