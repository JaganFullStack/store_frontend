import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetProducts, GetStoreProducts,
  GetRelatedProducts, GetProductBySlug, GetDealProducts
} from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { ThemeOptionService } from "../services/theme-option.service";
import { mockResponseData } from "src/app/utilities/helper";

export class ProductStateModel {
  product = {
    data: [] ,
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
          // if (action?.payload) {
          //   // Note:- For Internal filter purpose only, once you apply filter logic on server side then you can remove  it as per your requirement.
          //   // Note:- we have covered only few filters as demo purpose
          //   products = result.data.filter((product: any) =>
          //     (action?.payload?.['store_slug'] && product?.store?.slug == action?.payload?.['store_slug']) ||
          //     (
          //       action?.payload?.['category'] && product?.categories?.length &&
          //       product?.categories?.some((category: any) => action?.payload?.['category']?.split(',')?.includes(category.slug))
          //     )
          //   )

          //   products = products.length ? products : result.data;

          //   if (action?.payload?.['sortBy']) {
          //     if (action?.payload?.['sortBy'] === 'asc') {
          //       products = products.sort((a: any, b: any) => {
          //         if (a.id < b.id) {
          //           return -1;
          //         } else if (a.id > b.id) {
          //           return 1;
          //         }
          //         return 0;
          //       })
          //     } else if (action?.payload?.['sortBy'] === 'desc') {
          //       products = products.sort((a: any, b: any) => {
          //         if (a.id > b.id) {
          //           return -1;
          //         } else if (a.id < b.id) {
          //           return 1;
          //         }
          //         return 0;
          //       })
          //     } else if (action?.payload?.['sortBy'] === 'a-z') {
          //       products = products.sort((a: any, b: any) => {
          //         if (a.name < b.name) {
          //           return -1;
          //         } else if (a.name > b.name) {
          //           return 1;
          //         }
          //         return 0;
          //       })
          //     } else if (action?.payload?.['sortBy'] === 'z-a') {
          //       products = products.sort((a: any, b: any) => {
          //         if (a.name > b.name) {
          //           return -1;
          //         } else if (a.name < b.name) {
          //           return 1;
          //         }
          //         return 0;
          //       })
          //     } else if (action?.payload?.['sortBy'] === 'low-high') {
          //       products = products.sort((a: any, b: any) => {
          //         if (a.sale_price < b.sale_price) {
          //           return -1;
          //         } else if (a.price > b.price) {
          //           return 1;
          //         }
          //         return 0;
          //       })
          //     } else if (action?.payload?.['sortBy'] === 'high-low') {
          //       products = products.sort((a: any, b: any) => {
          //         if (a.sale_price > b.sale_price) {
          //           return -1;
          //         } else if (a.price < b.price) {
          //           return 1;
          //         }
          //         return 0;
          //       })
          //     }
          //   } else if (!action?.payload?.['ids']) {
          //     products = products.sort((a: any, b: any) => {
          //       if (a.id < b.id) {
          //         return -1;
          //       } else if (a.id > b.id) {
          //         return 1;
          //       }
          //       return 0;
          //     })
          //   }

          //   if (action?.payload?.['search']) {
          //     products = products.filter((product: any) => product.name.toLowerCase().includes(action?.payload?.['search'].toLowerCase()))
          //   }
          // }

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
    // this.themeOptionService.preloader = true;
    this.productService.skeletonLoader = true;
    console.log(filterString)
    return this.productService.getProductByCategoryId(filterString).pipe(
      tap({
        next: results => {
          console.log("results", results);
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
