import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PageNotFound from './pages/pageNotFound'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/register'
import AboutPage from './pages/about'
import MessageContainer from './components/messageContainer'
import Destaques from './pages/destaques'
import Busca from './pages/busca'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="cadastro" element={<RegisterPage />} />
                <Route path="sobre" element={<AboutPage />} />
                <Route path="destaques" element={<Destaques />} />
                <Route path="busca" element={<Busca />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <MessageContainer />
        </Router>
    )
}

export default App
