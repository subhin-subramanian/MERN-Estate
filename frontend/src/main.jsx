
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store.js'
import { Provider } from 'react-redux'
import ThemeProvider from './components/ThemeProvider.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  </PersistGate>


)
