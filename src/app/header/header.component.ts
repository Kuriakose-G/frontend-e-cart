import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  cartCounts:string=''

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.cartitemcount.subscribe((data:any)=>{
      console.log(data);  
      this.cartCounts=data   
    })
  }

  search(event:any){
    console.log(event.target.value);
    this.api.searchTerm.next(event.target.value)
    // to assign new value to behaviour subject uses next() method
  }
}
