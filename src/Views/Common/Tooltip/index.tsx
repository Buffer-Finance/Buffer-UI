import React from 'react'
import Background from './style'
interface CustomTooltip {
  title: string
  children: any
  position: string
  containerClass: string
  theme: string
}
const ReactToolTip: React.FC<CustomTooltip> = ({ title, children, position, containerClass, theme }) => {
  return (
    <Background>
      <div className={`tooltip ${containerClass}`}>
        {children}
        <div className={`tooltiptext ${theme === 'dark' ? `dark` : `light`} tooltip-${position}`}>
          {title}
          <span className="arrow"></span>
        </div>
      </div>
    </Background>
  )
}
ReactToolTip.defaultProps = {
  title: 'sample',
  children: React.createElement('div'),
  position: 'bottom',
  containerClass: '',
  theme: 'light',
}

export default ReactToolTip
