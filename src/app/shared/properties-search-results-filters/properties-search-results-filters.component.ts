import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FmlsService } from 'src/app/shared/services/fmls.service';

@Component({
  selector: 'app-properties-search-results-filters',
  templateUrl: './properties-search-results-filters.component.html',
  styleUrls: ['./properties-search-results-filters.component.scss']
})
export class PropertiesSearchResultsFiltersComponent implements OnInit {
  @Input() searchFields: any;
  @Output() onRemoveSearchField: EventEmitter<any> = new EventEmitter<any>();
  constructor(public fmls:FmlsService) { }

  ngOnInit() {}

  public remove(field){
    this.onRemoveSearchField.emit(field);
  }

}