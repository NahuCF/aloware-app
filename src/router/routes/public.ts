import AuthLayout from '@/layouts/AuthLayout.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: Login
      }
    ]
  }
]

export default routes.map((route) => {
  const meta = { public: true }

  return { ...route, meta }
})
