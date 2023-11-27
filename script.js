import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"
import { abi, contractAddress } from "./main/constants.js"

document.addEventListener("DOMContentLoaded", function () {
    var bg_image = document.getElementById("bg-image")
    var crystal = document.getElementById("Crystal")
    var image_4 = document.getElementById("line")

    var light = document.getElementById("light")
    var menu_icon = document.getElementById("menu-icon")
    var menuOptions = document.getElementById("menu-Options")
    var menuOptionItems = menuOptions.querySelectorAll("li")

    var vct_1 = document.getElementById("vector1")
    var vct_2 = document.getElementById("vector2")
    var vct_3 = document.getElementById("vector3")
    var vct_4 = document.getElementById("vector4")

    var startButton = document.getElementById("get_start")

    var status = document.getElementById("Status")
    var right_decor = document.getElementById("image-2")

    vct_1.classList.add("rotate_left")
    vct_4.classList.add("rotate_left")

    vct_2.classList.add("rotate_right")
    vct_3.classList.add("rotate_right")

    vct_1.addEventListener("animationend", function () {
        vct_1.classList.add("float1")
        vct_3.classList.add("float1")
        vct_2.classList.add("float2")
        vct_4.classList.add("float2")
    })

    setTimeout(function () {
        vct_1.classList.add("float1")
        vct_3.classList.add("float1")
        vct_2.classList.add("float2")
        vct_4.classList.add("float2")
    }, 5000)

    menu_icon.classList.add("float-in")
    right_decor.classList.add("float-in")

    image_4.classList.add("spread")
    bg_image.classList.add("zoom-in")
    crystal.classList.add("zoom-out")

    crystal.addEventListener("animationend", function () {
        crystal.classList.add("glitch")
        light.classList.add("glitch")
        startButton.classList.add("appear")
        status.classList.add("appear")
    })
    setTimeout(function () {
        crystal.classList.add("glitch")
        light.classList.add("glitch")
        startButton.classList.add("appear")
        status.classList.add("appear")
    }, 1500)

    menuOptionItems.forEach(function (item, index) {
        item.style.transform = "translateX(-" + (index + 1) * 100 + "%)"
    })

    menu_icon.addEventListener("click", function () {
        if (menuOptions.style.visibility === "visible") {
            menu_icon.classList.remove("turnCCW")
            menu_icon.classList.add("turnCW")

            menuOptionItems.forEach(function (item, index) {
                item.style.transition =
                    "transform 0.3s ease " + index * 0.1 + "s"
                item.style.transform = "translateX(-" + (index + 1) * 100 + "%)"
            })

            setTimeout(function () {
                menuOptions.style.visibility = "hidden"
            }, menuOptionItems.length * 120)
        } else {
            menu_icon.classList.remove("turnCW")
            menu_icon.classList.add("turnCCW")

            menuOptions.style.visibility = "visible"

            menuOptionItems.forEach(function (item, index) {
                item.style.transition =
                    "transform 0.3s ease " + index * 0.1 + "s"
                item.style.transform = "translateX(0)"
            })
        }
    })

    const revisit = document.querySelector(".start a")

    revisit.addEventListener("click", function () {
        revisit.style.color = "inherit"
    })
})

const connectButton = document.getElementById("connectButton")
const status = document.getElementById("Status")

connectButton.onclick = connect

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected")
        status.innerHTML = "Status: Connected"
    } else {
        console.log("Please install metamask!")
        status.innerHTML = "Status: Unknown"
    }
}
