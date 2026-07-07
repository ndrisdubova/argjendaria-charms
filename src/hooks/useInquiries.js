import { useCallback, useEffect, useState } from 'react'
import { loadInquiries, addInquiry as addInquiryApi, markRead as markReadApi, deleteInquiry as deleteInquiryApi, subscribe } from '../data/inquiriesStore'

export function useInquiries() {
  const [inquiries, setInquiries] = useState([])

  const refresh = useCallback(() => {
    loadInquiries().then(setInquiries)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const addInquiry = useCallback((inquiry) => addInquiryApi(inquiry), [])
  const markRead = useCallback((id) => markReadApi(id), [])
  const deleteInquiry = useCallback((id) => deleteInquiryApi(id), [])

  const unreadCount = inquiries.filter((i) => !i.read).length

  return { inquiries, addInquiry, markRead, deleteInquiry, unreadCount }
}
