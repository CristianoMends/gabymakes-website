import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PageNotFound from './pages/pageNotFound'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/register'
import AboutPage from './pages/about'
import ProductDetailPage from './pages/detailsProduct'
import MessageContainer from './components/messageContainer'
import Busca from './pages/busca'
import UserPage from './pages/userPage';
import AdminPage from './pages/adminPage'
import AdminRoute from './components/adminRoute';
import CheckoutPage from './pages/checkoutPage'


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="cadastro" element={<RegisterPage />} />
                <Route path="sobre" element={<AboutPage />} />
                <Route path="busca" element={<Busca />} />
                <Route path="user/:id" element={<UserPage />} />

                <Route
                    path="admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />

                <Route path='/checkout/:userId' element={<CheckoutPage />} />
                <Route path="details/:id" element={<ProductDetailPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <MessageContainer />
        </Router>
    )
}

export default App
