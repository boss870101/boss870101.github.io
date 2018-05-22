import Login from "@/Login";
import Index from "@/Index";
import Home from "@/views/Home";
import Security from "@/Security";

import Pages from "@/views/pages/Pages";
import PagesScheduleManagement from "@/views/pages/ScheduleManagement";

import Notification from "@/views/notification/Notification";
import NotificationAnnouncements from "@/views/notification/Announcements";
import NotificationNotifies from "@/views/notification/Notifies";
import NotificationWikis from "@/views/notification/Wikis";
import NotificationPublicities from "@/views/notification/Publicities";
import NotificationTags from "@/views/notification/Tags";
import NotificationClassifies from "@/views/notification/Classifies";
import NotificationSetups from "@/views/notification/Setups";

import NotificationEditNotify from "@/views/notification/editNotify/EditNotify";
import NotificationEditNotifyReceivers from "@/views/notification/editNotify/EditNotifyReceivers";
import NotificationEditNotifySend from "@/views/notification/editNotify/EditNotifySend";

import NotificationEditPublicity from "@/views/notification/editPublicity/EditPublicity";
import NotificationEditPublicityReceivers from "@/views/notification/editPublicity/EditPublicityReceivers";
import NotificationEditPublicitySend from "@/views/notification/editPublicity/EditPublicitySend";

import NotificationEditWiki from "@/views/notification/editWiki/EditWiki";
import NotificationEditWikiReceivers from "@/views/notification/editWiki/EditWikiReceivers";
import NotificationEditWikiSend from "@/views/notification/editWiki/EditWikiSend";

import NotificationDetailPage from "@/views/notification/DetailPage";

import Pimedia from "@/views/pimedia/pimedia";

import Book from "@/views/book/Book";
import BookShops from "@/views/book/shops/Shops";
import BookShop from "@/views/book/shops/Shop";
import BookSetupsWarehouse from "@/views/book/setups/Warehouse";
import BookSetupsRank from "@/views/book/setups/Rank";
import BookSetupsLine from "@/views/book/setups/Line";
import BookSetupsSetup from "@/views/book/setups/Setup";
import BookOrders from "@/views/book/orders/Orders";
import BookOrder from "@/views/book/orders/Order";
import BookArrangement from "@/views/book/Arrangement";
import BookPathPlan from "@/views/book/pathPlan/PathPlan";
import BookPathPlanMap from "@/views/book/pathPlan/PathPlanMap";
import BookClassify from "@/views/book/Classify";
import BookProducts from "@/views/book/products/Products";
import BookProduct from "@/views/book/products/Product";
import BookTemp from "@/views/book/Temp";
import BookEditTemp from "@/views/book/EditTemp";

import Accounts from "@/views/accounts/Accounts";
import AccountsShops from "@/views/accounts/shops/Shops";
import AccountsShop from "@/views/accounts/shops/Shop";
import AccountsUsers from "@/views/accounts/users/Users";


