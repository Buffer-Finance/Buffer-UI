import { useState, useEffect, Children } from 'react'
import Background from './style'

interface ICard {
  style?: string
  children: React.ReactChild
}

const Card: React.FC<ICard> = ({ style, children }) => {
  return (
    <Background>
      <div className={`${style} card`}>{Children}</div>
    </Background>
  )
}

export default Card
