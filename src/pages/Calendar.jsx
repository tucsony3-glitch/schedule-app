import { useEffect, useState } from 'react'
import { format, isSameDay, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useCalendar } from '../hooks/useCalendar'
import EventModal from '../components/EventModal'
import DayModal from '../components/DayModal'
import styles from './Calendar.module.css'

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']
const EVENT_COLORS = ['#4285f4', '#0f9d58', '#f4b400', '#db4437', '#673ab7', '#00bcd4']

export default function Calendar({ accessToken, onLogout }) {
  const cal = useCalendar(accessToken, onLogout)
  const [modal, setModal] = useState(null) // null | { mode: 'create', date } | { mode: 'edit', event }
  const [dayModal, setDayModal] = useState(null) // null | date
  const [selectedDay, setSelectedDay] = useState(new Date())

  useEffect(() => {
    cal.fetchEvents()
    // 通知許可をリクエスト（バッジに必要な場合がある）
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    updateBadge(cal.events)
  }, [cal.events])

  function updateBadge(events) {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const todayCount = events.filter(ev => {
      if (ev.start?.dateTime) return isToday(new Date(ev.start.dateTime))
      if (ev.start?.date) return ev.start.date === todayStr
      return false
    }).length

    if ('setAppBadge' in navigator) {
      if (todayCount > 0) {
        navigator.setAppBadge(todayCount).catch(() => {})
      } else {
        navigator.clearAppBadge().catch(() => {})
      }
    }
  }

  function openDay(date) {
    setSelectedDay(date)
    setDayModal(date)
  }

  function openCreate(date) {
    setDayModal(null)
    setSelectedDay(date)
    setModal({ mode: 'create', date })
  }

  function openEdit(event) {
    setDayModal(null)
    setModal({ mode: 'edit', event })
  }

  async function handleSave(payload) {
    if (modal.mode === 'create') {
      await cal.createEvent(payload)
    } else {
      await cal.updateEvent(modal.event.id, payload)
    }
  }

  function getEventColor(event) {
    const hash = event.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return EVENT_COLORS[hash % EVENT_COLORS.length]
  }

  const days = cal.getCalendarDays()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <button className={styles.navBtn} onClick={cal.prevMonth}>‹</button>
        <div className={styles.monthTitle}>
          <h1>{cal.formatMonth()}</h1>
          {cal.loading && <span className={styles.loader} />}
        </div>
        <button className={styles.navBtn} onClick={cal.nextMonth}>›</button>
        <button className={styles.logoutBtn} onClick={onLogout} title="ログアウト">⏻</button>
      </header>

      {cal.error && (
        <div className={styles.error}>
          {cal.error}
          <button onClick={() => cal.fetchEvents()}>再試行</button>
        </div>
      )}

      <div className={styles.dayLabels}>
        {DAY_LABELS.map((d, i) => (
          <div key={d} className={`${styles.dayLabel} ${i === 0 ? styles.sun : i === 6 ? styles.sat : ''}`}>{d}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map(day => {
          const dayEvents = cal.getEventsForDay(day)
          const inMonth = cal.isSameMonth(day)
          const today = isToday(day)
          const selected = isSameDay(day, selectedDay)
          const isSun = day.getDay() === 0
          const isSat = day.getDay() === 6

          return (
            <div
              key={day.toISOString()}
              className={`${styles.cell} ${!inMonth ? styles.outMonth : ''}`}
              onClick={() => openDay(day)}
            >
              <span className={`${styles.dayNum} ${today ? styles.today : ''} ${isSun ? styles.sun : ''} ${isSat ? styles.sat : ''}`}>
                {format(day, 'd')}
              </span>
              <div className={styles.events}>
                {dayEvents.slice(0, 3).map(ev => (
                  <div
                    key={ev.id}
                    className={styles.event}
                    style={{ background: getEventColor(ev) }}
                  >
                    {ev.start?.dateTime ? format(new Date(ev.start.dateTime), 'H:mm') + ' ' : ''}
                    {ev.summary}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className={styles.more}>+{dayEvents.length - 3}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button className={styles.fab} onClick={() => openCreate(selectedDay)}>＋</button>

      {dayModal && (
        <DayModal
          date={dayModal}
          events={cal.getEventsForDay(dayModal)}
          onEdit={openEdit}
          onAdd={() => openCreate(dayModal)}
          onClose={() => setDayModal(null)}
        />
      )}

      {modal && (
        <EventModal
          event={modal.mode === 'edit' ? modal.event : null}
          defaultDate={modal.mode === 'create' ? modal.date : null}
          onSave={handleSave}
          onDelete={cal.deleteEvent}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
