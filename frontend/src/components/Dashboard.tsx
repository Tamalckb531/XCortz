import PasswordTable from "./DashboardComp/PasswordTable"
import { Button } from "./ui/button"

const Dashboard = () => {
  return (
    <div className="max-w-100 h-full flex flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between">
            <span>Your All Passwords: </span>      
            <Button>Add</Button>
        </div>
        <PasswordTable/>
    </div>
  )
}

export default Dashboard