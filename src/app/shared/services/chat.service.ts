import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(public author: string, public content: any, public question: any) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  conversation = new Subject<Message[]>();
  
  messageMap = {
    // "Hi": `Bienvenido, somos mi hogar en atlanta, le gustaria ser atendido en español or I would like to be assisted in english`,
    // "hi": "Bienvenido, somos mi hogar en atlanta, le gustaria ser atendido en español or I would like to be assisted in english",
    // "hello": "Bienvenido, somos mi hogar en atlanta, le gustaria ser atendido en español or I would like to be assisted in english",
    // "Hello": {
    //   "1": "Bienvenido, somos mi hogar en atlanta, le gustaria ser atendido en español",
    //   "2": "or I would like to be assisted in english"
    // },       
    "Hola.": {
      "Bienvenido, por favor elija su idioma. Welcome, please choose your language:": [
        "Español.",
        "English."
      ]
      
    },
    // "hola": "Bienvenido, somos mi hogar en atlanta, le gustaria ser atendido en español or I would like to be assisted in english",
    "Español.": {
      "¿Que desea hacer?": [
      "Comprar una casa.",
      "Información de contacto.",
      "Agendar una cita."
      ]
    },
    // "Espanol": "Deseo conocer como comprar una casa Le gustaria nuestra Información de contacto Deseo agendar una cita Responda comprar, contacto o cita, de acuerdo a su eleccion.",
    // "español": "Deseo conocer como comprar una casa Le gustaria nuestra Información de contacto Deseo agendar una cita Responda comprar, contacto o cita, de acuerdo a su eleccion.",
    // "espanol": "Deseo conocer como comprar una casa Le gustaria nuestra Información de contacto Deseo agendar una cita Responda comprar, contacto o cita, de acuerdo a su eleccion.",
    "English.": {
      "What you want to do?" : [
        "Buy a house.",
        "Contact information.",
        "Make an appoinment."
      ]
    },
    // "english": "I would like to buy a house I would like to contact us I would like to Make an appoinment Answer buy, contact or meeting, by your choice.",
    "Comprar una casa.": {
      "¿Que desea saber al respecto?": [
        "Documentos necesarios.",
        "Puntaje de crédito mínimo.",
        "Los taxes.",
        "Aplicar con alguien mas."
      ]
    },
    // "comprar": "Deseo saber acerca de: documentos, puntaje de credito, taxes o aplicar con alguien mas responda documentos, credito, taxes o aplicar con alguien, de acuerdo a su eleccion.",
    "Buy a house.": {
      "What do you want to know about it?": [
        "Documents required.",
        "Credit score minimum.",
        "The taxes.",
        "Apply with someone else."
      ]
    },
    // "buy": "I would like to know about: documents, credit score, taxes or apply with someone else answer documents, credit score, taxes or apply with someone else, by your choice.",
    "Documentos necesarios.": {
      "¿Con cuál desea aplicar?": [
        "Con Tax ID.",
        "Con seguro social."
      ]
    },
    // "documentos": "Puede aplicar con Tax ID o seguro social, responda Tax ID o seguro social, de acuerdo a su eleccion para saber los requerimientos de estos.",
    "Documents required.": {
      "Which one will you apply with?": [
        "With Tax ID.",
        "With Social Security."
      ]
    },
    // "documents": "You can apply with your Tax ID or your Social Security, answer Tax ID or Social Security, by your choice to know the requirements of them",
    "Con Tax ID.": {
      "Los requisitos son: identificación o pasaporte, numero de tax id, últimos dos meses de estados de cuenta, contar con el 20% de down payment." : [
        "Información acerca del 20% de down payment.",
        "Eso es todo, gracias."
      ]
    },
    "With Tax ID.": {
      "You need this requirements: ID or passport, tax ID number, last two months of your balance account and 20% of down payment. If you want information about the 20% down payment, answer 20%.": [
        "Information about the 20% down payment.",
        "That's it, thanks."
      ]
    },
    // "Tax id": "Los requisitos son: identificación o pasaporte, numero de tax id, últimos dos meses de estados de cuenta, contar con el 20% de down payment. Si Deseo Informacióna acerca del 20%, responda 20%. You need this requirements: ID or passport, tax ID number, last two months of your balance account and 20% of down payment. If you want information about the 20% down payment, answer 20%.",
    // "tax id": "Los requisitos son: identificación o pasaporte, numero de tax id, últimos dos meses de estados de cuenta, contar con el 20% de down payment. Si Deseo Informacióna acerca del 20%, responda 20%. You need this requirements: ID or passport, tax ID number, last two months of your balance account and 20% of down payment. If you want information about the 20% down payment, answer 20%.",
    "Información acerca del 20% de down payment.": {
      "El monto de la inicial sera el 20% del valor de la casa." : [
        "Eso es todo, gracias."
      ]
    },
    "Information about the 20% down payment.": {
      "It will be the 20% of the house value." : [
        "That's it, thanks."
      ]
    },
    "Con seguro social.": {
      "Los requisitos son: licencia, número de seguro social, green card o permiso de trabajo, el último mes de talones de pago, últimos dos años de taxes, últimos tres meses de estados de cuenta.": [
        "Información acerca del down payment.",
        "Eso es todo, gracias."
      ]
    },
    "With Social Security.": {
      "You need this requirements: license, Social Security number, green card or work permission, last month of pay stubs, last two year of taxes and the last three months of your balance account. If you want to know about the down payment answer down payment.": [
        "Information about the down payment.",
        "That's it, thanks."
    ]},
    "Información acerca del down payment.": {
      "El monto de down payment va de 3 a 5% del valor de la casa" : [
        "Eso es todo, gracias."
      ]
    },
    "Information about the down payment.": {
      "It will be from 3 to 5% of the house value": [
        "That's it, thanks."
    ]},
    "Puntaje de crédito mínimo": {
      "Necesita un mínimo de 640 puntos." : [
        "Eso es todo, gracias."
      ]
    },
    "Credit score minimum": {
      "You need at least 640 points.": [
        "That's it, thanks."
      ]
    },
    // "credit score": "You need at least 640 points.",
    // "Credit score": "You need at least 640 points.",
    "Los taxes": {
      "Contamos con un equipo de contadores que puede ayudarle a realizar sus taxes." : [
        "Eso es todo, gracias."
      ]
    },
    "The taxes": {
      "We have a accountants team that will help with your taxes." : [
        "That's it, thanks."
      ]
    },
    "Aplicar con alguien mas": {
      "Si se puede, mientras ambos tengan sus requisitos en regla es posible." : [
        "Eso es todo, gracias."
      ]
    },
    // "aplicar con alguien mas": "Si se puede, mientras ambos tengan sus requisitos en regla es posible.",
    "Apply with someone else": {
      "You can do it only if both have all the requirements." : [
        "That's it, thanks."
      ]
    },
    // "apply with someone else": "You can do it only if both have all the requirements",    
    "Información de contacto.": {
      "Nos puede contactar directamente a nuestro correo o a nuestro numero telefónico:" : [
        "mihogarenatlanta@gmail.com",
        "+1 (678) 744-8007"
      ]
    },
    // "contacto": "Nos puede contactar directamente a nuestro correo o a nuestro numero telefónico: mihogarenatlanta@gmail.com & +1 (678) 744-8007",
    "Contact information.": {
      "You can contact us to our email or our phone number:" : [
        "mihogarenatlanta@gmail.com",
        "+1 (678) 744-8007"
      ]
    },
    // "contact": "You can contact us to our email or our phone number: mihogarenatlanta@gmail.com & +1 (678) 744-8007",
    "Agendar una cita.": {
      "Para agendar una cita debe de contactarnos a traves de nuestro numero telefónico:" : [
        "+1 (678) 744-8007",
        "Eso es todo, gracias."
      ]
    },
    // "cita": "Para agendar una cita debe de contactarnos a traves de nuestro numero telefónico: +1 (678) 744-8007",
    "Make an appoinment.": {
      "To make an appoinment you can contact us to our phone number:" : [
        "+1 (678) 744-8007",
        "That's it, thanks."
      ]
    },
    // "meeting": "To Make an appoinment you can contact us to our phone number: +1 (678) 744-8007",
    // "Who are you": "I am Mi hogar En Atlanta's ChatBot",
    // "Quien eres": "Soy el ChatBot de Mi Hogar En Atlanta",
    "Eso es todo, gracias.": {
      "Para mas Información contactarnos a traves de nuestro correo o a nuestro numero telefónico:": [
        "mihogarenatlanta@gmail.com",
        "+1 (678) 744-8007"
      ]
    },
    "That's it, thanks.":{ 
      "For more information contact us to our email or our phone number:": [
        "mihogarenatlanta@gmail.com",
        "+1 (678) 744-8007"
      ]
    }
    // "yes": "This is our email and our telephone number: mihogarenatlanta@gmail.com & +1 (678) 744-8007. Please contact us and We will answer all your questions",
    // "no": "Thanks for coming, have a nice experience in our website",
  }

  getBotAnswer(msg: any) {
    const userMessage = new Message('user', '', msg);
    console.log(userMessage);  
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg), '');
    console.log(botMessage);
    
    setTimeout(()=>{
      this.conversation.next([botMessage]);
    }, 1500);
  }

  getBotMessage(question: any){
    let answer = this.messageMap[question];
    return answer || this.messageMap['default'];
  }

}
