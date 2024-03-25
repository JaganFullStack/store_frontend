import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Menu } from '../../../interface/menu.interface';
import { ProductState } from '../../../../shared/state/product.state';
import { Product, ProductModel } from '../../../../shared/interface/product.interface';
import { BlogState } from '../../../../shared/state/blog.state';
import { Blog, BlogModel } from '../../../../shared/interface/blog.interface';
import * as data from '../../../../shared/data/menu'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PleaseLoginModalComponent } from '../please-login-modal/please-login-modal.component';
import { getStringDataFromLocalStorage } from 'src/app/utilities/helper';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
   userToken = getStringDataFromLocalStorage("user_token");
   userId = getStringDataFromLocalStorage("user_id");

  @Select(ProductState.dealProducts) product$: Observable<Product[]>;
  @Select(BlogState.blog) blog$: Observable<BlogModel>;

  public menu: Menu[] = data.menu;
  public products: Product[];
  public blogs: Blog[];
  public tracking: Blog[];


  constructor(private modalService: NgbModal, private router: Router){
    this.product$.subscribe(product => {
      this.products = product.slice(0, 2);
    })

    this.blog$.subscribe(blog =>{
      this.blogs = blog.data.slice(0,2)
    })
  }


  ngOnInit(){
    this.isUserLoggedIn();


  }
  toggle(menu: Menu){

    console.log("toggle togfgleeeee",menu.title)
    if(!menu.active){
      this.menu.forEach(item => {
        if(this.menu.includes(menu)){
          item.active = false;
        }
      })
    }
    menu.active = !menu.active;
  }

  handleMenuClick() {
    if (!this.isUserLoggedIn()) {
      this.openModal();
    } 
  }
  
  isUserLoggedIn(): any {
    const userToken = getStringDataFromLocalStorage("user_token");
    const userId = getStringDataFromLocalStorage("user_id");
    return !!userId && userToken; 
  }
  
  openModal() {
    const modalRef = this.modalService.open(PleaseLoginModalComponent, { centered: true });
    modalRef.componentInstance.closeModalEvent.subscribe(() => {
      modalRef.close();
    });
  }
  



}
