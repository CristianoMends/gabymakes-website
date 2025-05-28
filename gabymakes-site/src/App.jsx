import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PageNotFound from './pages/pageNotFound'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/register'
import AboutPage from './pages/about'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="cadastro" element={<RegisterPage />} />
                <Route path="sobre" element={<AboutPage />} />
            </Routes>
        </Router>
    )
}

export default App
