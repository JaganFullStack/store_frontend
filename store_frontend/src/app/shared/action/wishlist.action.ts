import { Params } from "../interface/core.interface";

export class GetWishlist {
  static readonly type = "[Wishlist] Get";
}

export class AddOrRemoveWishlist {
  static readonly type = "[Wishlist] post";
  constructor(public payload: any) {}
}

export class DeleteWishlist {
  static readonly type = "[Wishlist] delete";
  constructor(public payload: any) {}
}
