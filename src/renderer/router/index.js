import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-component',
      component: require('@/components/MainComponent').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
