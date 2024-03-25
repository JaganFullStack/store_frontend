import { Menu } from "../interface/menu.interface";

export const menu: Menu[] = [
  {
    id: 1,
    title: 'Home',
    type: 'link',

    path: '/home',
    // megaMenu: true,
    // megaMenuType: 'image',
    active: false,
    // children: [
    //   {
    //     title: 'Home',
    //     type: 'link',
    //     path: '/home',
       
    //   },
    // ]
  },

  {
    id: 6,
    title: 'About us',
    type: 'link',

    path: '/about-us',
    // megaMenu: true,
    // megaMenuType: 'image',
    active: false,
    // children: [
    //   {
    //     title: 'Home',
    //     type: 'link',
    //     path: '/home',
       
    //   },
    // ]
  },
 
  // {
  //   id: 2,
  //   title: 'collections',
  //   type: 'sub',
  //   megaMenu: true,
  //   megaMenuType: 'link',
  //   path: 'collections',
  //   active: false,
  //   slider: 'product',
  //   children: [
  //     {
  //       children: [
  //         {
  //           title: 'collection_layouts',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'collection_left_sidebar',
  //           path: 'collections',
  //           params: { layout: 'collection_left_sidebar' },
  //           type: 'link',
  //           label: 'hot',
  //           labelClass: 'warning-label',
  //         },
  //         {
  //           title: 'collection_right_sidebar',
  //           path: 'collections',
  //           params: { layout: 'collection_right_sidebar' },
  //           type: 'link',
  //         },
  //         {
  //           title: 'collection_no_sidebar',
  //           path: 'collections',
  //           params: { layout: 'collection_no_sidebar' },
  //           type: 'link',
  //         },
  //         {
  //           title: 'collection_3_grid',
  //           path: 'collections',
  //           params: { layout: 'collection_3_grid' },
  //           type: 'link',
  //         },
  //         {
  //           title: 'collection_4_grid',
  //           path: 'collections',
  //           params: { layout: 'collection_4_grid' },
  //           type: 'link',
  //           label: 'new',
  //         },
  //         {
  //           title: 'collection_5_grid',
  //           path: 'collections',
  //           type: 'link',
  //           params: { layout: 'collection_5_grid' },
  //         },
  //         {
  //           title: 'Collection List View',
  //           path: 'collections',
  //           params: { layout: 'collection_list_view' },
  //           type: 'link',
  //         },
  //       ],
  //     },
  //     {
  //       children: [
  //         {
  //           title: 'collection_layouts',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'category_slider',
  //           path: 'collections',
  //           params: { layout: 'collection_category_slider' },
  //           type: 'link',
  //         },
  //         {
  //           title: 'category_sidebar',
  //           path: 'collections',
  //           params: { layout: 'collection_category_sidebar' },
  //           type: 'link',
  //           label: 'new',
  //         },
  //         {
  //           title: 'category_banner',
  //           path: 'collections',
  //           params: { layout: 'collection_banner' },
  //           type: 'link',
  //         },
  //         {
  //           title: 'offcanvas_Filter',
  //           path: 'collections',
  //           params: { layout: 'collection_offcanvas_filter' },
  //           type: 'link',
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    id: 5,
    title: 'Products',
    active: false,
    type: 'link',
    path: '/collections',
    // children: [
    //   {
    //     title: 'Authentication',
    //     type: 'sub',
    //     children: [
    //       {
    //         title: 'sign_in',
    //         path: 'auth/login',
    //         type: 'link',
    //       },
 
    //     ],
    //   },
    //   {
    //     title: 'account',
    //     type: 'sub',
    //     children: [
    //       {
    //         title: 'my_dashboard',
    //         path: 'account/dashboard',
    //         type: 'link',
    //       },
    //       {
    //         title: 'my_notifications',
    //         path: 'account/notifications',
    //         type: 'link',
    //       },
    //       {
    //         title: 'my_addresses',
    //         path: 'account/addresses',
    //         type: 'link',
    //       },
         
    //     ],
    //   },
    //   {
    //     title: 'about_us',
    //     type: 'link',
    //     path: 'about-us',
    //   },
     
    //   {
    //     title: '404',
    //     type: 'link',
    //     path: '404',
    //   },
    // ],
  },
  // {
  //   id: 2,
  //   title: 'mega_menu',
  //   type: 'sub',
  //   badge: 'new',
  //   megaMenu: true,
  //   megaMenuType: 'link',
  //   path: 'collections',
  //   active: false,
  //   slider: 'banner_landscape',
  //   children: [
  //     {
  //       children: [
  //         {
  //           title: 'Popular Categories',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'Vegetables & Fruits',
  //           type: 'link',
  //           path: 'collections',
  //           params: { category: 'vegetables-fruits' }
  //         },
  //         {
  //           title: 'Biscuits & Snacks',
  //           type: 'link',
  //           label: 'new',
  //           path: 'collections',
  //           params: { category: 'biscuits-snacks' }
  //         },
  //         {
  //           title: 'Daily Breakfast',
  //           type: 'link',
  //           label: 'new',
  //           path: 'collections',
  //           params: { category: 'daily-breakfast' }
  //         },
  //         {
  //           title: 'Trendy Fashion',
  //           type: 'link',
  //           path: 'collections',
  //           params: { category: 'fashion' },
  //         },
  //         {
  //           title: 'Furniture & Decore',
  //           type: 'link',
  //           path: 'collections',
  //           params: { category: 'furniture' },
  //         },
  //       ],
  //     },
  //     {
  //       children: [
  //         {
  //           title: 'Popular Tags',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'Beauty Products',
  //           type: 'link',
  //           path: 'collections',
  //           params: { tag: 'beauty' },
  //         },
  //         {
  //           title: 'Electronics & Accessories',
  //           type: 'link',
  //           label: 'hot',
  //           labelClass: 'warning-label',
  //           path: 'collections',
  //           params: { tag: 'electronics' },
  //         },
  //         {
  //           title: 'Pet Shop',
  //           type: 'link',
  //           path: 'collections',
  //           params: { tag: 'pet-shop' },
  //         },
  //         {
  //           title: 'Milk & Dairy Products',
  //           type: 'link',
  //           path: 'collections',
  //           params: { tag: 'milk-dairy-products' },
  //         },
  //         {
  //           title: 'Sports',
  //           type: 'link',
  //           path: 'collections',
  //           params: { tag: 'sports' },
  //         },
  //       ],
  //     },
  //     {
  //       children: [
  //         {
  //           title: 'email_template',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'welcome_template',
  //           type: 'external_link',
  //           path: 'https://themes.pixelstrap.com/fastkart/email-templete/welcome.html',
  //         },
  //         {
  //           title: 'abondonment',
  //           type: 'external_link',
  //           label: 'hot',
  //           labelClass: 'warning-label',
  //           path: 'https://themes.pixelstrap.com/fastkart/email-templete/abandonment-email.html',
  //         },
  //         {
  //           title: 'offer_template',
  //           type: 'external_link',
  //           path: 'https://themes.pixelstrap.com/fastkart/email-templete/offer-template.html',
  //         },
  //         {
  //           title: 'order_success',
  //           type: 'external_link',
  //           label: 'new',
  //           path: 'https://themes.pixelstrap.com/fastkart/email-templete/order-success.html',
  //         },
  //         {
  //           title: 'reset_password',
  //           type: 'external_link',
  //           path: 'https://themes.pixelstrap.com/fastkart/email-templete/reset-password.html',
  //         },
  //       ],
  //     },
  //     {
  //       children: [
  //         {
  //           title: 'invoice_template',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'invoice_template_1',
  //           type: 'external_link',
  //           path: 'https://themes.pixelstrap.com/fastkart/invoice/invoice-1.html',
  //         },
  //         {
  //           title: 'invoice_template_2',
  //           type: 'external_link',
  //           label: 'hot',
  //           path: 'https://themes.pixelstrap.com/fastkart/invoice/invoice-2.html',
  //         },
  //         {
  //           title: 'invoice_template_3',
  //           type: 'external_link',
  //           path: 'https://themes.pixelstrap.com/fastkart/invoice/invoice-3.html',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   title: 'blog',
  //   type: 'sub',
  //   megaMenu: true,
  //   megaMenuType: 'link',
  //   slider: 'blog',
  //   active: false,
  //   children: [
  //     {
  //       children: [
  //         {
  //           title: 'blog_pages',
  //           type: 'sub',
  //         },
  //         {
  //           title: 'blog_list',
  //           type: 'link',
  //           path: 'blogs',
  //           params: { style: 'list_view', sidebar: 'left_sidebar' },
  //           label: 'new',
  //         },
  //         {
  //           title: 'grid_left_sidebar',
  //           type: 'link',
  //           label: 'hot',
  //           path: 'blogs',
  //           params: { style: 'grid_view', sidebar: 'left_sidebar' },
  //           labelClass: 'warning-label',
  //         },
  //         {
  //           title: 'grid_right_sidebar',
  //           type: 'link',
  //           path: 'blogs',
  //           params: { style: 'grid_view', sidebar: 'right_sidebar' },
  //         },
  //         {
  //           title: 'grid_no_sidebar',
  //           type: 'link',
  //           path: 'blogs',
  //           params: { style: 'grid_view', sidebar: 'no_sidebar' },
  //         },
  //         {
  //           title: 'blog_details',
  //           path: 'blog/supercharge-your-meals-incorporating-colorful-vegetables-and-fruits',
  //           type: 'link',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   title: 'pages',
  //   active: false,
  //   type: 'sub',
  //   children: [
  //     {
  //       title: 'Authentication',
  //       type: 'sub',
  //       children: [
  //         {
  //           title: 'sign_in',
  //           path: 'auth/login',
  //           type: 'link',
  //         },
  //         {
  //           title: 'sign_up',
  //           path: 'auth/register',
  //           type: 'link',
  //         },
  //         {
  //           title: 'forgot_password',
  //           path: 'auth/forgot-password',
  //           type: 'link',
  //         },
  //         {
  //           title: 'verify_otp',
  //           path: 'auth/otp',
  //           type: 'link',
  //         },
  //         {
  //           title: 'update_password',
  //           path: 'auth/update-password',
  //           type: 'link',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'account',
  //       type: 'sub',
  //       children: [
  //         {
  //           title: 'my_dashboard',
  //           path: 'account/dashboard',
  //           type: 'link',
  //         },
         
  //       ],
  //     },
  //     {
  //       title: 'about_us',
  //       type: 'link',
  //       path: 'about-us',
  //     },
    
  
  //   ],
  // },
  // {
  //   id: 6,
  //   title: 'Seller',
  //   type: 'sub',
  //   active: false,
  //   children: [
  //     {
  //       title: 'become_seller',
  //       type: 'link',
  //       path: 'seller/become-seller',
  //     },
  //     {
  //       title: 'seller_stores_basic',
  //       type: 'link',
  //       label: 'hot',
  //       path: 'seller/stores',
  //       params: { layout: 'basic_store' },
  //       labelClass: 'warning-label',
  //     },
  //     {
  //       title: 'seller_stores_classic',
  //       path: 'seller/stores',
  //       params: { layout: 'classic_store' },
  //       type: 'link',
  //     },
  //     {
  //       title: 'store_details_basic',
  //       path: 'seller/store/fruits-market',
  //       params: { layout: 'basic_store_details' },
  //       type: 'link',
  //     },
  //     {
  //       title: 'store_details_classic',
  //       path: 'seller/store/fruits-market',
  //       params: { layout: 'classic_store_details' },
  //       type: 'link',
  //     },
  //   ],
  // },

  {
    id: 5,
    title: 'Checkout',
    type: 'link',

    path: '/checkout',
    // megaMenu: true,
    // megaMenuType: 'image',
    active: false,
    // children: [
    //   {
    //     title: 'Home',
    //     type: 'link',
    //     path: '/home',
       
    //   },
    // ]
  },

  // {
  //   id: 9,
  //   title: 'Cart',
  //   active: false,
  //   type: 'link',
  //   path: 'cart',
    // children: [
    //   {
    //     title: 'Authentication',
    //     type: 'sub',
    //     children: [
    //       {
    //         title: 'sign_in',
    //         path: 'auth/login',
    //         type: 'link',
    //       },
     
    //     ],
    //   },
    //   {
    //     title: 'account',
    //     type: 'sub',
    //     children: [
         
    //       {
    //         title: 'my_points',
    //         path: 'account/point',
    //         type: 'link',
    //       },
    //       {
    //         title: 'my_orders',
    //         path: 'account/order',
    //         type: 'link',
    //       },
          
    //     ],
    //   },
     
    //   {
    //     title: 'offers',
    //     type: 'link',
    //     path: 'offer',
    //     label: 'new',
    //   },
    //   {
    //     title: 'search',
    //     type: 'link',
    //     path: 'search',
    //     label: 'hot',
    //     labelClass: 'warning-label',
    //   },

    // ],
  // },







  {
    id: 7,
    title: 'Tracking',
    active: false,
    type: 'link',
    path: 'order-tracking',

    // children: [
    //   {
    //     title: 'Authentication',
    //     type: 'sub',
    //     children: [
    //       {
    //         title: 'sign_in',
    //         path: 'auth/login',
    //         type: 'link',
    //       },
        
    //     ],
    //   },
    
    // ],
  },
];
