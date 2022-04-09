import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

import Viewer from './components/Viewer/Index'
import { filterReducer } from './reducer/Reducer'
import Sidebar from './components/Sidebar/Index'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const store = createStore(filterReducer)

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Viewer />
      <Sidebar />
    </Provider>
  )
}

render(<App />, mainElement)
