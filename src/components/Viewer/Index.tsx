import { IpcRendererEvent } from 'electron'
import React, { DragEventHandler, FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ViewerState } from '../../reducer/Reducer'
import { readFile } from '../../service/LogAnalyze'

const Viewer: React.FC = () => {
  const state = useSelector((state: ViewerState) => state)
  const [current, setCurrent] = useState('0')
  const dispatch = useDispatch()
  const filteredLog = state.logs.filter(log => {
    let displayed = true
    state.filters.map(filter => {
      if (log.kind === filter.name) displayed = filter.displayed
    })
    return displayed
  })

  const viewstyle = {
    width: window.innerWidth - 250,
    height: window.innerHeight,
    marginLeft: '200px',
    top: 0,
    fontSize: state.fontSize + 'px',
    scrollBehavior: 'smooth'
  }

  const handleScorll = () => {
    const y = window.scrollY
    let id = '0'
    filteredLog.every(log => {
      const elem = document.getElementById(log.id)
      if (elem !== null && elem.offsetTop + 10 > y) {
        id = log.id
        return false
      }
      return true
    })
    setCurrent(id)
  }

  useEffect(() => {
    const { ipcRenderer } = window.require('electron')
    ipcRenderer.on('LOG_FILE_OPEN', (event: IpcRendererEvent, args: string[]) => {
      readFile(args)
        .then(([logs, maxInterval, filters]) => {
          dispatch({
            type: 'CLEARFILTER'
          })
          dispatch({
            type: 'SETLOG',
            payload: { logs, maxInterval, filters }
          })
        })
    })

    window.addEventListener('scroll', handleScorll)
    return () => {
      window.removeEventListener('scroll', handleScorll)
    }
  }, [state])

  useEffect(() => {
    let elem = document.getElementById(current)
    if (elem === null) {
      let id = '0'
      filteredLog.every(log => {
        if (parseInt(log.id) > parseInt(current)) return false
        id = log.id
        return true
      })
      elem = document.getElementById(id)
    }
    if (elem !== null) elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [state.filters])

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer && event.dataTransfer.items) {
      const files : string[] = []
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile()
          if (file) files.push(file.path)
        }
      }
      console.log(files)
      if (files.length > 0) {
        readFile(files)
          .then(([logs, maxInterval, filters]) => {
            dispatch({
              type: 'CLEARFILTER'
            })
            dispatch({
              type: 'SETLOG',
              payload: { logs, maxInterval, filters }
            })
          })
      }
    }
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const calcMarginBottom = (i: number) : string => {
    if (i === filteredLog.length - 1) return '0px'
    const marginMax = 700
    const margin = marginMax * state.interval / 20 *
        (filteredLog[i + 1].time - filteredLog[i].time) / state.maxInterval
    return (margin + 'px')
  }

  const getAlign = (i: number, kind: string) : string => {
    const filter = state.filters.find(filter => {
      if (filter.name === kind) return filter
    })
    if (filter !== undefined) return filter.align
    return 'L'
  }

  return (
    <div style={viewstyle} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter}>
      {filteredLog.map((log, i) => {
        let highlighted = false
        state.highlights.map(highlight => {
          if (log.data.indexOf(highlight.target) >= 0) highlighted = true
        })
        const align = (getAlign(i, log.kind) === 'L') ? 'left' : 'right'
        if (highlighted) {
          return (
            <div id={log.id} style={{ display: 'flex', fontWeight: 'bold', marginBottom: calcMarginBottom(i) }}>
              <div>{log.date}</div><div style={{ width: '72%', textAlign: align }}>{log.data}</div>
            </div>
          )
        } else {
          return (
            <div id={log.id} style={{ display: 'flex', marginBottom: calcMarginBottom(i) }}>
              <div>{log.date}</div><div style={{ width: '72%', textAlign: align }}>{log.data}</div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default Viewer
