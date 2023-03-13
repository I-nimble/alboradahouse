import { FmlsService } from 'src/app/shared/services/fmls.service';
import { Pagination, Property } from "../../app.models";
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  public resultsVisible = false
  public properties: Property[];
  public property: Property;
  public byzip: any;
  public udata: any
  public pagination:Pagination = new Pagination(1, 5, null, 2, 0, 0); 
  public sort: string
  public count: number = 4;
  public searchFields: any;
  public message: string;
  public searchBar: string;
              
  constructor(public fmls:FmlsService, public appService:AppService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    document.addEventListener('click', this.onClick.bind(this));
  }
  searcher(){
    // console.log(this.searchBar)
    this.getProperties(this.searchBar, 180, 1)
  }
  onClick(event): void {
    // check if click event occurred inside the content div
    if (this.resultsVisible && !this.elementRef.nativeElement.contains(event.target)) {
      this.resultsVisible = false;
    }
    if (!this.resultsVisible && this.elementRef.nativeElement.contains(event.target)) {
      this.resultsVisible = true;
    }
  }
  focusSearch(){

  }
  public async getProperties(sort, limit2, offset2){
    if(sort === 'Ordenar por defecto' || sort ===  'Sort by default'){
      // this.fmls.limit2 = this.fmls.limit2
      // this.fmls.offset2 = this.fmls.offset2 + 12
      let data = await this.fmls.getDataProperties2(limit2, offset2)
      this.fmls.cleanData(data.bundle)
    }else if(sort){
      this.fmls.limit2 = 12
      if(isNaN(sort)){
        let data = await this.fmls.getByString(limit2, offset2, sort)
        console.log(data.total)
        this.udata = this.fmls.cleanDataSearcher(data.bundle)
        const cityName = this.searchBar
        const capitalize = cityName.charAt(0).toUpperCase() + cityName.slice(1)
        this.searchFields = {city:{id: 1, name: capitalize}}
      }else{
        let data = await this.fmls.getByZip(limit2, offset2, sort)
        console.log(data.total)
        this.searchFields = {zipCode: sort}
        this.udata = this.fmls.cleanDataSearcher(data.bundle)
      }
      
    }
      let result = await this.newfilterData(this.udata); 
      // console.log(this.properties)
      if(result.data.length == 0){
        this.properties = undefined;
        this.pagination = new Pagination(1, this.count, null, 3, 0, 0);  
        this.message = 'Sin Resultados';
        this.resultsVisible = true
        return false;
      }
      // this.byzip = this.udata
      this.properties = this.udata; 
      this.pagination = result.pagination;
      this.message = null;
      this.resultsVisible = true
  }
  public newfilterData(data){
    
    console.log(this.searchFields)

    return this.appService.newfilterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }
}
