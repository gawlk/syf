import routes from '~solid-pages'

import './styles/main.css'
import 'tailwindcss/tailwind.css'

const root = document.getElementById('root')

if (root) {
  const Routes = useRoutes(routes)

  render(
    () => (
      <Router>
        <Routes />
      </Router>
    ),
    root
  )
}
