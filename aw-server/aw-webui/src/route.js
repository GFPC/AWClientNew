import Vue from 'vue';
import VueRouter from 'vue-router';

import pinia from './stores';
import { useUiModeStore } from './stores/uiMode';

const Home = () => import('./views/Home.vue');

// Activity views for desktop
const Activity = () => import('./views/activity/Activity.vue');
const ActivityView = () => import('./views/activity/ActivityView.vue');

const Buckets = () => import('./views/Buckets.vue');
const Bucket = () => import('./views/Bucket.vue');
const QueryExplorer = () => import('./views/QueryExplorer.vue');
const Timeline = () => import('./views/Timeline.vue');
const Trends = () => import('./views/Trends.vue');
const Settings = () => import('./views/settings/Settings.vue');
const CategoryBuilder = () => import('./views/settings/CategoryBuilder.vue');
const Stopwatch = () => import('./views/Stopwatch.vue');
const Alerts = () => import('./views/Alerts.vue');
const Search = () => import('./views/Search.vue');
const Report = () => import('./views/Report.vue');
const TimespiralView = () => import('./views/TimespiralView.vue');
const Dev = () => import('./views/Dev.vue');
const Graph = () => import('./views/Graph.vue');
const NotFound = () => import('./views/NotFound.vue');
const User = () => import('./views/User.vue');

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: _to => {
        return localStorage.landingpage || '/home';
      },
    },
    { path: '/home', component: Home },
    {
      path: '/activity/:host/:periodLength?/:date?',
      component: Activity,
      props: true,
      children: [
        {
          path: 'view/:view_id?',
          meta: { subview: 'view' },
          name: 'activity-view',
          component: ActivityView,
          props: true,
        },
        // Unspecified should redirect to summary view is the summary view
        // (needs to be last since otherwise it'll always match first)
        {
          path: '',
          redirect: 'view/',
        },
      ],
    },
    { path: '/buckets', component: Buckets },
    { path: '/buckets/:id', component: Bucket, props: true },
    { path: '/timeline', component: Timeline, meta: { fullContainer: true } },
    { path: '/trends', component: Trends, meta: { fullContainer: true } },
    { path: '/trends/:host', component: Trends, meta: { fullContainer: true } },
    { path: '/report', component: Report },
    { path: '/query', component: QueryExplorer },
    { path: '/alerts', component: Alerts },
    { path: '/timespiral', component: TimespiralView },
    { path: '/settings', component: Settings },
    { path: '/settings/category-builder', component: CategoryBuilder },
    { path: '/stopwatch', component: Stopwatch },
    { path: '/search', component: Search },
    { path: '/graph', component: Graph },
    { path: '/dev', component: Dev },
    { path: '/user', component: User },
    // NOTE: Will break with Vue 3: https://stackoverflow.com/questions/40193634/vue-router-redirect-on-page-not-found-404/64186073#64186073
    {
      path: '*',
      component: NotFound,
    },
  ],
});

const SIMPLE_MODE_BLOCKED = [
  '/buckets',
  '/trends',
  '/report',
  '/query',
  '/alerts',
  '/timespiral',
  '/stopwatch',
  '/search',
  '/graph',
  '/dev',
];

router.beforeEach((to, _from, next) => {
  const uiMode = useUiModeStore(pinia);
  if (uiMode.advancedEmployeeUi) {
    next();
    return;
  }
  const path = to.path || '';
  if (path.startsWith('/settings/category-builder')) {
    next({ path: '/settings', replace: true });
    return;
  }
  for (const p of SIMPLE_MODE_BLOCKED) {
    if (path === p || path.startsWith(p + '/')) {
      next({ path: '/home', replace: true });
      return;
    }
  }
  next();
});

export default router;
