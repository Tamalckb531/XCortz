"use client";
import { Button } from '../ui/button';
import { Info } from '@/lib/types';

interface props {
    type: "old" | "new";
}

const info:Info = {
    new: {
        text:"I'm Using it First time",
    },
    old: {
        text:"I already have .vault file"
    }
}

const RoutingButton = ({ type }:props) => {
  return (
    <Button>
          { type == "new" ? info.new.text: info.old.text}      
    </Button>
  )
}

export default RoutingButton