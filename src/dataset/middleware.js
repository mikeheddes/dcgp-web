import {
  SELECT_DATASET,
  REQUEST_CUSTOM_DATASET,
  SET_RAW_DATA,
  selectDataset,
  addDataset,
  CHANGE_COLUMN_TYPE,
  columnTypes,
  addInput,
  addOutput,
  removeInput,
  removeOutput,
} from './actions'
import { resetEvolution } from '../evolution/actions'
import { datasetsSelector } from './selectors'
const nanoid = require('nanoid/non-secure')

export const handleDatasetChange = store => next => action => {
  next(action)

  if (action.type === SELECT_DATASET) {
    store.dispatch(resetEvolution())
  }
}

const handleRawUserData = store => next => action => {
  next(action)

  if (action.type === REQUEST_CUSTOM_DATASET) {
    if (action.meta.inputElement) {
      action.meta.inputElement.click()
    }
  }

  if (action.type === SET_RAW_DATA) {
    const parsedValues = action.payload
      .trim()
      .split('\n')
      .map(item => item.split(',').map(val => val.trim()))

    const containsHeaders = parsedValues[0].every(
      val => typeof val === 'string'
    )

    const labels = containsHeaders
      ? parsedValues.shift()
      : Array(parsedValues[0].length)
          .fill('')
          .map((_, i) => `var${i}`)

    const points = parsedValues.map(row =>
      row.map(item => {
        const tempValue = parseFloat(item)
        return isFinite(tempValue) ? tempValue : 0
      })
    )

    const datasetId = nanoid()

    store.dispatch(
      addDataset({
        id: datasetId,
        name: 'Custom dataset',
        mutable: true,
        points,
        inputs: [],
        outputs: [],
        labels,
      })
    )

    store.dispatch(selectDataset(datasetId))
  }
}

const handleColumnType = store => next => action => {
  next(action)

  if (action.type === CHANGE_COLUMN_TYPE) {
    const { datasetId, columnIndex, type } = action.payload

    if (!columnTypes.includes(type)) return

    const datasets = datasetsSelector(store.getState())
    const dataset = datasets[datasetId]
    const { inputs, outputs } = dataset

    // 'INPUT'
    if (type === columnTypes[0]) {
      store.dispatch(removeOutput(datasetId, columnIndex))

      if (!inputs.includes(columnIndex)) {
        store.dispatch(addInput(datasetId, columnIndex))
      }
    }

    // 'OUTPUT'
    if (type === columnTypes[1]) {
      store.dispatch(removeInput(datasetId, columnIndex))

      if (!outputs.includes(columnIndex)) {
        store.dispatch(addOutput(datasetId, columnIndex))
      }
    }

    // 'NONE'
    if (type === columnTypes[2]) {
      store.dispatch(removeOutput(datasetId, columnIndex))
      store.dispatch(removeInput(datasetId, columnIndex))
    }

    store.dispatch(resetEvolution())
  }
}

export default [handleDatasetChange, handleRawUserData, handleColumnType]
