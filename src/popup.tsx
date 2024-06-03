import { useState, type MouseEventHandler, type ReactEventHandler } from "react"
import ReactSlider from "react-slider"
import styled from "styled-components"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledThumb = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #15d1c8;
  cursor: grab;
  outline: none;
  box-shadow: none;
  text-align: center;
`

const Thumb = (props: any, state: any) => (
  <StyledThumb {...props}>{}</StyledThumb>
)

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: #414141;
  border-radius: 999px;
`
const Track = (props: any, state: any) => (
  <StyledTrack {...props} index={state.index} />
)

function IndexPopup() {
  const [overlayOpacity, setOverlayOpacity] = useState(75)

  const captureBoxIconHandler: MouseEventHandler<HTMLDivElement> = async (
    e: any
  ) => {
    const resp = await sendToContentScript({
      name: "capture-box",
      body: { isActive: true }
    })
  }

  const overlayOpacityHandler: any = async (value: number) => {
    const resp = await sendToContentScript({
      name: "overlay",
      body: { opaccity: value }
    })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        width: "200px",
        textAlign: "center"
      }}>
      <h2>Welcome to</h2>
      <span
        style={{
          color: "#15d1c8",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          margin: "10px 0px"
        }}>
        FocusFrameCanvas Extension!
      </span>
      <div
        title="Capture Box Tool"
        style={{ cursor: "pointer" }}
        onClick={captureBoxIconHandler}>
        <svg
          viewBox="0 0 1000 1000"
          style={{ width: "50ox", height: "50px" }}
          id="ffc-capture-box-icon">
          <path d="M10 431h980v138.1H10V431zM162.1 323.8H24V12.9h362.6V151H162.1v172.8zM976 323.8H837.9V151H613.4V12.9H976v310.9zM386.6 987.1H24V676.2h138.1V849h224.5v138.1zM976 987.1H613.4V849h224.5V676.2H976v310.9z"></path>
        </svg>
      </div>
      <div
        className="ffc-content"
        style={{ margin: "20px 0px" }}
        title="Control Overlay Opacity">
        <StyledSlider
          className="horizontal-slider"
          renderTrack={Track}
          renderThumb={Thumb}
          min={0}
          max={100}
          value={overlayOpacity}
          onChange={overlayOpacityHandler}
        />
      </div>
      <footer>Crafted by @PlasmoHQ</footer>
    </div>
  )
}

export default IndexPopup
