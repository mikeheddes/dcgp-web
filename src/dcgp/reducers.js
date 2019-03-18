/* state structure
dcgp: {
  instance: {
    KernelSet: KernelSet,
    Kernel: Kernel,
    Expression: Expression,
  }
  parameters: {
    seed: Number
    kernels: {
      sum: Bool,
      diff: Bool,
      mul: Bool,
      div: Bool,
      pdiv: Bool,
      sin: Bool,
      cos: Bool,
      log: Bool,
      exp: Bool,
    },
    network: {
      rows: Number,
      columns: Number,
      arity: Number,
      levelsBack: Number
    }
    algorithm: {
      id: String
      offsprings: Number,
      maxGenerations: Number,
    }
  },
  evolution: {
    isEvolving: Bool,
    steps: [{
      loss: Number,
      chromosome,
    }],
  },
}
*/

import { combineReducers } from 'redux'
import * as actions from './actions'

function seed(state = 1234, action) {
  switch (action.type) {
    case actions.SET_SEED:
      return action.payload
    default:
      return state
  }
}

const initialKernelState = {
  sum: true,
  diff: true,
  mul: true,
  pdiv: true,
  sin: true,
  cos: true,
  log: false,
  exp: false,
}

function kernels(state = initialKernelState, action) {
  const { type, payload } = action

  switch (type) {
    case actions.TOGGLE_KERNEL:
      // TODO: move validation to middelware
      if (payload in state) {
        return { ...state, [payload]: !state[payload] }
      }

      throw new Error(`The specified kernelId "${payload}" does not exist.`)
    default:
      return state
  }
}

const initialNetworkState = {
  rows: 1, // min 1
  columns: 4, // min 1
  arity: 2, // min 2
  levelsBack: 5, // min 1
}

function network(state = initialNetworkState, action) {
  const { type, payload } = action

  switch (type) {
    case actions.SET_ROWS:
      return { ...state, rows: payload }
    case actions.SET_COLUMNS:
      return { ...state, columns: payload }
    case actions.SET_ARITY:
      return { ...state, arity: payload }
    case actions.SET_LEVELS_BACK:
      return { ...state, levelsBack: payload }
    default:
      return state
  }
}

const initialAlgorithmState = {
  id: actions.ONE_PLUS_LAMBDA,
  offsprings: 4,
  maxGenerations: 1,
}

function algorithm(state = initialAlgorithmState, action) {
  const { type, payload } = action

  switch (type) {
    case actions.SET_ALGORITHM:
      return { ...state, id: payload }
    default:
      return state
  }
}

const parameters = combineReducers({
  seed,
  kernels,
  network,
  algorithm,
})

function instance(state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case actions.SET_DCGP_INSTANCE:
      return { ...state, ...payload }
    default:
      return state
  }
}

const dcgpReducer = combineReducers({
  parameters,
  instance,
})

export default dcgpReducer
