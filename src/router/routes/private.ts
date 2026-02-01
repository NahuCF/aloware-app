const routes = [
  //todo
];

export default routes.map((route) => {
  const meta = { public: false };

  return { ...route, meta };
});
