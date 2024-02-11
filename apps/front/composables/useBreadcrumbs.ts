
export type Breadcrumb = {
  label: string;
  icon?: string;
  to: string,
}

export const useBreadcrumbs = () => {
  const route = useRoute();
  const router = useRouter();
  const breadcrumbs = ref<Breadcrumb[]>([]);

  const getBreadcrumbs = () => {
    const fullPath = route.path;
    const requestPath = fullPath.startsWith("/")
      ? fullPath.substring(1)
      : fullPath;
    const crumbs = requestPath.split("/");
    const tmpBreadcrumb: Breadcrumb[] = [];
    let path = "";
    crumbs.forEach((crumb) => {
      if (crumb) {
        path = `${path}/${crumb}`;
        const tmpCrumb = router.getRoutes().find((r) => r.path === path);

        if (tmpCrumb) {
          //get name of the route
          //get the last part of the split string
          const name = String(tmpCrumb?.name).split('-').pop() || '';
          const breadcrumb: Breadcrumb = { label: tmpCrumb?.name == 'admin' ? 'Home' : name.toUpperCase(), to: path };

          tmpBreadcrumb.push(breadcrumb);
        }
      }
    });
    return tmpBreadcrumb;
  };

  watch(route, value => {
    breadcrumbs.value = [...getBreadcrumbs()];
    console.log(breadcrumbs.value);
  }, { deep: true, immediate: true });

  return {
    breadcrumbs,
  }
}
