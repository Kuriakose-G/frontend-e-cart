import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit{

  allWishlist:any=[]

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.getwishlist().subscribe((result:any)=>{
      console.log(result);
      this.allWishlist=result
    },(result:any)=>{
      console.log(result.error);  
    })
  }

  // to remove product from wishlist
  deletewishlist(id:any){
    this.api.deletewishlist(id).subscribe((result:any)=>{
      console.log(result);
      this.allWishlist=result      
    })
  }

  addtocart(product:any){
    Object.assign(product,{quantity:1})
    this.api.addtocart(product).subscribe((result:any)=>{
      this.api.cartCount()
      this.deletewishlist(product)
      alert(result)
    },(result:any)=>{
      alert(result.error)
    })
    
  }
}
