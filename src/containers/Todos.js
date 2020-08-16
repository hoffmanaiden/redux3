import React, {Component} from 'react';
import {
  removeTodoThunk,
  addTodoThunk,
  toggleTodoThunk
} from './store';
import List from '../components/List';

class Todos extends Component {
  addItem = (e) => {
    e.preventDefault()
    this.props.dispatch(addTodoThunk(
      this.input.value,
      () => this.input.value=''
    ))
  }
  removeItem = (todo) => {
    this.props.dispatch(removeTodoThunk(todo))
  }
  toggleItem = (todo) => {
    this.props.dispatch(toggleTodoThunk(todo))
  }
  render(){
    return(
      <div>
        <h3>Todo List</h3>
        <input
          type='text'
          placeholder='Add Todo'
          ref={(input) => this.input = input}
        ></input>
        <button
          onClick={this.addItem}
        >Add Todo</button>
        <List
          items={this.props.todos}
          remove={this.removeItem}
          toggle={this.toggleItem}
        />
      </div>
    )
  }
}

export default Todos;