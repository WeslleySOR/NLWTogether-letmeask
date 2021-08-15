import { BrowserRouter, Route, Switch } from 'react-router-dom'

import {Home} from './pages/Home/index'
import { NewRoom } from "./pages/NewRoom/index";
import { Room } from './pages/Room/index';
import { AdminRoom } from './pages/AdminRoom/index';

import { AuthContextProvider } from './contexts/AuthContext'


import { ChakraProvider } from "@chakra-ui/react"
import { newTheme } from './styles/themes'

function App() {
  return (
    <AuthContextProvider>
      <ChakraProvider resetCSS theme={newTheme}>
        <BrowserRouter>
            <Switch>
              <Route path="/" exact component={ Home } />
              <Route path="/rooms/new" component={ NewRoom } />
              <Route path="/rooms/:id" component={ Room } />
              <Route path="/admin/rooms/:id" component={ AdminRoom } />
            </Switch>
        </BrowserRouter>
      </ChakraProvider>
    </AuthContextProvider>
  );
}

export default App;
