import { useEffect, useState } from 'react'
import { ActionableModal } from '../components/ui'
import { enterEditMode } from './authFlow'

interface Props {
  previewError?: string
}

export const OpenAuthoringModalContainer = ({ previewError }: Props) => {
  const [authPopupDisplayed, setAuthPopupDisplayed] = useState(false)
  const [statefulPreviewError, setStatefulPreviewError] = useState(previewError)
  const refreshPage = () => {
    fetch(`/api/reset-preview`).then(() => {
      window.location.href = '/?autoAuth'
    })
  }

  const cancelAuth = () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.href.split('?')[0] //TODO - remove only autoAuth param
    )
    setAuthPopupDisplayed(false)
  }

  useEffect(() => {
    addEventListener('openAuthSaveError', e => {
      setStatefulPreviewError(
        "Failed to save data."
      )
    })
    
    if (window.location.href.includes('autoAuth')) {
      setAuthPopupDisplayed(true)
    }
  }, [])

  return (
    <>
      {authPopupDisplayed && (
        <ActionableModal
          title="Authentication"
          message="To edit this site, you first need to be authenticated."
          actions={[
            {
              name: 'Continue',
              action: enterEditMode,
            },
            {
              name: 'Cancel',
              action: cancelAuth,
            },
          ]}
        />
      )}
      {statefulPreviewError && (
        <ActionableModal
          title="Error"
          message={statefulPreviewError}
          actions={[
            {
              name: 'Continue',
              action: refreshPage,
            },
          ]}
        />
      )}
    </>
  )
}