const routers = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/security',
        name: 'Security',
        component: Security,
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/pages',
        component: Pages,
        children: [
          {
            path: 'scheduleManagement',
            name: 'PagesScheduleManagement',
            component: PagesScheduleManagement
          },
        ]
      },
      {
        path: '/book',
        component: Book,
        children: [
          {
            path: 'shops',
            name: 'BookShops',
            component: BookShops,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'shop/:id',
            name: 'BookShop',
            component: BookShop
          },
          {
            path: 'warehouse',
            name: 'BookSetupsWarehouse',
            component: BookSetupsWarehouse,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'rank',
            name: 'BookSetupsRank',
            component: BookSetupsRank,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'line',
            name: 'BookSetupsLine',
            component: BookSetupsLine,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'setup',
            name: 'BookSetupsSetup',
            component: BookSetupsSetup,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'orders',
            name: 'BookOrders',
            component: BookOrders,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'orders/:id',
            name: 'BookOrder',
            component: BookOrder,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'arrangement',
            name: 'BookArrangement',
            component: BookArrangement,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'pathPlan',
            name: 'BookPathPlan',
            component: BookPathPlan,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'pathPlanMap',
            name: 'BookPathPlanMap',
            component: BookPathPlanMap,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'classify',
            name: 'BookClassify',
            component: BookClassify,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'products',
            name: 'BookProducts',
            component: BookProducts,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'products/:id',
            name: 'BookProduct',
            component: BookProduct,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'temp',
            name: 'BookTemp',
            component: BookTemp,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editTemp/:id',
            name: 'BookEditTemp',
            component: BookEditTemp,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'createTemp',
            name: 'BookCreateTemp',
            component: BookEditTemp,
            meta: {
              requireAuth: true
            },
          }
        ]
      },
      {
        path: '/notification',
        component: Notification,
        meta: {
          requireAuth: true
        },
        children: [
          {
            path: 'announcements',
            name: 'NotificationAnnouncements',
            component: NotificationAnnouncements,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'notifies',
            name: 'NotificationNotifies',
            component: NotificationNotifies,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'createNotify',
            name: 'NotificationCreateNotify',
            component: NotificationEditNotify,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editNotify/:id',
            name: 'NotificationEditNotify',
            component: NotificationEditNotify,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editNotifyReceivers/:id',
            name: 'NotificationEditNotifyReceivers',
            component: NotificationEditNotifyReceivers,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editNotifySend/:id',
            name: 'NotificationEditNotifySend',
            component: NotificationEditNotifySend,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'wikis',
            name: 'NotificationWikis',
            component: NotificationWikis,
            meta: {
              requireAuth: true
            },
          },
                {
            path: 'createWiki',
            name: 'NotificationCreateWiki',
            component: NotificationEditWiki,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editWiki/:id',
            name: 'NotificationEditWiki',
            component: NotificationEditWiki,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editWikiReceivers/:id',
            name: 'NotificationEditWikiReceivers',
            component: NotificationEditWikiReceivers,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editWikiSend/:id',
            name: 'NotificationEditWikiSend',
            component: NotificationEditWikiSend,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'publicities',
            name: 'NotificationPublicities',
            component: NotificationPublicities,
            meta: {
              requireAuth: true
            },
          },
                {
            path: 'createPublicity',
            name: 'NotificationCreatePublicity',
            component: NotificationEditPublicity,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editPublicity/:id',
            name: 'NotificationEditPublicity',
            component: NotificationEditPublicity,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editPublicityReceivers/:id',
            name: 'NotificationEditPublicityReceivers',
            component: NotificationEditPublicityReceivers,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'editPublicitySend/:id',
            name: 'NotificationEditPublicitySend',
            component: NotificationEditPublicitySend,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'tags',
            name: 'NotificationTags',
            component: NotificationTags,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'classifies',
            name: 'NotificationClassifies',
            component: NotificationClassifies,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'setups',
            name: 'NotificationSetups',
            component: NotificationSetups,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'notify/:id',
            name: 'NotifyDetailPage',
            component: NotificationDetailPage,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'wiki/:id',
            name: 'WikiDetailPage',
            component: NotificationDetailPage,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'publicity/:id',
            name: 'PublicityDetailPage',
            component: NotificationDetailPage,
            meta: {
              requireAuth: true
            },
          }
        ]
      },
      {
        path: '/accounts',
        component: Accounts,
        meta: {
          requireAuth: true
        },
        children: [
          {
            path: 'shops',
            name: 'AccountsShops',
            component: AccountsShops,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'shop/:id',
            name: 'AccountsShop',
            component: AccountsShop,
            meta: {
              requireAuth: true
            },
          },
          {
            path: 'users',
            name: 'AccountsUsers',
            component: AccountsUsers,
            meta: {
              requireAuth: true
            },
          }
        ]
      },
      {
        path: '/pimedia',
        component: Pimedia,
        meta: {
          requireAuth: true
        },
      }
    ]
  },
  
];
export default routers;