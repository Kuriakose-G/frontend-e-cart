import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  showPaypalStatus: boolean = false

  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean = false

  paymentStatus: boolean = false
  offerClicked: boolean = false
  discountClicks: boolean = false

  totalprice = 0;
  allCart: any = []
  cartCounts: string = ''
  username: string = ''
  houseno: string = ''
  street: string = ''
  state: string = ''
  phoneno: string = ''

  constructor(private api: ApiService, private checkFB: FormBuilder) { }

  checkForm = this.checkFB.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    houseNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    streetName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    state: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  })

  ngOnInit(): void {
    this.api.getcart().subscribe((result: any) => {
      console.log(result);
      this.api.cartCount()
      this.allCart = result
      this.initConfig();
      this.getcartTotal()
    }, (result: any) => {
      console.log(result.error);
    })
  }

  removecart(id: any) {
    this.api.deleteCart(id).subscribe((result: any) => {
      this.allCart = result
      this.api.cartCount()
    }, (result: any) => {
      alert(result.error)
    })
  }

  //get cart total
  getcartTotal() {
    let total = 0
    this.allCart.forEach((result: any) => {
      total += result.grandTotal
      this.totalprice = Math.ceil(total)
    });
  }

  incrementCart(id: any) {
    this.api.incrementCartCount(id).subscribe((result: any) => {
      this.allCart = result
      this.getcartTotal()
    }, (result: any) => {
      alert(result.error)
    })
  }

  decrementCart(id: any) {
    this.api.decrementCartItems(id).subscribe((result: any) => {
      this.allCart = result
      this.getcartTotal()
      this.cartCounts
    }, (result: any) => {
      alert(result.error)
    })
  }

  submitPay() {
    if (this.checkForm.valid) {
      this.username = this.checkForm.value.name || ''
      this.houseno = this.checkForm.value.houseNumber || ''
      this.street = this.checkForm.value.streetName || ''
      this.state = this.checkForm.value.state || ''
      this.phoneno = this.checkForm.value.phoneNumber || ''

      this.paymentStatus = true
    }
    else {
      alert('Invalid Form')
    }
  }

  offerClick() {
    this.offerClicked = true
    this.discountClicks = true
  }

  discount(value: any) {
    this.totalprice = this.totalprice * (100 - value) / 100
    this.offerClicked = false

  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  paypalPay() {
    this.showPaypalStatus=true
  }

  modalClose(){
    this.checkForm.reset()
    this.showPaypalStatus=false
    this.showSuccess=false
    this.paymentStatus=false
  }

}
