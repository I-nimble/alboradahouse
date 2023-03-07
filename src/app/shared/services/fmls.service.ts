import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
@Injectable({
  providedIn: 'root'
})
export class FmlsService {

  public propertyN: any;
  public propertyNS: any;
  public dataArray = [];
  public arrayCleanData = [];
  public uniqueData = [];
  public limit: number = 120;
  public offset: number = 0;
  public limit2: number = 12;
  public offset2: number = 0;

  constructor(public httpClient: HttpClient,
              public appservice: AppService,){}


  getDataProperties(limit, offset){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit + '&offset=' + offset + '&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc').toPromise()
  }

  getDataProperties2(limit2, offset2){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit2 + '&offset=' + offset2 + '&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc').toPromise()
  }

  cleanData(data: any){
    this.uniqueData = [];
    data.forEach(element => {
      this.dataArray ['id'] = element['ListingId'];
      this.dataArray ['title'] = element['BuildingName'];
      this.dataArray ['PropertyType'] = element['PropertyType'];
      this.dataArray ['PropertyStatus'] = element['MlsStatus'];
      // this.dataArray ['status'] = element['standard']
      this.dataArray ['city'] = element['City'];
      this.dataArray ['Zipcode'] = element['PostalCode'];
      this.dataArray ['Neighborhood'] = element['CountyOrParish'];
      this.dataArray ['street'] = element['StreetName'];
      this.dataArray ['latitude'] = element['Latitude'];
      this.dataArray ['longitude'] = element['Longitude'];
      this.dataArray ['address'] = element['UnparsedAddress'];
      this.dataArray ['features'] = element['ExteriorFeatures'];
      this.dataArray ['price'] = element['FMLS_CurrentPrice'];
      this.dataArray ['rent'] = element['RentIncludes'];
      this.dataArray ['bedrooms'] = element['BedroomsTotal'];
      this.dataArray ['bathrooms'] = element['BathroomsTotalInteger'];
      this.dataArray ['garages'] = element['GarageSpaces'];
      this.dataArray ['area'] = [element['BuildingAreaTotal']];
      this.dataArray ['yearBuilt'] = element['YearBuilt'];
      this.dataArray ['addFeatures'] = [];
      if(element['ExteriorFeatures'].length != 0){
        element['ExteriorFeatures'].forEach(item =>this.dataArray['addFeatures'].push(item));
      }
      if(element['CommunityFeatures'].length != 0){
        element['CommunityFeatures'].forEach(item =>this.dataArray['addFeatures'].push(item));
      }
      if(element['AccessibilityFeatures'].length != 0){
        element['AccessibilityFeatures'].forEach(item =>this.dataArray['addFeatures'].push(item));
      }
      this.dataArray ['gallery'] = [];
      if(element['Media'] != null){
        element['Media'].forEach(item =>this.dataArray['gallery'].push(item.MediaURL))
      }else {
        this.dataArray['gallery'].push("assets/images/others/NoImageAvailable.jpg")
      }
      this.dataArray ['published'] = element['OnMarketDate'];
      this.dataArray ['lastUpdated'] = element['StatusChangeTimestamp'];
      this.dataArray ['courtesy'] = element['ListOfficeName']

      this.propertyN = new Property (this.dataArray['id'], 
                                    this.dataArray ['title'], '',
                                    this.dataArray ['PropertyType'], 
                                    this.dataArray ['PropertyStatus'], 
                                    this.dataArray ['city'], 
                                    this.dataArray ['Zipcode'], 
                                    [this.dataArray ['Neighborhood']], 
                                    [this.dataArray ['street']], 
                                    {'propertyId': this.dataArray['id'], 'lat': this.dataArray['latitude'], 'lng': this.dataArray['longitude']}, 
                                    this.dataArray ['address'], 
                                    this.dataArray ['features'], 
                                    true, 
                                    {'sale':this.dataArray ['price']}, 
                                    {'sale':this.dataArray ['price']}, 
                                    this.dataArray ['bedrooms'], 
                                    this.dataArray ['bathrooms'], 
                                    this.dataArray ['garages'],
                                    {'value': this.dataArray ['area'], 'id': 0, 'unit': "ft²"}, 
                                    this.dataArray ['yearBuilt'], 0, 0, 
                                    [{'id':this.dataArray['id'], 'name': "", 'value':this.dataArray['addFeatures']}], 
                                    this.dataArray['gallery'], 
                                    [], [], 
                                    this.dataArray ['published'], 
                                    this.dataArray ['lastUpdated'], 0, this.dataArray['courtesy'])
      this.arrayCleanData.push(this.propertyN);
      // console.log('arraycleanData')
      // console.log(this.arrayCleanData)
    });
    this.uniqueData = [...new Set(this.arrayCleanData)]
    // console.log('uniqueData')
    // console.log(this.uniqueData)
  }
  
  
  getListingKey(id){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings/'+ id + '?&access_token=af4a076f5f40a608cb449aa8603422cc')
  }

  singleFmlsData(data: any){
    this.dataArray ['id'] = data['ListingId'];
    this.dataArray ['title'] = data['BuildingName'];
    this.dataArray ['desc'] = data['PublicRemarks'];
    this.dataArray ['PropertyType'] = data['PropertyType'];
    this.dataArray ['PropertyStatus'] = data['MlsStatus'];
    this.dataArray ['city'] = data['City'];
    this.dataArray ['Zipcode'] = data['PostalCode'];
    this.dataArray ['Neighborhood'] = data['CountyOrParish'];
    this.dataArray ['street'] = data['StreetName'];
    this.dataArray ['latitude'] = data['Latitude'];
    this.dataArray ['longitude'] = data['Longitude'];
    this.dataArray ['address'] = data['UnparsedAddress'];
    this.dataArray ['features'] = data['ExteriorFeatures'];
    this.dataArray ['price'] = data['FMLS_CurrentPrice'];
    this.dataArray ['rent'] = data['RentIncludes'];
    this.dataArray ['bedrooms'] = data['BedroomsTotal'];
    this.dataArray ['bathrooms'] = data['BathroomsTotalInteger'];
    this.dataArray ['garages'] = data['GarageSpaces'];
    this.dataArray ['area'] = [data['BuildingAreaTotal']];
    this.dataArray ['yearBuilt'] = data['YearBuilt'];
    this.dataArray ['addFeatures'] = [];
    if(data['ExteriorFeatures'].length != 0){
      data['ExteriorFeatures'].forEach(item =>this.dataArray['addFeatures'].push(item));
    }
    if(data['CommunityFeatures'].length != 0){
      data['CommunityFeatures'].forEach(item =>this.dataArray['addFeatures'].push(item));
    }
    if(data['AccessibilityFeatures'].length != 0){
      data['AccessibilityFeatures'].forEach(item =>this.dataArray['addFeatures'].push(item));
    }
    this.dataArray ['gallery'] = [];
    if(data['Media'] != null){
      data['Media'].forEach(item =>this.dataArray['gallery'].push(item.MediaURL))
    }else {
      this.dataArray['gallery'].push("assets/images/others/NoImageAvailable.jpg")
    }
    this.dataArray ['published'] = data['OnMarketDate'];
    this.dataArray ['lastUpdated'] = data['StatusChangeTimestamp'];
    this.dataArray['courtesy'] = data['ListOfficeName'];

    this.propertyNS = new Property (this.dataArray['id'], 
                                    this.dataArray ['title'], this.dataArray['desc'],
                                    this.dataArray ['PropertyType'], 
                                    [this.dataArray ['PropertyStatus']], 
                                    this.dataArray ['city'], 
                                    this.dataArray ['Zipcode'], 
                                    [this.dataArray ['Neighborhood']], 
                                    [this.dataArray ['street']], 
                                    {'propertyId': this.dataArray ['id'], 'lat': this.dataArray['latitude'], 'lng': this.dataArray['longitude']}, 
                                    this.dataArray ['address'], 
                                    this.dataArray ['features'], 
                                    true, 
                                    {'sale':this.dataArray ['price']}, 
                                    {'sale':this.dataArray ['price']}, 
                                    this.dataArray ['bedrooms'], 
                                    this.dataArray ['bathrooms'], 
                                    this.dataArray ['garages'],
                                    {'value': this.dataArray ['area'], 'id': 0, 'unit': "ft²"}, 
                                    this.dataArray ['yearBuilt'], 0, 0, 
                                    [{'id':this.dataArray['id'], 'name': "", 'value':this.dataArray['addFeatures']}], 
                                    this.dataArray['gallery'], 
                                    [], [], 
                                    this.dataArray ['published'], 
                                    this.dataArray ['lastUpdated'], 0, this.dataArray['courtesy'])
  }

  getDescend(limit){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit + '&offset=0&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=FMLS_CurrentPrice&order=desc').toPromise();
  }

  getDescend2(limit2, offset2){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit2 + '&offset=' + offset2 + '&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=FMLS_CurrentPrice&order=desc').toPromise();
  }

  getAscend(limit){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit + '&offset=0&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=ListPrice&order=asc').toPromise();
  }

  getAscend2(limit2, offset2){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit2 + '&offset=' + offset2 + '&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=ListPrice&order=asc').toPromise();
  }

  getOld(limit){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit + '&offset=&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=DaysOnMarket&order=asc').toPromise();
  }

  getOld2(limit2, offset2){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit2 + '&offset=' + offset2 + '&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=DaysOnMarket&order=asc').toPromise();
  }

  getNew(limit){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit + '&offset=0&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=DaysOnMarket&order=desc').toPromise();
  }

  getNew2(limit2, offset2){
    return this.httpClient.get<any>('https://api.bridgedataoutput.com/api/v2/fmls/listings?permissionGroupID=21e09d51-f3ac-4909-b6aa-6be71af3bda0&and[0][MlsStatus][ne]=Canceled&and[1][MlsStatus][ne]=Closed&and[2][MlsStatus][ne]=Expired&and[3][MlsStatus][ne]=Withdrawn&limit=' + limit2 + '&offset=' + offset2 + '&sortBy[0]=BridgeModificationTimestamp&access_token=af4a076f5f40a608cb449aa8603422cc&sortBy=DaysOnMarket&order=desc').toPromise();
  }
}