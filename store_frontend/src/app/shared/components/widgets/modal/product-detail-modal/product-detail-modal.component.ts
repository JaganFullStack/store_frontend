import { Component, ViewChild, TemplateRef, Input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Product, Variation } from '../../../../interface/product.interface';
import { Cart, CartAddOrUpdate } from '../../../../interface/cart.interface';
import { AddToCart, DeleteCart } from '../../../../action/cart.action';
import { CartState } from '../../../../state/cart.state';
import * as data from  '../../../../../shared/data/owl-carousel';
import { environment } from 'src/environments/environment';
import { convertStringToNumber, getStringDataFromLocalStorage } from 'src/app/utilities/helper';
@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})
export class ProductDetailModalComponent {
  cartItems:Array<any>=[];
  @ViewChild("productDetailModal", { static: false }) productDetailModal: TemplateRef<any>;

  @Input() product: any;

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;

  public closeResult: string;
  public modalOpen: boolean = false;

  public cartItem: Cart | null;
  public productQty: number = 1;
  public selectedVariation: Variation | null;

  public activeSlide: string = '0';
  
  public productMainThumbSlider = data.productMainThumbSlider;
  public productThumbSlider = data.productThumbSlider;

  constructor(private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store) { }
  apibaseurl:string=environment.apiBaseUrl;
  ApiImageurl = environment.backendBaseImageUrl;

  ngOnInit() {
    this.cartItem$.subscribe(items => {
      this.cartItems=items;
      this.cartItem = items.find(item => item.product.id == this.product.id)!;
    });
  }

  async openModal() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      this.modalOpen = true;
      this.modalService.open(this.productDetailModal, {
        ariaLabelledBy: 'Product-Detail-Modal',
        centered: true,
        windowClass: 'theme-modal view-modal modal-lg'
      }).result.then((result) => {
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  selectVariation(variation: Variation) {
    this.selectedVariation = variation;
  }

  updateQuantity(qty: number) {
    if(1 > this.productQty + (qty)) return;
    this.productQty = this.productQty + (qty);
    this.checkStockAvailable();
  }

  checkStockAvailable() {
    if(this.selectedVariation) {
      this.selectedVariation['stock_status'] = this.selectedVariation?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    } else {
      this.product['stock_status']  = this.product?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    }
  }


  addCart(product: any) {

    const userId = getStringDataFromLocalStorage("user_id");

    let responseObject = {
      "user_id": userId,
      "product_variation_id": product.variations.id,
      "product_id": product.id,
      "qty": 0
    };

    const itemFound = this.cartItems.find((item: any) => item.product_id === product.id);

    if (itemFound) {
      responseObject.qty = convertStringToNumber(itemFound?.qty) + 1;
    } else {
      responseObject.qty = 1;
    }

    this.store.dispatch(new AddToCart(responseObject));
  };

  subractItemCount(product: any) {

    const userId = getStringDataFromLocalStorage("user_id");

    let requestObject = {
      "user_id": userId,
      "product_variation_id": product.variations.id,
      "product_id": product.id,
      "qty": 0
    };
    const itemFound = this.cartItems.find((item: any) => item.product_id === product.id);
    const formattedQty = convertStringToNumber(itemFound.qty);
    if ((formattedQty - 1) === 0) {
      const object = {
        id: itemFound.id
      };

      this.store.dispatch(new DeleteCart(object));
    } else {
      requestObject.qty = formattedQty - 1;

      this.store.dispatch(new AddToCart(requestObject));
    }
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
}
