export const addLocationToID = (id: string) =>
  `${useLocation().pathname.slice(1).replaceAll('/', '-') || 'home'}-${id}`
