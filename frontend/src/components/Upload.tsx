import { Button } from "./ui/button"
import { Input } from "./ui/input"

const Upload = () => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-3'>
        <div className='flex flex-col'>
            <span className='mb-2'>Provide your master key</span>
            <Input/>
        </div>      
        <Button>
            Upload your .vault file 
        </Button>      
        <Button>
            Upload your Pass Key
        </Button>           
        <Button>
            Go to Dashboard
        </Button>           
    </div>
  )
}

export default Upload