import { Log } from '../service/LogAnalyze'
import { Filter } from '../components/Filter'
import { Highlight } from '../components/Highlight'

export type FontSize = 10|11|12|13|14|15

export interface ViewerState {
  logs: Log[]
  maxInterval: number
  fontSize: FontSize
  filters: Filter[]
  highlights: Highlight[]
  interval: number
}

export interface ViewerSetFilterAction {
  type: 'SETFILTER',
  payload: Filter[]
}

export interface ViewerClearFilterAction {
  type: 'CLEARFILTER'
}

export interface ViewerSetLogPayLoad {
  logs: Log[]
  maxInterval: number
  filters: Filter[]
}

export interface ViewerSetLogAction {
  type: 'SETLOG',
  payload: ViewerSetLogPayLoad
}

export interface ViewerSetFontSizeAction {
  type: 'SETFONTSIZE',
  payload: FontSize
}

export interface ViewerSetHighlightsAction {
  type: 'SETHIGHLIGHT',
  payload: Highlight[]
}

export interface ViewerSetIntervalAction {
  type: 'SETINTERVAL',
  payload: number
}

export type ViewerAction = ViewerSetFilterAction |
                            ViewerClearFilterAction |
                            ViewerSetLogAction |
                            ViewerSetFontSizeAction |
                            ViewerSetHighlightsAction |
                            ViewerSetIntervalAction

export const initialState: ViewerState = { logs: [], maxInterval: 0, fontSize: 12, filters: [], highlights: [], interval: 0 }

export const filterReducer = (state = initialState, action: ViewerAction): ViewerState => {
  const addFilter = (addfilters: Filter[]): Filter[] => {
    const newfilters = [...state.filters]
    addfilters.map(filter => {
      const existed = state.filters.find(registered => registered.name === filter.name)
      if (existed === undefined) newfilters.push(filter)
    })
    return newfilters
  }
  switch (action.type) {
    case 'SETFILTER':
      return {
        logs: [...state.logs],
        maxInterval: state.maxInterval,
        fontSize: state.fontSize,
        filters: addFilter(action.payload),
        highlights: [...state.highlights],
        interval: state.interval
      }
    case 'CLEARFILTER':
      return {
        logs: [...state.logs],
        maxInterval: state.maxInterval,
        fontSize: state.fontSize,
        filters: [],
        highlights: [...state.highlights],
        interval: state.interval
      }
    case 'SETLOG':
    {
      return {
        logs: [...action.payload.logs],
        maxInterval: action.payload.maxInterval,
        fontSize: state.fontSize,
        filters: addFilter(action.payload.filters),
        highlights: [...state.highlights],
        interval: state.interval
      }
    }
    case 'SETFONTSIZE':
      return {
        logs: [...state.logs],
        maxInterval: state.maxInterval,
        fontSize: action.payload,
        filters: [...state.filters],
        highlights: [...state.highlights],
        interval: state.interval
      }
    case 'SETHIGHLIGHT':
      return {
        logs: [...state.logs],
        maxInterval: state.maxInterval,
        fontSize: state.fontSize,
        filters: [...state.filters],
        highlights: [...action.payload],
        interval: state.interval
      }
    case 'SETINTERVAL':
      return {
        logs: [...state.logs],
        maxInterval: state.maxInterval,
        fontSize: state.fontSize,
        filters: [...state.filters],
        highlights: [...state.highlights],
        interval: action.payload
      }
    default:
      return state
  }
}
