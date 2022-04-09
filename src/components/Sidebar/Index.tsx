import React from 'react'

import FilterView from '../Filter/Index'
import HighlightView from '../Highlight'
import IntervalSlider from '../IntervalSlider'
import FontMenu from '../FontMenu/Index'

const Sidebar: React.FC = () => {
  const style = {
    height: '100%',
    width: '200px',
    top: 5,
    position: 'fixed',
    marginLeft: '0px',
    overflow: 'scroll'
  }

  return (
    <div style={style}>
      <FilterView />
      <HighlightView />
      <IntervalSlider />
      <FontMenu />
    </div>
  )
}

export default Sidebar
