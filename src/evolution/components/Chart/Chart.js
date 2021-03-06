import React from 'react'
import { useSelector } from 'react-redux'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { LineChart } from './style'
import { stepsSelector, isDoneSelector } from '../../selectors'

const getData = (data, isDone) => {
  if (isDone) {
    return data.slice(0, data.length - 1)
  } else {
    return data
  }
}

const Chart = () => {
  const steps = useSelector(stepsSelector)
  const isDone = useSelector(isDoneSelector)

  // remove last entry from steps when done
  // because the log scale doesn't handle 0
  const data = getData(steps, isDone)

  return (
    <div css="margin: 0 2px; position: relative; padding-bottom: 65%;">
      <div css="width: 100%; height: 100%; position: absolute;">
        <ResponsiveContainer style={{ position: 'absolute' }}>
          <LineChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 2, left: 2 }}
          >
            <XAxis
              dataKey="step"
              type="number"
              domain={[0, dataMax => (isFinite(dataMax) ? dataMax : 1000)]}
              hide
            />
            <YAxis
              scale="log"
              domain={[dataMin => dataMin * 0.9, dataMax => dataMax * 1.1]}
              hide
            />
            <CartesianGrid vertical={false} />
            <ReferenceLine x={0} />
            <Line
              type="stepAfter"
              dataKey="loss"
              dot={false}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart
