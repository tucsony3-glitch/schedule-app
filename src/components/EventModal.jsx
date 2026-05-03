import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import styles from './EventModal.module.css'

export default function EventModal({ event, defaultDate, onSave, onDelete, onClose }) {
  const isEdit = !!event
  const isAllDay = isEdit ? !!event.start?.date : false

  const [title, setTitle] = useState(isEdit ? event.summary || '' : '')
  const [allDay, setAllDay] = useState(isAllDay)
  const [date, setDate] = useState(() => {
    if (isEdit) {
      const d = event.start?.dateTime ? parseISO(event.start.dateTime) : parseISO(event.start?.date)
      return format(d, 'yyyy-MM-dd')
    }
    return defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  })
  const [startTime, setStartTime] = useState(() => {
    if (isEdit && event.start?.dateTime) return format(parseISO(event.start.dateTime), 'HH:mm')
    return '09:00'
  })
  const [endTime, setEndTime] = useState(() => {
    if (isEdit && event.end?.dateTime) return format(parseISO(event.end.dateTime), 'HH:mm')
    return '10:00'
  })
  const [description, setDescription] = useState(isEdit ? event.description || '' : '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const payload = {
        summary: title,
        description,
        start: allDay ? { date } : { dateTime: `${date}T${startTime}:00`, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: allDay ? { date } : { dateTime: `${date}T${endTime}:00`, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      }
      await onSave(payload)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('このイベントを削除しますか？')) return
    setSaving(true)
    try {
      await onDelete(event.id)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{isEdit ? 'イベントを編集' : 'イベントを追加'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.titleInput}
            type="text"
            placeholder="タイトル"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            required
          />
          <label className={styles.checkLabel}>
            <input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} />
            終日
          </label>
          <div className={styles.row}>
            <label className={styles.label}>日付
              <input type="date" className={styles.input} value={date} onChange={e => setDate(e.target.value)} required />
            </label>
          </div>
          {!allDay && (
            <div className={styles.row}>
              <label className={styles.label}>開始
                <input type="time" className={styles.input} value={startTime} onChange={e => setStartTime(e.target.value)} />
              </label>
              <label className={styles.label}>終了
                <input type="time" className={styles.input} value={endTime} onChange={e => setEndTime(e.target.value)} />
              </label>
            </div>
          )}
          <textarea
            className={styles.desc}
            placeholder="メモ（任意）"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
          <div className={styles.actions}>
            {isEdit && (
              <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={saving}>
                削除
              </button>
            )}
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
