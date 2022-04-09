import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ViewerState } from '../../reducer/Reducer'

const IntervalSlider: React.FC = () => {
  const state = useSelector((state: ViewerState) => state)
  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
    dispatch({
      type: 'SETINTERVAL',
      payload: event.target.value
    })
  }

  return (
    <div>
      Time Interval Slider
      <input type='range'
        min='0'
        max='20'
        step='1'
        value={state.interval}
        onChange={handleChange}>
      </input>
    </div>
  )
}

export default IntervalSlider
