import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTokenPrice} from '../../slice/slice'

export function Footer() {
  const tokenPrice = useSelector((state)=> state.counter.tokenPrice)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(setTokenPrice(10))}
        >
          setTokenPrice
        </button>
        <span>{tokenPrice}</span>
      </div>
    </div>
  )
}
export default Footer;