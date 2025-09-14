import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import MoviesForm from './Pages/MoviesForm'
import MoviesTable from './Pages/MoviesTable'

const browserRoutes = createBrowserRouter([
  {
    path : "/",
    element : <App/>,
    children : [
      {
        path : "AddMovies",
        element : <MoviesForm/>
      },
      {
        path : "allMovies",
        element : <MoviesTable/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={browserRoutes}/>
  </StrictMode>,
)
