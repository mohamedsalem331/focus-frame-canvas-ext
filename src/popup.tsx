import logo from "data-base64:assets/logo.png"
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
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #15d1c8;
  cursor: grab;
  outline: none;
  box-shadow: none;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  color: #fff;
`

const Thumb = (props: any, state: any) => (
  <StyledThumb {...props}>{state.valueNow}</StyledThumb>
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
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75)
  const [isCaptureBoxActive, setIsCaptureBoxActive] = useState<boolean>(false)

  const captureBoxIconHandler: MouseEventHandler<HTMLDivElement> = async () => {
    setIsCaptureBoxActive(!isCaptureBoxActive)

    await sendToContentScript({
      name: "capture-box",
      body: { isActive: isCaptureBoxActive, overlayOpacity }
    })
  }

  const overlayOpacityHandler: any = async (value: number) => {
    setOverlayOpacity(value)
    await sendToContentScript({
      name: "overlay",
      body: { overlayOpacity: value }
    })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
        width: "200px",
        textAlign: "center"
      }}>
      <div
        className="logo-wrapper"
        style={{ marginTop: "10px", marginBottom: "20px" }}>
        <img width="180rem" src={logo} alt="Some pretty cool image" />
      </div>
      <div
        title="Capture Box Tool"
        style={{ cursor: "pointer" }}
        onClick={captureBoxIconHandler}>
        {isCaptureBoxActive ? (
          <svg
            fill="#000000"
            height="50px"
            width="50px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 460.775 460.775">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>{" "}
            </g>
          </svg>
        ) : (
          <svg
            viewBox="0 0 1000 1000"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#15d1c8"
            }}
            id="ffc-capture-box-icon">
            <path d="M10 431h980v138.1H10V431zM162.1 323.8H24V12.9h362.6V151H162.1v172.8zM976 323.8H837.9V151H613.4V12.9H976v310.9zM386.6 987.1H24V676.2h138.1V849h224.5v138.1zM976 987.1H613.4V849h224.5V676.2H976v310.9z"></path>
          </svg>
        )}
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
          ariaLabel="Fdsfds"
          onChange={overlayOpacityHandler}
        />
      </div>
      <footer
        style={{
          backgroundColor: "#333",
          color: "white",
          textAlign: "center",
          padding: "1rem"
        }}>
        Made by{" "}
        <a
          href="https://github.com/mohamedsalem331"
          style={{ color: "#15d1c8", textDecorationLine: "underline" }}
          target="_blank">
          Mohamed Salem
        </a>
      </footer>
    </div>
  )
}

export default IndexPopup
