import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';    // 路由挂载
import Routers from './router/';       // 路由列表
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import Bmap from "./components/baiMap/";
import Cookie from "js-cookie";

import './assets/utf8-php/ueditor.config.js'
import './assets/utf8-php/ueditor.all.min.js'
import './assets/utf8-php/lang/zh-cn/zh-cn.js'
import './assets/utf8-php/ueditor.parse.min.js'

Vue.use(VueRouter);
Vue.use(iView);
Vue.use( Bmap, {
  ak: 'yEyIqxgS3kitLBCfFWizLR7DtAxlEsRX'
} )

const RouterConfig = {
  mode: 'hash',
  routes: Routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  let token = Cookie.get('token')
  if(to.meta.requireAuth) {
    if(token) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');