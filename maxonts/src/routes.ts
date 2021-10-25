interface RouteRule {
  path: string
  displayname: string
}

export const routes: RouteRule[] = [
  {path: 'loans', displayname: 'Préstamos'},
  {path: 'returns', displayname: 'Devoluciones'},
  {path: 'inventory', displayname: 'Inventario'},
  {path: 'register', displayname: 'Registro'},
  {path: 'ups', displayname: 'Altas'},
  {path: 'downs', displayname: 'Bajas'},
  {path: 'manteinance', displayname: 'Mantenimiento'},
  {path: 'registry', displayname: 'Registro Material'}
]
