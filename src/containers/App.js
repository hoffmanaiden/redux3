import React, {Component} from 'react';
import Goals from './Goals';
import Todos from './Todos';
import {fetchDataThunk} from './store';
import {Context} from '../index';

// function connect(mapStateToProps) {
//   return (Component) => {
//     class ConnectedComponent extends Component {
//       render() {
//         return(
//           <Context.Consumer>
//             {(store) => {
//               const {dispatch, getState} = store
//               const state = getState()
//               const stateNeeded = mapStateToProps(state)
//               return <Component {...stateNeeded} dispatch={dispatch} />
//             }}
//           </Context.Consumer>
//         )
//       }
//     }
//   }
// }
function connect (mapStateToProps) {
  return (Component) => {
    class Receiver extends Component {
      componentDidMount() {
        const { subscribe } = this.props.store

        this.unsubscribe = subscribe(() => this.forceUpdate())
      }
      componentWillUnmount() {
        this.unsubscribe()
      }
      render() {
        const { dispatch, getState } = this.props.store
        const state = getState()
        const stateNeeded = mapStateToProps(state)

        return <Component {...stateNeeded} dispatch={dispatch} />
      }
    }

    class ConnectedComponent extends React.Component {
      render() {
        return (
          <Context.Consumer>
            {(store) => <Receiver store={store}/>}
          </Context.Consumer>
        )
      }
    }

    return ConnectedComponent
  }
}

export const ConnectedGoals = connect((state) => ({
  goals: state.goals
}))(Goals)

export const ConnectedTodos = connect((state) => ({
  todos: state.todos
}))(Todos)

class App extends Component {
  componentDidMount(){
    const { dispatch } = this.props

    dispatch(fetchDataThunk())
  }
  render(){
    const {loading} = this.props
    if(loading){
      return <h1>Loading...</h1>
    }
    return (
      <div className="App">
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    );
  }
}

export const ConnectedApp = connect((state) => ({
  loading: state.loading
}))(App)

export default App;
