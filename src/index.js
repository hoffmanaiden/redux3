import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import {ConnectedApp} from './containers/App';
import {store} from './containers/store'

export const Context = React.createContext()

class Provider extends React.Component{
  render(){
    return(
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

ReactDOM.render(
  <Provider store={store} >
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
