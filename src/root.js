import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import evolution from './evolution/reducers'
import settings from './settings/reducers'
import datasets from './dataset/reducers'
import ui from './ui/reducers'

// import evolution from './evolution/reducers'
import settingsEpic from './settings/epics'
// import datasets from './dataset/reducers'
// import ui from './ui/reducers'

export const rootReducer = combineReducers({
  evolution,
  settings,
  datasets,
  ui,
})

export const rootEpic = combineEpics(settingsEpic)
