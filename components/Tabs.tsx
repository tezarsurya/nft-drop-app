import { MouseEventHandler } from 'react'

interface TabInterface {
  active: boolean
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

const Tab = ({ active, text, onClick, disabled }: TabInterface) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative p-2 ${
        active &&
        'after:content-[" "] font-bold after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-full after:bg-rose-500'
      } text-gray-700 outline-none active:outline-none disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  )
}

export default Tab
