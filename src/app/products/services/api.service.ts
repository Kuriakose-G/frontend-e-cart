import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // to hold cart count
  cartitemcount= new BehaviorSubject(0)

  // to hold search value
  searchTerm=new BehaviorSubject('')

  constructor(private http:HttpClient) {
    this.cartCount()
   }

  BASE_URL='https://backend-for-ecart-patm.onrender.com'

  // get all products from mongodb
  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/allProducts`)
  }

  // to view particular product
  viewproduct(id:any){
    return this.http.get(`${this.BASE_URL}/products/viewProduct/${id}`)
  }

  // add to wishlist
  addtowishlist(id:any,title:any,price:any,image:any){
    const body={
      id,
      title,
      price,
      image
    }
    return this.http.post(`${this.BASE_URL}/products/addtowishlist`,body)
  }

  // view wishlist
  getwishlist(){
    return this.http.get(`${this.BASE_URL}/products/getwishlist`)
  }

  // to remove products from wishlist
  deletewishlist(id:any){
    return this.http.delete(`${this.BASE_URL}/products/deletewishlist/${id}`)
  }

// to add to cart
addtocart(product:any){
  const body={
    id:product.id,
    title:product.title,
    price:product.price,
    image:product.image,
    quantity:product.quantity
  }
  return this.http.post(`${this.BASE_URL}/products/addtocart`,body)
}

// view cart
getcart(){
  return this.http.get(`${this.BASE_URL}/products/getcart`)
}

//  cart count
cartCount(){
  this.getcart().subscribe((result:any)=>{
    this.cartitemcount.next(result.length)
  })
}

// delete cart items
deleteCart(id:any){
  return this.http.delete(`${this.BASE_URL}/products/deletecart/${id}`)
}

//increment cart count
incrementCartCount(id:any){
  return this.http.get(`${this.BASE_URL}/products/increment/${id}`)
} 

//decrement cart items
decrementCartItems(id:any){
  return this.http.get(`${this.BASE_URL}/products/decrement/${id}`)
}

}
