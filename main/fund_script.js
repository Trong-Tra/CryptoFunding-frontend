import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"
import { abi, contractAddress } from "./constants.js"

document.addEventListener("DOMContentLoaded", function () {
    var menu_icon = document.getElementById("menu-icon")
    var menuOptions = document.getElementById("menu-Options")
    var menuOptionItems = menuOptions.querySelectorAll("li")

    var nft1 = document.getElementById("nft_1")
    var nft2 = document.getElementById("nft_2")
    var nft3 = document.getElementById("nft_3")

    nft1.classList.add("float1")
    nft2.classList.add("float2")
    nft3.classList.add("float3")

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
            }, menuOptionItems.length * 113)
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
