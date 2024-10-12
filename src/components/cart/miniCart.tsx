import { CartIcon, CloseIcon } from '@/icons'
import React from 'react'

const MiniCart = () => {
  return (
   <div className="cart-box flex items-center"> 
                <div className="mini-cart-offcanvas">
                <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" /> 
                <div className="drawer-content">
                  <label htmlFor="my-drawer-4" className="drawer-button btn !bg-transparent !p-0 !border-none"><CartIcon/></label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                  <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full w-80 px-6 pb-8 pt-0">
                    <div className="offcanvas-head flex justify-end pb-5 pt-4 text-right">
                         <label htmlFor="my-drawer-4" aria-label="close sidebar" className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"><CloseIcon /></label>
                    </div>
                   <div className="offcanvas-main min-h-full my-auto">
                       <div className="cart-canvas-area min-h-full">
                        <div className="empty-cart-massage">
                          <p className='font-secondary font-medium text-body-caption text-center text-mono-100'>Cart is empty</p>
                        </div>
                       </div>
                   </div>
                  </div>
                </div>
              </div> 
              </div>
              </div>
  )
}

export default MiniCart
