import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { CssBaseline } from '@mui/material'

// Config toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// Config MUI DIalog
import { ConfirmProvider } from 'material-ui-confirm'

// Config Redux store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

// Config react-router-dom
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    {/* <React.StrictMode> */}
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'primary', variant: 'contained' },
          cancellationButtonProps: { color: 'inherit' },
          buttonOrder: ['confirm', 'cancel']
        }}>
          <CssBaseline>
            <App />
            <ToastContainer theme='colored' position='bottom-left' />
          </CssBaseline>
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
)
