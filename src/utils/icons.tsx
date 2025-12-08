import { HiMenuAlt2 } from "react-icons/hi";
import { IoIosColorPalette } from "react-icons/io";
import { BsEraserFill } from "react-icons/bs";
import { FaChevronDown, FaPencilAlt, FaFillDrip, FaSlash, FaRegCircle, FaEyeDropper, FaUndo, FaRedo, FaRegSquare, FaBorderNone, FaMousePointer, FaPaste, FaUserAstronaut } from "react-icons/fa";
import { FiPlus, FiFolder, FiSave, FiDownload, FiCopy, FiScissors, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { SiBlender } from 'react-icons/si';
import { AiOutlineFileImage, AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai';
import { FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';
import { MdViewCarousel } from 'react-icons/md';
import { MdOutlineSaveAs } from "react-icons/md";
import { MdRefresh } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { MdInfo } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";


export const ICON_MAP = {
  MENU: <MdOutlineMenu />,
  PALETTE: <IoIosColorPalette />,
  ERASER: <BsEraserFill />,
  PENCIL: <FaPencilAlt />,
  FILL: <FaFillDrip />,
  LINE: <FaSlash />,
  RECTANGLE: <FaRegSquare />,
  CIRCLE: <FaRegCircle />,
  PICKER: <FaEyeDropper />,
  UNDO: <FaUndo />,
  REDO: <FaRedo />,
  SELECT: <FaMousePointer />,
  PASTE: <FaPaste />,
  CLEAR: <FaBorderNone />,
  USER: <FaUserAstronaut />,
  CARAT: <FaChevronDown />,
  NEW: <FiPlus />,
  OPEN: <FiFolder />,
  SAVE: <FiSave />,
  EXPORT_PNG: <AiOutlineFileImage />,
  EXPORT_STL: <SiBlender />,        // use Blender icon for STL/export if you prefer a generic export icon change to FiDownload
  EXPORT_BLENDER: <SiBlender />,
  CUT: <FiScissors />,
  COPY: <FiCopy />,
  ZOOM_IN: <FiZoomIn />,
  ZOOM_OUT: <FiZoomOut />,
  FLIP_HORIZONTAL: <FaArrowsAltH />,
  FLIP_VERTICAL: <FaArrowsAltV />,
  ROTATE_LEFT: <AiOutlineRotateLeft />,
  ROTATE_RIGHT: <AiOutlineRotateRight />,
  FRAMES: <MdViewCarousel />,
  DOCUMENTATION: <HiDocumentText />,
  ABOUT: <MdInfo />,
  CLOSE: <IoMdClose />
};