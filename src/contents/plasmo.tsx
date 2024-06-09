import "@plasmohq/messaging"

import { useEffect, useState } from "react"

import { useMessage } from "@plasmohq/messaging/hook"

class FocusFrameCanvasExtension {
  private isMouseDown = false
  private mouseDownCoords = { x: 0, y: 0 }
  private overLayHeight: number
  private overlayElement: HTMLElement
  captureBoxElement: HTMLElement
  private captureBoxElementButton: HTMLElement
  private captureBoxElementCloseButton: HTMLElement

  // constructor(private readonly isCaptureBoxActive: boolean) {}

  bootstrap() {
    this.overLayHeight = this.getMainArticleHeight()
    this.overlayElement = this.createOverlayElement()
    this.captureBoxElement = this.createCaptureBoxElement()
    this.captureBoxElementButton = this.createCaptureBoxButtonElement()
    this.captureBoxElementCloseButton =
      this.createCaptureBoxCloseButtonElement()

    document.body.appendChild(this.captureBoxElement)
    this.captureBoxElement.appendChild(this.captureBoxElementCloseButton)
    this.captureBoxElement.appendChild(this.captureBoxElementButton)

    this.captureBoxElementButton.addEventListener("click", () => {
      this.captureBoxElement.style.height = `${this.overLayHeight - window.scrollY}px`
      this.applyClipPath()
    })

    this.captureBoxElementCloseButton.addEventListener("click", () => {
      this.unbootstrap()
    })

    document.addEventListener("mousedown", this.mousedownHandler)
    document.addEventListener("mousemove", this.mousemoveHandler)
    document.addEventListener("mouseup", this.mouseupHandler)
  }

  unbootstrap() {
    this.isMouseDown = false
    this.mouseDownCoords = { x: 0, y: 0 }
    this.captureBoxElement.remove()
    this.overlayElement.remove()

    document.removeEventListener("mousedown", this.mousedownHandler)
    document.removeEventListener("mousemove", this.mousemoveHandler)
    document.removeEventListener("mouseup", this.mouseupHandler)
  }

  mouseupHandler = (e: any) => {
    this.isMouseDown = false
    document.body.appendChild(this.overlayElement)
    this.applyClipPath()
  }

  mousedownHandler = (e: any) => {
    e.preventDefault()
    this.isMouseDown = true
    this.mouseDownCoords.x = e.pageX
    this.mouseDownCoords.y = e.pageY
  }

  mousemoveHandler = (e: any) => {
    if (this.isMouseDown) {
      this.calculateCaptureBoxSize(this.mouseDownCoords, {
        x: e.pageX,
        y: e.pageY
      })
    }
  }

  getMainArticleHeight = (): number => {
    const mainElement = document.querySelector("main")
    const articleElement = document.querySelector("article")

    if (!mainElement && !articleElement)
      console.log("main or article not found")

    const height = getComputedStyle(
      articleElement || mainElement
    ).getPropertyValue("height")
    return Number(height.replace("px", ""))
  }

  createOverlayElement = (): HTMLElement => {
    const overlay: HTMLElement = document.createElement("div")
    overlay.className = "overlay"
    overlay.style.position = "absolute"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.width = "100%"
    overlay.style.height = `${this.overLayHeight}px`
    overlay.style.backgroundColor = "rgba(70, 70, 70, 0.95)"
    overlay.style.pointerEvents = "none"
    overlay.style.zIndex = "1000"
    return overlay
  }

  createCaptureBoxElement = (): HTMLElement => {
    const captureBox: HTMLElement = document.createElement("div")
    captureBox.className = "capture-box"
    captureBox.style.position = "absolute"
    captureBox.style.border = "3px dashed #781e1e"
    captureBox.style.borderBottom = "3px solid #781e1e"
    captureBox.style.zIndex = "99999"
    captureBox.style.backgroundColor = "transparent"
    captureBox.style.display = "flex"
    captureBox.style.alignItems = "end"
    captureBox.style.justifyContent = "center"
    return captureBox
  }

  createCaptureBoxButtonElement = (): HTMLElement => {
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

  createCaptureBoxCloseButtonElement = (): HTMLElement => {
    const captureBoxElementButton: HTMLElement = document.createElement("div")
    captureBoxElementButton.className = "capture-box-close-btn"
    captureBoxElementButton.style.position = "absolute"
    captureBoxElementButton.style.top = "0px"
    captureBoxElementButton.style.width = "55px"
    captureBoxElementButton.style.height = "25px"
    captureBoxElementButton.style.backgroundColor = "#781e1e"
    captureBoxElementButton.style.cursor = "pointer"
    captureBoxElementButton.style.transform = "translateY(-50%)"
    captureBoxElementButton.style.transition = "0.2s ease-in-out"
    captureBoxElementButton.textContent = "Close"
    captureBoxElementButton.style.fontSize = "15px"
    captureBoxElementButton.style.color = "#fff"
    captureBoxElementButton.style.textAlign = "center"

    return captureBoxElementButton
  }

  calculateCaptureBoxSize = (mouseDownCoords: any, mouseUpCoords: any) => {
    const width = Math.abs(mouseDownCoords.x - mouseUpCoords.x)
    const height = Math.abs(mouseDownCoords.y - mouseUpCoords.y)

    this.captureBoxElement.style.width = `${width}px`
    this.captureBoxElement.style.height = `${height}px`
    this.captureBoxElement.style.left = `${mouseDownCoords.x}px`
    this.captureBoxElement.style.top = `${mouseDownCoords.y}px`
  }

  applyClipPath = () => {
    const rect = this.captureBoxElement.getBoundingClientRect()

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
    this.overlayElement.style.clipPath = clipPath
  }
}

const ffsCanvas = new FocusFrameCanvasExtension()

const QueryTextAnywhere = () => {
  useMessage<string, string>(async (req, res) => {
    console.log("FocusFrameCanvas - Extension Loaded")
    const captureBoxExits = document.querySelector(".capture-box")
    if (!captureBoxExits) {
      ffsCanvas.bootstrap()
    }
  })
  return <></>
}

export default QueryTextAnywhere
