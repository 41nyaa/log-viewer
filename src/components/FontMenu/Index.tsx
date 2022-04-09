import React from 'react'
import { useDispatch } from 'react-redux'

const FontMenu: React.FC = () => {
  const dispatch = useDispatch()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) : void => {
    dispatch({
      type: 'SETFONTSIZE',
      payload: event.target.value
    })
  }

  return (
    <div>
      Font Size
      <select name="Font Size" onChange={handleChange}>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12" selected>12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
      </select>
    </div>
  )
}

export default FontMenu
