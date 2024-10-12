import { NotificationIcon } from '@/icons'
import React from 'react'

const NotificationAlart = () => {
  return (
    <div className="notification-alart-box flex items-cente sm:hidden">
    <button className="alart-btn" onClick={() => console.log('Should not click')}><NotificationIcon/></button>
    <div className="alart-dropdown-screen"></div>
     </div>
  )
}

export default NotificationAlart
