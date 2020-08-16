import React, { Component } from 'react';
import {
  removeGoalThunk,
  addGoalThunk
} from './store';
import List from '../components/List';

class Goals extends Component {
  addItem = (e) => {
    e.preventDefault()
    this.props.dispatch(addGoalThunk(this.input.value, () => this.input.value=''))

  }
  removeItem = (goal) => {
    this.props.dispatch(removeGoalThunk(goal))
  }
  render() {
    return (
      <div>
        <h3>Goals</h3>
        <input
          type='text'
          placeholder='Add Goal'
          ref={(input) => this.input = input}
        />
        <button
          onClick={this.addItem}
        >Add Goal</button>
        <List
          items={this.props.goals}
          remove={this.removeItem}
        />
      </div>
    )
  }
}

export default Goals;