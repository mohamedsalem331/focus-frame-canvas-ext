import "@plasmohq/messaging"

import { useState } from "react"

import { useMessage } from "@plasmohq/messaging/hook"

const QueryTextAnywhere = () => {
  const [isCaptureBoxActive, setCaptureBoxActive] = useState<boolean>(true)
  useMessage<string, string>(async (req, res) => {
    console.log("FocusFrameCanvas - Plasmo Extension Loaded")
    console.log("vvv")

    const body: any = req.body
    setCaptureBoxActive(body.isActive)

    ffsHandler(isCaptureBoxActive)
  })
  return <> </>
}

export default QueryTextAnywhere

const ffsHandler = (isCaptureBoxActive: boolean) => {
  let isMouseDown = false
  const mouseDownCoords = { x: 0, y: 0 }
  const getMainArticleSection = (): string => {
    const mainElement = document.querySelector("main")
    const articleElement = document.querySelector("article")
    if (!mainElement && !articleElement)
      console.log("main or article not found")
    return getComputedStyle(articleElement || mainElement).getPropertyValue(
      "height"
    )
  }

  const overLayHeight = getMainArticleSection()

  const createOverlayElement = () => {
    const overlay: HTMLElement = document.createElement("div")
    overlay.className = "overlay"
    overlay.style.position = "absolute"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = `${overLayHeight}`
    overlay.style.backgroundColor = "rgba(65, 65, 65, 0.79)"
    overlay.style.pointerEvents = "none"
    overlay.style.zIndex = "1000"
    return overlay
  }

  const createCaptureBoxElement = () => {
    const captureBox: HTMLElement = document.createElement("div")
    captureBox.className = "capture-box"
    captureBox.style.position = "absolute"
    captureBox.style.border = "3px dashed #781e1e"
    captureBox.style.borderBottom = "3px solid #781e1e"
    captureBox.style.zIndex = "99999"
    captureBox.style.backgroundColor = "transparent"
    captureBox.style.display = "none"
    captureBox.style.alignItems = "end"
    captureBox.style.justifyContent = "center"
    return captureBox
  }

  const createCaptureBoxButtonElement = () => {
    const captureBoxElementButton: HTMLElement = document.createElement("div")
    captureBoxElementButton.className = "capture-box-extend-btn"
    captureBoxElementButton.style.position = "relative"
    captureBoxElementButton.style.borderLeft = "50px solid transparent"
    captureBoxElementButton.style.borderRight = "50px solid transparent"
    captureBoxElementButton.style.borderTop = "15px solid #781e1e"
    captureBoxElementButton.style.cursor = "pointer"
    captureBoxElementButton.style.transform = "translateY(100%)"
    captureBoxElementButton.style.transition = "0.2s ease-in-out"

    return captureBoxElementButton
  }

  const overlayElement = createOverlayElement()
  const captureBoxElement = createCaptureBoxElement()
  const captureBoxElementButton = createCaptureBoxButtonElement()

  if (isCaptureBoxActive) {
    captureBoxElement.style.display = "flex"
  } else {
    captureBoxElement.style.display = "none"
  }
  //
  // .capture-box-extend-btn:hover {
  //   transform: translateY(130%);
  // }

  captureBoxElement.appendChild(captureBoxElementButton)
  document.body.appendChild(captureBoxElement)

  captureBoxElementButton.addEventListener("click", function () {
    if (isCaptureBoxActive) {
      captureBoxElement.style.height = `${overLayHeight}`
      applyClipPath()
    }
  })

  document.addEventListener("mousedown", function handleMouseDown(e) {
    if (isCaptureBoxActive) {
      e.preventDefault()
      isMouseDown = true
      mouseDownCoords.x = e.pageX
      mouseDownCoords.y = e.pageY
    }
  })

  document.addEventListener("mouseup", function handleMouseUp(e) {
    if (isCaptureBoxActive) {
      isMouseDown = false
      document.body.appendChild(overlayElement)
      applyClipPath()
    }
  })

  document.addEventListener("mousemove", function handleMouseMove(e) {
    if (isCaptureBoxActive) {
      if (isMouseDown) {
        calculateCaptureBoxSize(mouseDownCoords, { x: e.pageX, y: e.pageY })
      }
    }
  })

  const calculateCaptureBoxSize = (
    mouseDownCoords: any,
    mouseUpCoords: any
  ) => {
    const width = Math.abs(mouseDownCoords.x - mouseUpCoords.x)
    const height = Math.abs(mouseDownCoords.y - mouseUpCoords.y)

    captureBoxElement.style.width = `${width}px`
    captureBoxElement.style.height = `${height}px`
    captureBoxElement.style.left = `${mouseDownCoords.x}px`
    captureBoxElement.style.top = `${mouseDownCoords.y}px`
  }

  const applyClipPath = () => {
    const rect = captureBoxElement.getBoundingClientRect()

    const clipPath = `polygon(
  0% 0%,
  100% 0%,
  100% 100%,
  0% 100%,
  0% 0%,
  ${rect.left}px ${window.scrollY + rect.top}px,
  ${rect.left}px ${window.scrollY + rect.bottom}px,
  ${rect.right}px ${window.scrollY + rect.bottom}px,
  ${rect.right}px ${window.scrollY + rect.top}px,
  ${rect.left}px ${window.scrollY + rect.top}px
)`
    overlayElement.style.clipPath = clipPath
  }
}
