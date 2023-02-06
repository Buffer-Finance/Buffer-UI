import { useEffect } from 'react'
import useTimeout from './useTimeout'

export default function useDebouncedEffect(callback, delay, dependencies) {
  const { reset, clear } = useTimeout(callback, delay)
  useEffect(reset, [...dependencies, reset])
  useEffect(clear, [])
}
