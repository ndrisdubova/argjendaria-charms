import { useCallback, useEffect, useState } from 'react'
import { loadInquiries, saveInquiries, subscribe, makeId } from '../data/inquiriesStore'

export function useInquiries() {
  const [inquiries, setInquiries] = useState(() => loadInquiries())

  useEffect(() => subscribe(() => setInquiries(loadInquiries())), [])

  const addInquiry = useCallback((inquiry) => {
    const next = [
      ...loadInquiries(),
      { ...inquiry, id: makeId(), createdAt: new Date().toISOString(), read: false },
    ]
    saveInquiries(next)
  }, [])

  const markRead = useCallback((id) => {
    const next = loadInquiries().map((i) => (i.id === id ? { ...i, read: true } : i))
    saveInquiries(next)
  }, [])

  const deleteInquiry = useCallback((id) => {
    const next = loadInquiries().filter((i) => i.id !== id)
    saveInquiries(next)
  }, [])

  const unreadCount = inquiries.filter((i) => !i.read).length

  return { inquiries, addInquiry, markRead, deleteInquiry, unreadCount }
}
