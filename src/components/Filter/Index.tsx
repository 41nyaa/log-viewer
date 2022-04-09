import { IpcRendererEvent } from 'electron'
import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ViewerState } from '../../reducer/Reducer'

export type AlignType = 'L' | 'R'

export interface Filter {
  name: string
  displayed: boolean
  align: AlignType
}

const FilterView: React.FC = () => {
  const state = useSelector((state: ViewerState) => state)
  const dispatch = useDispatch()

  const setFilter = (filters: Filter[]) => {
    dispatch({
      type: 'SETFILTER',
      payload: filters
    })
  }

  useEffect(() => {
    const { ipcRenderer } = window.require('electron')
    ipcRenderer.on('FILTER_FILE_OPEN', (event: IpcRendererEvent, args: string[]) => {
      const data = async () => {
        const fs = window.require('fs')
        await new Promise<void>((resolve, reject) => {
          fs.readFile(args[0], 'utf-8', (err: Error, content: string) => {
            if (err) reject(err)
            setFilter(JSON.parse(content))
            resolve()
          })
        })
      }
      data()
    })
  }, [])

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) : void => {
    state.filters.map((filter: Filter) => {
      if (filter.name === event.target.id) filter.displayed = event.target.checked
      return filter
    })
    setFilter(state.filters)
  }

  const handleAlign = (i: number, event: React.ChangeEvent<HTMLInputElement>) : void => {
    state.filters[i].align = event.target.name as AlignType
    setFilter(state.filters)
  }

  return (
    <div>
      Filter
      { state.filters.map((filter, i) => (
        <div key={i}>
          <form>
            <input
              type="checkbox"
              checked={filter.displayed}
              id={filter.name}
              onChange={handleFilter.bind(this)}
            />
            <input
              name='L'
              type="radio"
              value={filter.align}
              checked={filter.align === 'L'}
              onChange={handleAlign.bind(this, i)}
            />
            <input
              name='R'
              type="radio"
              value={filter.align}
              checked={filter.align === 'R'}
              onChange={handleAlign.bind(this, i)}
            />
            <label htmlFor={filter.name}>{filter.name}</label>
          </form>
        </div>
      ))}
    </div>
  )
}

export default FilterView
