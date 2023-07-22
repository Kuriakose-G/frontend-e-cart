import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit{

  //to hold particular product id
  productId:any

  // to hold details of particular product
  product:any={}

  constructor(private viewActivatedRoute:ActivatedRoute, private api:ApiService){}
  // Activated route is to get path parameter from route

  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data:any)=>{
      console.log(data);
      console.log(data.id);
      this.productId=data.id
      // view particular product details
      this.api.viewproduct(this.productId).subscribe((result:any)=>{
        console.log(result);
        this.product=result;
      })
    })
  }

  // add to wishlist
  addtowishlist(){
    const{id,title,price,image}=this.product
    // api call
    this.api.addtowishlist(id,title,price,image).subscribe((result:any)=>{
      alert(result)
    },(result:any)=>{
      alert(result.error)
    })  
  }

  // add to cart
  addtocart(product:any){
    Object.assign(product,{quantity:1})
    console.log(product);
    this.api.addtocart(product).subscribe((result:any)=>{
      this.api.cartCount()     
      alert(result) //add to cart
    },(result:any)=>{
      alert(result.error)
    })
  }

}
