import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  public contactForm: FormGroup;
  public lat: number = 33.987351;
  public lng: number = -83.988675;
  public zoom: number = 12; 
  config: { observer: boolean; slidesPerView: number; spaceBetween: number; keyboard: boolean; navigation: boolean; pagination: boolean; grabCursor: boolean; loop: boolean; preloadImages: boolean; lazy: boolean; breakpoints: { 320: { slidesPerView: number; }; 600: { slidesPerView: number; }; 960: { slidesPerView: number; }; 1280: { slidesPerView: number; }; }; centerInsufficientSlides: boolean; };
  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });     
  }

  public onContactFormSubmit(values:Object):void {
    if (this.contactForm.valid) {
      console.log(values);
    }
  }

  //   ngAfterViewInit(){
  //   this.config = {
  //     observer: true,
  //     slidesPerView: 2,
  //     spaceBetween: 50,       
  //     keyboard: false,
  //     navigation: false,
  //     pagination: false,
  //     grabCursor: true,        
  //     loop: false,
  //     preloadImages: false,
  //     lazy: true,  
  //     breakpoints: {
  //       320: {
  //         slidesPerView: 1
  //       },
  //       600: {
  //         slidesPerView: 1
  //       },
  //       960: {
  //         slidesPerView: 2
  //       },
  //       1280: {
  //         slidesPerView: 4
  //       }
  //     },
  //     centerInsufficientSlides: true
  //   }
  // }

}
