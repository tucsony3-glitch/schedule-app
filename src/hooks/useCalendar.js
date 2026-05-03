import { useState, useCallback } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameMonth, isSameDay, parseISO
} from 'date-fns'

const BASE = 'https://www.googleapis.com/calendar/v3'

export function useCalendar(accessToken) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }

  const fetchEvents = useCallback(async (date = currentDate) => {
    setLoading(true)
    setError(null)
    try {
      const start = startOfMonth(date).toISOString()
      const end = endOfMonth(date).toISOString()
      const params = new URLSearchParams({ timeMin: start, timeMax: end, singleEvents: true, orderBy: 'startTime', maxResults: 250 })
      const res = await fetch(`${BASE}/calendars/primary/events?${params}`, { headers })
      if (!res.ok) throw new Error('カレンダーの読み込みに失敗しました')
      const data = await res.json()
      setEvents(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  async function createEvent(event) {
    const res = await fetch(`${BASE}/calendars/primary/events`, {
      method: 'POST', headers,
      body: JSON.stringify(event),
    })
    if (!res.ok) throw new Error('イベントの作成に失敗しました')
    const created = await res.json()
    setEvents(prev => [...prev, created])
    return created
  }

  async function updateEvent(id, event) {
    const res = await fetch(`${BASE}/calendars/primary/events/${id}`, {
      method: 'PUT', headers,
      body: JSON.stringify(event),
    })
    if (!res.ok) throw new Error('イベントの更新に失敗しました')
    const updated = await res.json()
    setEvents(prev => prev.map(e => e.id === id ? updated : e))
    return updated
  }

  async function deleteEvent(id) {
    const res = await fetch(`${BASE}/calendars/primary/events/${id}`, { method: 'DELETE', headers })
    if (!res.ok) throw new Error('イベントの削除に失敗しました')
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  function prevMonth() {
    const d = subMonths(currentDate, 1)
    setCurrentDate(d)
    fetchEvents(d)
  }

  function nextMonth() {
    const d = addMonths(currentDate, 1)
    setCurrentDate(d)
    fetchEvents(d)
  }

  function getCalendarDays() {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }

  function getEventsForDay(day) {
    return events.filter(ev => {
      const start = ev.start?.dateTime ? parseISO(ev.start.dateTime) : parseISO(ev.start?.date)
      return isSameDay(start, day)
    })
  }

  return {
    currentDate, events, loading, error,
    fetchEvents, createEvent, updateEvent, deleteEvent,
    prevMonth, nextMonth, getCalendarDays, getEventsForDay,
    isSameMonth: (day) => isSameMonth(day, currentDate),
    isSameDay,
    formatMonth: () => format(currentDate, 'yyyy年 M月'),
  }
}
