import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PageNotFound from './pages/pageNotFound'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/register'
import AboutPage from './pages/about'
import AdminProductList from './pages/adminProductList'
import AdminProductCreate from './pages/adminProductCreate'
import AdminProductEdit from './pages/adminProductEdit'
import ProductDetailPage from './pages/detailsProduct'
import MessageContainer from './components/messageContainer'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="cadastro" element={<RegisterPage />} />
                <Route path="sobre" element={<AboutPage />} />
                <Route path="admin/products" element={<AdminProductList />} />
                <Route path="admin/products/create" element={<AdminProductCreate />} />
                <Route path="admin/products/edit/:id" element={<AdminProductEdit />} />
                <Route path="details/:id" element={<ProductDetailPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <MessageContainer />
        </Router>
    )
}

export default App
