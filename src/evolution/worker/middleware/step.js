import {
  STEP_EVOLUTION,
  evolutionProgress,
  LOSS_THRESHOLD,
  doneEvolution,
} from '../../actions'
import {
  algorithmsById,
  setAlgorithm,
  setConstants,
} from '../../../settings/actions'
import { step } from '../utils'

const handleStep = store => next => action => {
  if (action.type === STEP_EVOLUTION) {
    next(action)
    const algorithmId = action.payload.parameters.algorithm.id
    store.dispatch(setAlgorithm(algorithmId))
    store.dispatch(setConstants(action.payload.constants))

    const { maxSteps } = algorithmsById[algorithmId]

    const { expression, step: currentStep, algorithm } = store.getState()

    const result = step(
      action.payload,
      expression,
      algorithm,
      action.payload.constants
    )

    store.dispatch(
      evolutionProgress({
        ...result,
        step: currentStep + maxSteps,
      })
    )

    if (result.loss <= LOSS_THRESHOLD) {
      store.dispatch(doneEvolution())
    }

    return
  }

  next(action)
}

export default handleStep
