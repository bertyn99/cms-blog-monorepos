const isMathPatternPath = (pathA: string, pathB: string) => {
  const partsA = pathA.split('/');
  const partsB = pathB.split('/');

  if (partsA.length !== partsB.length) return false;

  const isMatch = partsA.every((part: string, i: number) => {
    return part === partsB[i] || part.startsWith(':');
  })

  return isMatch;
}

export const useBreadcrumbs = () => {
  const router = useRouter();
  const route = useRoute()
  const routes = router.getRoutes();

  const HOMEPAGE = { label: 'Home', to: '/admin' };
  const breadcrumbs: Ref<Array<{ label: string; to: string; }>> = ref([HOMEPAGE])

  function getBreadcrumbs(currRoute: string): any[] {
    if (currRoute === '/admin') return [HOMEPAGE];


    const paths = getBreadcrumbs(currRoute.slice(0, currRoute.lastIndexOf('/')));
    console.log('currRoute', currRoute);
    console.log('paths', paths);
    const founds = routes.filter(r => isMathPatternPath(r.path, currRoute));

    const matchRoute = founds.length > 1 ? founds.find(r => r.path === currRoute) : founds[0];

    return [
      ...paths,
      {
        to: currRoute,
        label: matchRoute?.meta?.breadcrumb || matchRoute?.name || matchRoute?.path || currRoute,
      }
    ]
  }

  watch(() => ({
    path: route.path,
    name: route.name,
    meta: route.meta,
    matched: route.matched,
  }), (route) => {
    if (route.path === '/admin') return;

    breadcrumbs.value = getBreadcrumbs(route.path);
  }, {
    immediate: true,
  })

  return {
    breadcrumbs
  }
}