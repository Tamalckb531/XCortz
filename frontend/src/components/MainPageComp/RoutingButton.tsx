"use client";
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Info } from '@/lib/types';

interface props {
    type: "old" | "new";
}

const info:Info = {
    new: {
        text: "I'm Using it First time",
        route:"generate",
    },
    old: {
        text:"I already have .vault file",
        route:"upload",
    }
}

const RoutingButton = ({ type }: props) => {
    const router = useRouter();
    const obj = type == "new" ? info.new : info.old;
  return (
    <Button
      onClick={()=>router.push(obj.route)}>
          {obj.text}      
    </Button>
  )
}

export default RoutingButton