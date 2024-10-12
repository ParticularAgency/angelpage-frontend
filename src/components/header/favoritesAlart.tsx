import { FavoriteIcon } from '@/icons'
import Link from 'next/link'
import React from 'react'

const FavoritesAlart = () => {
  return (
    <div className="user-saveitem flex items-center sm:hidden">
                <Link href="/favorite"><FavoriteIcon/></Link>
              </div>
  )
}

export default FavoritesAlart
