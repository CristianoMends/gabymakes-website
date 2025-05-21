import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PageNotFound from './pages/pageNotFound'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Router>
    )
}

export default App
