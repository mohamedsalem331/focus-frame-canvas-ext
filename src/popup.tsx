import logo from "data-base64:assets/logo.png"
import styleText from "data-text:/style.css"
import { useState, type MouseEventHandler, type ReactEventHandler } from "react"

import { sendToContentScript } from "@plasmohq/messaging"

function IndexPopup() {
  const captureBoxIconHandler: MouseEventHandler<HTMLDivElement> = async () => {
    await sendToContentScript({
      name: "capture-box"
    })
  }

  return (
    <>
      <style>{`body { margin: 0; }`}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px",
          width: "200px",
          textAlign: "center",
          backgroundColor: "#f0f0f0"
        }}>
        <div className="logo-wrapper" style={{ marginTop: "10px" }}>
          <img width="180rem" src={logo} alt="Some pretty cool image" />
        </div>
        <div
          title="Capture Box Tool"
          style={{ cursor: "pointer", margin: "20px 0px" }}
          onClick={captureBoxIconHandler}>
          <svg
            viewBox="0 0 1000 1000"
            style={{
              width: "50px",
              height: "50px"
            }}
            id="ffc-capture-box-icon">
            <path d="M10 431h980v138.1H10V431zM162.1 323.8H24V12.9h362.6V151H162.1v172.8zM976 323.8H837.9V151H613.4V12.9H976v310.9zM386.6 987.1H24V676.2h138.1V849h224.5v138.1zM976 987.1H613.4V849h224.5V676.2H976v310.9z"></path>
          </svg>
        </div>
      </div>
      <footer
        style={{
          borderRadius: "0 20px 10px 10px",
          backgroundColor: "#333",
          color: "white",
          textAlign: "center",
          padding: "1rem",
          marginTop: "0"
        }}>
        Made by{" "}
        <a
          href="https://github.com/mohamedsalem331"
          style={{ color: "#15d1c8", textDecorationLine: "underline" }}
          target="_blank">
          Mohamed Salem
        </a>
      </footer>
    </>
  )
}

export default IndexPopup
