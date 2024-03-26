import useTimeout from './useTimeout'
import React, { useState } from 'react'

export const useTimer = (s: number) => {
  const [isComplete, setIsComplete] = useState(false)
  useTimeout(() => setIsComplete(true), s)
  return isComplete
}
