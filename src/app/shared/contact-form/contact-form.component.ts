import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  contactForm: FormGroup;

  constructor(private formBuilder:FormBuilder, private emailService:EmailService) { 
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name:[null, [Validators.required]],
      email:[null, [Validators.required]],
      tel:[null, [Validators.required]],
      message:[null, [Validators.required]]
    });
  }
  
  sendEmail(){
    let name = this.contactForm.value.name;
    let email = this.contactForm.value.email;
    let tel = this.contactForm.value.tel;
    let message = this.contactForm.value.message;
    let req = {
      name:name,
      email:email,
      tel:tel,
      message:message
    }
    console.log(name, this.contactForm.value.message);
    this.emailService.sendMessage(req).subscribe(data => {
      
      console.log(data);
    })
  }

}
