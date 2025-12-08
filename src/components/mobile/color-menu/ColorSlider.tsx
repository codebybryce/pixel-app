import { allColors } from '../../../utils/colors'
import { useGlobalStore } from '../../../store/useGlobalStore'
import { useState, useEffect } from 'react'
import style from './colorSlider.module.css'
import Button from '../../button/Button'
type ColorSliderProps = {
  colorModalOpen: boolean,

}

/**
 * Color SLider is a mobile only component
 * (O,O,O,O,O)
 */
const ColorSlider: React.FC<ColorSliderProps> = ({ colorModalOpen = false }) => {
  const [colorsInMemory, setColorsInMemory] = useState([])

  // const [colorModalOpen, setColorModalOpen] = useState(colorModalOpen || false)

  useEffect(() => {
    const colors = localStorage.getItem('colorsInMemory');
  }, [])

  const currColor = useGlobalStore((s) => s.currColor);
  const setCurrColor = useGlobalStore((s) => s.setCurrColor);
  function handleColorSelected(color) {
    setCurrColor(color)
  }


  return (

    <>
      <div className={style.colorSlider}>
        <div className={style.colorContext}>
          <div className={style.colorContainer}>
            {allColors.map((c) => <><div className={style.colorSwatch} style={{ backgroundColor: c }} onClick={() => handleColorSelected(c)} /></>)}
          </div>
        </div>
      </div>
    </>

  )
}

export default ColorSlider