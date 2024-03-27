import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Action, Selector, State, StateContext, Select } from "@ngxs/store";
import { Observable, tap } from "rxjs";
import {
  GetProducts, GetStoreProducts,
  GetRelatedProducts, GetProductBySlug, GetDealProducts, SearchProducts
} from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { ThemeOptionService } from "../services/theme-option.service";
import { mockResponseData } from "src/app/utilities/helper";

export class ProductStateModel {
  product = {
    data: [],
    total: 0
  }
  selectedProduct: Product | null;
  categoryProducts: Product[] | [];
  relatedProducts: Product[] | [];
  storeProducts: Product[] | [];
  dealProducts: Product[] | [];
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    categoryProducts: [],
    relatedProducts: [],
    storeProducts: [],
    dealProducts: []
  },
})
@Injectable()
export class ProductState {

  @Select(ProductState.product) products$: Observable<any>;

  constructor(private store: Store, private router: Router,
    private productService: ProductService,
    private themeOptionService: ThemeOptionService) { }

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static relatedProducts(state: ProductStateModel) {
    return state.relatedProducts;
  }

  @Selector()
  static storeProducts(state: ProductStateModel) {
    return state.storeProducts;
  }

  @Selector()
  static dealProducts(state: ProductStateModel) {
    return state.dealProducts;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    this.productService.skeletonLoader = true;
    // Note :- You must need to call api for filter and pagination as of now we are using json data so currently get all data from json 
    //          you must need apply this logic on server side
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: any) => {

          let products = result.data || [];

          ctx.patchState({
            product: {
              data: products,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.productService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(SearchProducts)
  searchProduct(ctx: StateContext<ProductStateModel>, action: SearchProducts) {
    this.productService.skeletonLoader = true;

    if (action.payload?.search && (action.payload?.search != '')) {
      return this.productService.searchProducts(action.payload).pipe(
        tap({
          next: (result: any) => {

            ctx.patchState({
              product: {
                data: result?.data,
                total: result?.total ? result?.total : result.data?.length
              }
            });
          },
          complete: () => {
            this.productService.skeletonLoader = false;
          },
          error: err => {
            const messageObject = mockResponseData(err.error.messageobject);
            console.log(messageObject?.message);
            throw new Error(err?.error?.message);
          }
        })
      );
    } else {
      // return this.store.dispatch(new GetProducts({}));
      return ;
    }

  }

  @Action(GetRelatedProducts)
  getRelatedProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    this.themeOptionService.preloader = true;
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: any) => {
          const state = ctx.getState();
          const products = result.data.filter((product: any) =>
            action?.payload?.['ids']?.split(',')?.map((id: number) => Number(id)).includes(product.id) ||
            (product?.categories?.length && product?.categories?.map((category: any) => category.id).includes(Number(action?.payload?.['category_ids'])))
          );
          ctx.patchState({
            ...state,
            relatedProducts: products
          });
        },
        complete: () => {
          this.themeOptionService.preloader = false;
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          // alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetStoreProducts)
  getStoreProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: any) => {
          const state = ctx.getState();
          const products = result.data.filter((product: any) =>
            action?.payload?.['store_ids']?.split(',')?.map((id: number) => Number(id)).includes(product.store_id));
          ctx.patchState({
            ...state,
            storeProducts: products
          });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          // alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetProductBySlug)
  getProductBySlug(ctx: StateContext<ProductStateModel>, { filterString }: any) {

    this.productService.skeletonLoader = true;

    return this.productService.getProductByCategoryId(filterString).pipe(
      tap({
        next: results => {
          ctx.patchState({
            product: {
              data: (results?.data || (results?.data.length > 0)) ? results.data : [],
              total: results?.total ? results?.total : results.data?.length,
            }
          });
        },
        complete: () => {
          // this.themeOptionService.preloader = false;
          this.productService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetDealProducts)
  getDealProducts(ctx: StateContext<ProductStateModel>, action: GetDealProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: any) => {
          const state = ctx.getState();
          const products = result.data.filter((product: any) =>
            action?.payload?.['ids']?.split(',')?.map((id: number) => Number(id)).includes(product.id));
          ctx.patchState({
            ...state,
            dealProducts: products.length ? products : result?.data?.reverse()?.slice(0, 2)
          });
        },
        error: err => {
          const messageObject = mockResponseData(err.messageobject);
          // alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }
}
