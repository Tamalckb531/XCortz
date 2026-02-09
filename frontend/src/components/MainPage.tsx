import React from 'react'
import RoutingButton from './MainPageComp/RoutingButton'
import PasswordGenerator from './MainPageComp/PasswordGenerator'

const MainPage = () => {
  return (
      <div className="p-10">
          {/* Route buttons  */}
          <div className=" flex items-center justify-around mb-10">
              <RoutingButton type='new'/>
              <RoutingButton type='old'/>
          </div>
          {/* Password generator */}
          <div className=" flex items-center justify-center mt-5">
              <PasswordGenerator/>
          </div>
    </div>
  )
}

export default MainPage