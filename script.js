import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"
import { abi, contractAddress } from "./constants.js"

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

    vct_1.classList.add("rotate_left")
    vct_4.classList.add("rotate_left")

    vct_2.classList.add("rotate_right")
    vct_3.classList.add("rotate_right")

    menu_icon.classList.add("float-in")

    image_4.classList.add("spread")
    bg_image.classList.add("zoom-in")
    crystal.classList.add("zoom-out")

    crystal.addEventListener("animationend", function () {
        crystal.classList.add("glitch")
        light.classList.add("glitch")
        startButton.classList.add("appear")
    })
    setTimeout(function () {
        crystal.classList.add("glitch")
        light.classList.add("glitch")
        startButton.classList.add("appear")
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
})

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const getOwnerButton = document.getElementById("getOwnerButton")
const getFunderButton = document.getElementById("getFunderButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
getOwnerButton.onclick = getOwner
getFunderButton.onclick = trackFunder

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
        showMessages(["Connecting...", "Connected successfully 🦊"])
    } else {
        showMessage("Please install metamask 🦊")
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`Contract current balance`, ethers.formatEther(balance))
        showMessages([
            "Confirming owner process...",
            `The contract current balance is ${ethers.formatEther(balance)}`,
        ])
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
            showMessages(["Funding process initiated!", "Thank you 🦊"])
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            let confirmNum = transactionReceipt.confirmations()
            console.log(`Completed with ${confirmNum} confirmations`)
            resolve()
        })
    })
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            showMessages(["Withdrawing...", "Completed"])
        } catch (error) {
            console.log(error)
        }
    }
}

async function getOwner() {
    let ownerAddress = null
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        ownerAddress = await contract.getOwner()
        console.log(`Owner is... ${ownerAddress}`)
        showMessage("Please check your website console")
    } catch (err) {
        console.log(err)
    }
}

async function trackFunder() {
    const funderIndex = document.getElementById("funderIndex").value
    const funderAddress = await getFunder(funderIndex)
    console.log(`Funder's address: ${funderAddress}`)
    showMessage("Please check your website console")
}

async function getFunder(funderIndex) {
    let funderAddress = null
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        funderAddress = await contract.getFunder(funderIndex)
        return funderAddress
    } catch (err) {
        console.log(err)
    }
}
