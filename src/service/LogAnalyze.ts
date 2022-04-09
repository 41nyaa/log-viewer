import { Filter } from '../components/Filter'

export interface Log {
  id: string,
  time: number,
  date: string,
  kind: string,
  data: string,
}

export const readFile = async (path: string[]): Promise<[Log[], number, Filter[]]> => {
  const fs = window.require('fs')
  const promises: Promise<string>[] = []
  for (let i = 0; i < path.length; i++) {
    promises.push(new Promise<string>((resolve, reject) => {
      fs.readFile(path[i], 'utf-8', (err: Error, data: string) => {
        if (err) reject(err)
        data += '\n'
        resolve(data)
      })
    }))
  }
  const datas = await Promise.all(promises)

  let logs: Log[] = []
  for (let i = 0; i < datas.length; i++) {
    logs = logs.concat(analyzeLog(datas[i].split('\n')))
  }

  logs.sort((a, b) => a.time - b.time)

  let maxInterval = 0
  const filters: Filter[] = []
  for (let i = 0; i < logs.length; i++) {
    logs[i].id = i.toString()
    if (i > 0) {
      const interval = logs[i].time - logs[i - 1].time
      if (interval > maxInterval) maxInterval = interval
    }
    const existed = filters.find(elem => elem.name === logs[i].kind)
    if (existed === undefined) filters.push({ name: logs[i].kind, displayed: true, align: 'L' })
  }
  return [logs, maxInterval, filters]
}

export const analyzeLog = (raws: string[]): Log[] => {
  const logs: Log[] = []
  for (let i = 0; i < raws.length; i++) {
    if (raws[i].length < 31) continue

    const datestr = raws[i].substring(0, 31)
    let date = datestr.substring(datestr.indexOf('[') + 1, datestr.indexOf(']'))
    date.replace('///g', '-')
    date.replace('/ /g', 'T')
    date += 'Z'

    const datastr = raws[i].substring(31)
    const kind = datastr.substring(datastr.indexOf('[') + 1, datastr.indexOf(']'))

    logs.push({
      id: '',
      time: Date.parse(date),
      date: datestr,
      kind: kind,
      data: datastr
    })
  }
  return logs
}
