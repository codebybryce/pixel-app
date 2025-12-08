import Button from "../button/Button";
import MenuBarMobile from "./menu-bar/MenuBarMobile";
import MobilePixelGrid from "./pixel-grid/mobilePixelGrid";
import MobileToolBar from "./tool-bar/MobileToolBar";
import ToolSelectorRotary from "./tool-selector-rotary/ToolSelectorRotary";
export default function MobileApp() {
  return (<>
    <body>
      <nav>
        <MenuBarMobile />
      </nav>
      <main>
        <MobilePixelGrid columns={8} rows={8} />
        <MobileToolBar />
      </main>
    </body>

  </>)
}