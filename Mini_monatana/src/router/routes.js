const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'HomePage', component: () => import('pages/IndexPage.vue') },
      { path: 'faq', name: 'FaqPage', component: () => import('pages/FaqPage.vue') },
      { path: 'help', name: 'HelpPage', component: () => import('pages/HelpPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
