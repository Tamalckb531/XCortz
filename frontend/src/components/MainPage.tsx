import React from 'react'
import RoutingButton from './MainPageComp/RoutingButton'
import PasswordGenerator from './MainPageComp/PasswordGenerator'

const MainPage = () => {
  return (
      <div className="p-10">
          {/* Route buttons  */}
          <div className=" flex items-center justify-around mb-10">
              <RoutingButton/>
              <RoutingButton/>
          </div>
          {/* Password generator */}
          <div className="">
              <PasswordGenerator/>
          </div>
    </div>
  )
}

export default MainPage