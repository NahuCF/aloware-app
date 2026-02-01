import AppLayout from "@/layouts/AppLayout.vue";
import Lines from "@/views/Lines.vue";
import Users from "@/views/Users.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "",
        redirect: "/lines",
      },
      {
        path: "lines",
        name: "lines",
        component: Lines,
      },
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
