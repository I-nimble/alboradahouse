import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public faqs = [
    { 
      question: 'FAQ.Q1', 
      status: 'Question about selling', 
      answer: 'FAQ.A1' 
    }
    // ,
    // { 
    //   question: 'FAQ.Q2', 
    //   status: 'Agents FAQs', 
    //   answer: 'FAQ.A2' 
    // },
    // { 
    //   question: 'FAQ.Q3', 
    //   status: 'Question about renting', 
    //   answer: 'FAQ.A3' 
    // },
    // { 
    //   question: 'FAQ.Q4', 
    //   status: 'Question about selling', 
    //   answer: 'FAQ.A4' 
    // },
    // { 
    //   question: 'FAQ.Q5', 
    //   status: 'Question about renting', 
    //   answer: 'FAQ.A5' 
    // },
    // { 
    //   question: 'FAQ.Q6', 
    //   status: 'Agents FAQs', 
    //   answer: 'FAQ.A6' 
    // },
    // { 
    //   question: 'FAQ.Q7', 
    //   status: 'Question about selling', 
    //   answer: 'FAQ.A7' 
    // },
    // { 
    //   question: 'FAQ.Q8', 
    //   status: 'Question about selling', 
    //   answer: 'FAQ.A8' 
    // },
    // { 
    //   question: 'FAQ.Q9', 
    //   status: 'Question about selling', 
    //   answer: 'FAQ.A9' 
    // }
  ]
  constructor() { }

  ngOnInit() {
  }

}
