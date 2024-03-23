import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetCategories } from "../action/category.action";
import { Category } from "../../shared/interface/category.interface";
import { CategoryService } from "../services/category.service";
import { mockResponseData } from "src/app/utilities/helper";

export class CategoryStateModel {
  category = {
    data: [] as Category[],
    total: 0
  }
}

@State<CategoryStateModel>({
  name: "category",
  defaults: {
    category: {
      data: [],
      total: 0
    }
  },
})
@Injectable()
export class CategoryState {
  
  constructor(private categoryService: CategoryService) {}

  @Selector()
  static category(state: CategoryStateModel) {
    return state.category;
  }

  @Action(GetCategories)
  getCategories(ctx: StateContext<CategoryStateModel>, action: any) {
    // return this.categoryService.getCategories(action.payload).pipe(
    return this.categoryService.getCategories(action.payload).pipe(
      tap({
        next: result => { 
          console.log("category",result.data);
          ctx.patchState({
            category: {
              data: result.data,
              total: result?.total ? result?.total : result.data.length
            }
          });
        },
        error: err => { 
          const messageObject = mockResponseData(err);
          alert(messageObject?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

}