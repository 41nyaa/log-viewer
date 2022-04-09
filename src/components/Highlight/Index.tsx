import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ViewerState } from '../../reducer/Reducer'

export interface Highlight {
  target: string,
}

const HighlightView: React.FC = () => {
  const state = useSelector((state: ViewerState) => state)
  const dispatch = useDispatch()
  const [input, setInput] = useState('')

  const setHighlight = (highlights: Highlight[]) => {
    dispatch({
      type: 'SETHIGHLIGHT',
      payload: highlights
    })
  }

  const handleInput = (event: React.KeyboardEvent<HTMLInputElement>) : void => {
    if (event.key === 'Enter') {
      const registered = state.highlights.filter(highlight => highlight.target === input)
      if (registered.length > 0) return
      setInput('')
      const added: Highlight = { target: input }
      state.highlights.push(added)
      setHighlight(state.highlights)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) : void => {
    state.highlights = state.highlights.filter((highlight: Highlight) => {
      const id = event.currentTarget.getAttribute('id')
      return highlight.target !== id
    })
    setHighlight(state.highlights)
  }

  return (
    <div>
      Highlight
      <input
        type="text"
        value={input}
        onChange={input => setInput(input.target.value)}
        onKeyDown={handleInput.bind(this)}
      />
      { state.highlights.map((highlight, i) => (
        <div key={i}>
          <label htmlFor={highlight.target}>{highlight.target}</label>
          <button
            id={highlight.target}
            onClick={handleClick.bind(this)}>
            Del
          </button>
        </div>
      ))}
    </div>
  )
}

export default HighlightView
