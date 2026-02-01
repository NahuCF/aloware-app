import AppLayout from "@/layouts/AppLayout.vue";
import Users from "@/views/Users.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "users",
        name: "users",
        component: Users,
      },
    ],
  },
];

export default routes.map((route) => {
  const meta = { public: false };

  return { ...route, meta };
});
