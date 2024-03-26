import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '../../../../../../shared/interface/core.interface';
import { Select } from '@ngxs/store';
import { CategoryState } from 'src/app/shared/state/category.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-collection-filter',
  templateUrl: './collection-filter.component.html',
  styleUrls: ['./collection-filter.component.scss']
})
export class CollectionFilterComponent implements OnChanges {
  categoryList:Array<any>=[];
  @Input() filter: Params;
  public filters: any[];

  @Select(CategoryState.category) category$: Observable<any>;

  public filtersObj: { [key: string]: string[] } = {
    category: [],
    tag: [],
    rating: [],
    price: [],
    attribute: []
  };

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnChanges() {
    this.filtersObj = {
      category: this.splitFilter('category'),
      tag: this.splitFilter('tag'),
      rating: this.splitFilter('rating'),
      price: this.splitFilter('price'),
      attribute: this.splitFilter('attribute')
    };

    // this.filters = this.mergeFilters();
    this.mergeFilters();
  }

  remove(tag: string) {
    Object.keys(this.filtersObj).forEach((key) => {
      this.filtersObj[key] = this.filtersObj[key].filter((val: string) => {
        if (key === 'rating') {
          return val !== tag.replace(/^rating /, '');
        }
        if(key === 'category'){
           const data=this.categoryList.find((e:any)=>e.name == tag);
          return val !== data.id;
        }
        return val !== tag;
      });
    });

    this.mergeFilters();

    const params: Params = {};
    Object.keys(this.filtersObj).forEach((key) => {
      params[key] = this.filtersObj[key].length ? this.filtersObj[key].join(',') : null;
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  clear() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: null,
      skipLocationChange: false
    });
  }

  private splitFilter(filterKey: keyof Params): string[] {
    return this.filter && this.filter[filterKey] ? this.filter[filterKey].split(',') : [];
  }

  private mergeFilters() {
    let categoryData: Array<any> = [];

    this.category$.subscribe((category: any) => {
      this.categoryList=category.data;
      this.filtersObj['category'].map((e: any) => {
        let data = category.data.find((c: any) => c.id === e);
        if (data) {
          categoryData.push(data.name);
        }
      });
    });

    // this.filters =[
    //   ...this.filtersObj['tag'],
    //   ...this.filtersObj['rating'].map(val => val.startsWith('rating ') ? val : `rating ${val}`),
    //   ...this.filtersObj['price'],
    //   ...this.filtersObj['attribute']
    // ];
    this.filters = categoryData;

    return;
  }
}
