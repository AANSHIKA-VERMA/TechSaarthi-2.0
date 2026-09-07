import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import ProtectedRoute from './components/ProtectedRoute'
import ChatWidget from './components/ChatWidget'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import OpportunityList from './pages/OpportunityList'
import Saved from './pages/Saved'
import Contribute from './pages/Contribute'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import FeedbackButton from './components/FeedbackButton'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/opportunities/:category"
              element={
                <ProtectedRoute>
                  <OpportunityList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/saved"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/contribute"
              element={
                <ProtectedRoute>
                  <Contribute />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ChatWidget />
          <FeedbackButton />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
