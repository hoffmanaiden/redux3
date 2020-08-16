import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import API from 'goals-todos-api';
import thunk from 'redux-thunk';

export function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// --------------------------------------------- Action Types
const RECEIVE_DATA = 'RECEIVE_DATA';
// -- Todo actions
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE';
// -- Goal actions
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';


// -------------------------------------------- Action Creators
export function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  }
}
export function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  }
}
export function toggleTodoAction(id) { // toggle todo completion
  return {
    type: TOGGLE_COMPLETE,
    id
  }
}
export function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}
export function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}
export function receiveDataAction(todos, goals){
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  }
}

// ------------------------------------------------ Thunks
export function fetchDataThunk(){
  return(dispatch) => {
    Promise.all([
      API.fetchTodos(),
      API.fetchGoals()
    ]).then(([todos, goals]) => {
      dispatch(receiveDataAction(todos, goals))
    })
  }
}
// -- Todo thunks
export function removeTodoThunk(todo){
  return(dispatch) => {
    dispatch(removeTodoAction(todo.id))
    return API.deleteTodo(todo.id)
      .catch(() => {
        dispatch(addTodoAction(todo))
        alert('An error occurred. Try again.')
      })
  }
}
export function addTodoThunk(name, resetTextBox){
  return(dispatch) => {
    return API.saveTodo(name)
      .then((todo) => {
        dispatch(addTodoAction(todo))
        resetTextBox()
      })
      .catch(() => alert('There was an error. Try again'))
  }
}
export function toggleTodoThunk(todo){
  return(dispatch) => {
    dispatch(toggleTodoAction(todo.id))
    return API.saveTodoToggle(todo.id)
      .catch(() => {
        dispatch(toggleTodoAction(todo.id))
        alert('An error occurred. Try again.')
      })
  }
}
// -- Goal thunks
export function removeGoalThunk(goal){
  return(dispatch) => {
    dispatch(removeGoalAction(goal.id))
    return API.deleteGoal(goal.id)
      .catch(() => {
        dispatch(addGoalAction(goal))
        alert('An error occurred. Try again')
      })
  }
}
export function addGoalThunk(name, resetTextBox){
  return(dispatch) => {
    return API.saveGoal(name)
    .then((goal) => {
      dispatch(addGoalAction(goal))
      resetTextBox()
    })
    .catch(() => alert('There was an error. Try again'))
  }
}


// --------------------------------------------- Todo Reducer
function todoReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo])
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_COMPLETE:
      return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete })
      )
    case RECEIVE_DATA:
      return action.todos
    default:
      return state
  }
}
// --------------------------------------------- Goal Reducer
function goalReducer(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    case RECEIVE_DATA:
      return action.goals
    default:
      return state
  }
}
// --------------------------------------- Loading Reducer
function loadingReducer(state=true, action){
  switch(action.type){
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}

// --------------------------------------- Middleware 
// called between dispatch and reducer
const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert('No bitcoin allowed')
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf('bitcoin') !== -1
  ) { 
    return alert('No bitcoin allowed')
  }

  return next(action)
}

const logger = (store) => (next) => (action) => {
  console.group(action.type)
  console.log('The action: ', action)
  const result = next(action)
  console.log('The new state: ', store.getState())
  console.groupEnd()
  return result
}

// const thunk = (store) => (next) => (action) => {
//   if(typeof action === 'function'){
//     return action(store.dispatch)
//   }
//   return next(action);
// }

// ----------------------------------------------- STORE!
export const store = createStore(combineReducers({
  todos: todoReducer,
  goals: goalReducer,
  loading: loadingReducer
}), compose(
  applyMiddleware(thunk, checker, logger),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))