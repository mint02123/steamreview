import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { useAuth } from './AuthContext'
import { API_BASE_URL } from '../config'

const SavedReviewsContext = createContext(null)

function mapApiSavedReview(item) {
  const review = {
    id: item.review_id,
    reviewId: item.review_id,
    txtFileName: item.txt_file_name,
    reviewer: item.reviewer || 'Steam User',
    category: item.category || 'other',
    text: item.text || '',
    summary: item.summary || '',
    developerValue: item.developer_value || '',
    actionHint: item.action_hint || '',
    createdAt: item.saved_at,
    helpful: 0,
    funny: 0,
    playHours: 0,
    usefulnessScore: 0,
    reviewScore: 0,
    relevanceScore: 0,
    sentiment: 'positive',
    evidenceLevel: 'partial',
    patchRelated: true,
    purchaseType: 'paid',
    language: 'en',
  }

  return {
    dbId: item.id,
    review,
    savedAt: item.saved_at,
    note: item.memo || '',
    status: item.status || 'pending',
  }
}

function buildCreatePayload(review) {
  return {
    review_id: review.id,
    txt_file_name: review.txtFileName || review.txt_file_name || review.reviewId || '',
    reviewer: review.reviewer || 'Steam User',
    category: review.category || 'other',
    text: review.text || '',
    summary: review.summary || '',
    developer_value: review.developerValue || review.developer_value || '',
    action_hint: review.actionHint || review.action_hint || '',
    status: 'pending',
    memo: '',
  }
}

export function SavedReviewsProvider({ children }) {
  const { token, isAuthenticated } = useAuth()

  const [saved, setSaved] = useState({})
  const [loading, setLoading] = useState(false)

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token])

  const loadSavedReviews = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setSaved({})
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load saved reviews: ${response.status}`)
      }

      const data = await response.json()

      const next = {}
      data.forEach(item => {
        const entry = mapApiSavedReview(item)
        next[entry.review.id] = entry
      })

      setSaved(next)
    } catch (error) {
      console.warn('Failed to load saved reviews.', error)
      setSaved({})
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    loadSavedReviews()
  }, [loadSavedReviews])

  const toggleSave = useCallback(async review => {
    if (!token || !isAuthenticated) {
      alert('로그인 후 리뷰를 저장할 수 있습니다.')
      return
    }

    const current = saved[review.id]

    if (current?.dbId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/saved-reviews/${current.dbId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to delete saved review: ${response.status}`)
        }

        setSaved(prev => {
          const next = { ...prev }
          delete next[review.id]
          return next
        })
      } catch (error) {
        console.warn('Failed to delete saved review.', error)
      }

      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-reviews`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(buildCreatePayload(review)),
      })

      if (!response.ok) {
        throw new Error(`Failed to save review: ${response.status}`)
      }

      const data = await response.json()
      const entry = mapApiSavedReview(data)

      setSaved(prev => ({
        ...prev,
        [entry.review.id]: entry,
      }))
    } catch (error) {
      console.warn('Failed to save review.', error)
    }
  }, [token, isAuthenticated, saved, authHeaders])

  const updateNote = useCallback(async (reviewId, note) => {
    const current = saved[reviewId]

    if (!token || !current?.dbId) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-reviews/${current.dbId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ memo: note }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update memo: ${response.status}`)
      }

      const data = await response.json()
      const entry = mapApiSavedReview(data)

      setSaved(prev => ({
        ...prev,
        [entry.review.id]: entry,
      }))
    } catch (error) {
      console.warn('Failed to update memo.', error)
    }
  }, [token, saved, authHeaders])

  const updateStatus = useCallback(async (reviewId, status) => {
    const current = saved[reviewId]

    if (!token || !current?.dbId) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/saved-reviews/${current.dbId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: status || 'pending' }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`)
      }

      const data = await response.json()
      const entry = mapApiSavedReview(data)

      setSaved(prev => ({
        ...prev,
        [entry.review.id]: entry,
      }))
    } catch (error) {
      console.warn('Failed to update status.', error)
    }
  }, [token, saved, authHeaders])

  const isSaved = useCallback(reviewId => Boolean(saved[reviewId]), [saved])

  return (
    <SavedReviewsContext.Provider
      value={{
        saved,
        loading,
        toggleSave,
        updateNote,
        updateStatus,
        isSaved,
        reloadSavedReviews: loadSavedReviews,
      }}
    >
      {children}
    </SavedReviewsContext.Provider>
  )
}

export function useSavedReviews() {
  return useContext(SavedReviewsContext)
}