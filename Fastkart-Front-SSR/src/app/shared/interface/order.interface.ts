import { RePayment } from './../action/order.action';
import { PaginateModel } from "./core.interface";
import { Coupon } from "./coupon.interface";
import { OrderStatus } from "./order-status.interface";
import { Product } from "./product.interface";
import { Stores } from "./store.interface";
import { User, UserAddress } from "./user.interface";
import { TransactionsData } from "./wallet.interface";

export interface OrderModel extends PaginateModel {
    data: Order[];
}

export interface Order {
    find(arg0: (order: any) => boolean): unknown;
    id: number;
    order_id: string;
    order_number: number;
    amount: number;
    store_id: number;
    store: Stores;
    consumer_id: number;
    consumer: User;
    consumer_name: string;
    products: Product[];
    coupon_id: number;
    coupon: Coupon;
    coupon_total_discount: number;
    billing_address_id: number;
    billing_address: UserAddress;
    shipping_address_id: number;
    shipping_address: UserAddress;
    shipping_total: number;
    delivery_interval: string;
    order_status_id: number;
    order_status: OrderStatus;
    parent_id: number;
    payment_method: string;
    payment_mode: string;
    payment_status: string;
    delivery_description: string;
    order_payment_status: string;
    sub_orders: Order[];
    tax_total: number;
    total: number;
    sub_total_amount: number;
    points_amount: number;
    wallet_balance: number;
    transactions: TransactionsData[];
    invoice_url: string;
    status: boolean;
    created_by_id: number;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrderCheckout {
    total: CheckoutTotal;
}

export interface CheckoutTotal {
    convert_point_amount: number;
    convert_wallet_balance: number;
    coupon_total_discount: number;
    points: number;
    points_amount: number;
    shipping_total: number;
    sub_total: number;
    tax_total: number;
    total: number;
    wallet_balance: number;
}

export interface CheckoutPayload {
    consumer_id: number;
    products: OrderProduct[];
    shipping_address_id: number;
    billing_address_id: number;
    coupon?: string;
    points_amount?: boolean;
    wallet_balance?: boolean;
    delivery_description?: string;
    delivery_interval?: string;
    payment_method?: string;
}


export interface OrderProduct {
    product_id: number;
    variation_id: number | null | String;
    quantity: number;
}

export interface PlaceOrder {
    is_redirect: boolean;
    order_number: string;
    transaction_id: string;
    url: string;
}

export interface RePaymentPayload {
    order_number: number,
    payment_method: string
}


export interface getvieewwwOrders {
    id: string;
    order_group_id: string;
    shop_id: string;
    deliveryman_id: string | null;
    user_id: string;
    guest_user_id: string | null;
    location_id: string | null;
    delivery_status: string;
    payment_status: string;
    applied_coupon_code: string | null;
    coupon_discount_amount: string;
    admin_earning_percentage: string;
    total_admin_earnings: string;
    total_vendor_earnings: string;
    logistic_id: string | null;
    logistic_name: string | null;
    pickup_or_delivery: string;
    shipping_delivery_type: string;
    scheduled_delivery_info: string | null;
    pickup_hub_id: string | null;
    shipping_cost: string;
    tips_amount: string;
    reward_points: string;
    created_at: string | null;
    updated_at: string | null;
    note: string | null;
    productslist: any[];
  }


//   export interface Trackinglist {
//     id: number;
//     order_code: number;
//     date: number | null | String;
//     status_info: String;
// }

  
//   export interface Product {
//     id: string;
//     shop_id: string;
//     added_by: string;
//     name: string;
//     slug: string;
//     brand_id: string | null;
//     unit_id: string;
//     thumbnail_image: string;
//     gallery_images: string | null;
//     product_tags: string | null;
//     short_description: string;
//     description: string;
//     price: string;
//     min_price: string;
//     max_price: string;
//     discount_value: string;
//     discount_type: string;
//     discount_start_date: string;
//     discount_end_date: string;
//     sell_target: string;
//     stock_qty: string;
//     is_published: string;
//     is_featured: string;
//     min_purchase_qty: string;
//     max_purchase_qty: string;
//     min_stock_qty: string | null;
//     has_variation: string;
//     has_warranty: string;
//     total_sale_count: string;
//     standard_delivery_hours: string;
//     express_delivery_hours: string;
//     size_guide: string | null;
//     meta_title: string | null;
//     meta_description: string | null;
//     meta_img: string | null;
//     reward_points: string;
//     created_at: string;
//     updated_at: string;
//     deleted_at: string | null;
//     vedio_link: string | null;
//     created_by: string | null;
//     updated_by: string | null;
//     is_import: string;
//   }
  