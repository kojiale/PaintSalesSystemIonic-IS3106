import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  cardNum: string;
  expiryDate: Date;
  cardCode: string;
  showProgressBar: boolean;

  constructor(private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private transactionService : TransactionService
  ) {
    this.expiryDate = new Date();
    this.showProgressBar = false;
  }

  ngOnInit() 
  {
  }

  ionViewWillEnter() 
  {
  }

  create(createNewPaymentForm: NgForm) {
    if (createNewPaymentForm.valid) {
      if (this.expiryDate > new Date()) {
        this.showProgressBar = true;
        console.log("to persist the shopping cart");
        this.transactionService.createNewTransaction().subscribe(
          response => {
            createNewPaymentForm.reset();
            this.handleButtonClick();
            this.cartService.clearCart();
            console.log("success");
            this.router.navigate(['/viewCart']);
          },
          error => {
            this.showMessage(error);
            console.log("failure");
          }
        );
      }
      else {
        this.showMessage("Your card has expired.");
      }
    }
    else {
      if (!this.cardNum) {
        this.showMessage("Card number is required.");
      }
      else if (!this.cardCode) {
        this.showMessage("Card code is required.");
      }
      else if(this.cardCode.length != 3)
      {
        this.showMessage("Card code must be three digits.");
      }
      else if(this.cardNum.length != 16)
      {
        this.showMessage("Card number must be 16 digits.");
      }
    }
  }


  async handleButtonClick() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your purchase is successful',
      buttons: ['OK']
    });

    await alert.present();
  }

  get convert(): string {
    return this.expiryDate.toISOString();
  }

  set convert(value: string) {
    this.expiryDate = new Date(value);
  }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      message: message
    });

    await toast.present();
  }

}
