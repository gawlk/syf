import routes from '~solid-pages'

import 'tailwindcss/tailwind.css'
import './styles/main.css'

const root = document.getElementById('root')

if (root) {
  console.log(routes)

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
