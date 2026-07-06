import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import styles from './DayModal.module.css'

const EVENT_COLORS = ['#4285f4', '#0f9d58', '#f4b400', '#db4437', '#673ab7', '#00bcd4']

function getColor(event) {
  const hash = event.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return EVENT_COLORS[hash % EVENT_COLORS.length]
}

function formatTime(ev) {
  if (ev.start?.date) return '終日'
  if (ev.start?.dateTime) {
    const s = format(parseISO(ev.start.dateTime), 'H:mm')
    const e = format(parseISO(ev.end.dateTime), 'H:mm')
    return `${s} – ${e}`
  }
  return ''
}

export default function DayModal({ date, events, onEdit, onAdd, onClose }) {
  const weekday = format(date, 'EEEE', { locale: ja })
  const dateStr = format(date, 'M月d日')

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.dateTitle}>
            {dateStr}<span>{weekday}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {events.length === 0 ? (
            <div className={styles.empty}>
              <span>📭</span>
              予定はありません
            </div>
          ) : (
            events.map(ev => (
              <div
                key={ev.id}
                className={styles.eventCard}
                style={{ borderLeftColor: getColor(ev) }}
                onClick={() => onEdit(ev)}
              >
                <div className={styles.eventTime}>{formatTime(ev)}</div>
                <div className={styles.eventTitle}>{ev.summary}</div>
                {ev.description && (
                  <div className={styles.eventDesc}>{ev.description}</div>
                )}
              </div>
            ))
          )}
          <button className={styles.addBtn} onClick={onAdd}>
            ＋ 予定を追加
          </button>
        </div>
      </div>
    </div>
  )
}
