import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"
import { abi, contractAddress } from "./constants.js"

document.addEventListener("DOMContentLoaded", function () {
    var menu_icon = document.getElementById("menu-icon")
    var menuOptions = document.getElementById("menu-Options")
    var menuOptionItems = menuOptions.querySelectorAll("li")

    var nft1 = document.getElementById("nft_1")
    var nft2 = document.getElementById("nft_2")
    var nft3 = document.getElementById("nft_3")

    var nft_word = document.getElementById("nft-word")
    var mkp = document.getElementById("mkp")

    nft1.classList.add("float1")
    nft2.classList.add("float2")
    nft3.classList.add("float3")

    nft_word.classList.add("slide-in")
    mkp.classList.add("slide-in")
    menu_icon.classList.add("slide-in")

    menuOptionItems.forEach(function (item, index) {
        item.style.transform = "translateX(-" + (index + 1) * 100 + "%)"
    })

    menu_icon.addEventListener("click", function () {
        if (menuOptions.style.visibility === "visible") {
            menu_icon.classList.remove("turnCCW")
            menu_icon.classList.remove("slide-in")
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
            menu_icon.classList.remove("slide-in")
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
const Fund = document.getElementById("fund")

const popupClose = document.getElementById("popup-close")
const popupContainer = document.getElementById("popup-con")
const overlay = document.getElementById("overlay")

// const balanceButton = document.getElementById("balanceButton")
// const withdrawButton = document.getElementById("withdrawButton")
// const getOwnerButton = document.getElementById("getOwnerButton")
// const getFunderButton = document.getElementById("getFunderButton")

connectButton.onclick = connect
Fund.onclick = fund
// balanceButton.onclick = getBalance
// withdrawButton.onclick = withdraw
// getOwnerButton.onclick = getOwner
// getFunderButton.onclick = trackFunder

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected")
    } else {
        console.log("Please install metamask!")
    }
}

updateBalance()
setInterval(updateBalance, 2000)

updateParticipants()
setInterval(updateParticipants, 2000)

async function updateBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        const formattedBalance = ethers.formatEther(balance)

        document.getElementById("balanceValue").textContent = formattedBalance
    }
}

async function updateParticipants() {
    try {
        if (typeof window.ethereum != "undefined") {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const count = await contract.getFundcount()
            const formattedCount = parseInt(ethers.formatEther(count), 10)

            document.getElementById("fundersAmount").textContent =
                formattedCount
        }
    } catch (error) {
        console.error("Error updating participants:", error)
    }
}

fundButton.addEventListener("click", function () {
    overlay.style.display = "block"
    popupContainer.style.display = "block"
})

popupClose.addEventListener("click", function () {
    overlay.style.display = "none"
    popupContainer.style.display = "none"
})

async function fund() {
    const ethAmount = document.getElementById("eth-input").value
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
            popupContainer.style.display = "none"
            overlay.style.display = "none"
            console.log("Done!")
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

// async function withdraw() {
//     if (typeof window.ethereum != "undefined") {
//         console.log("Withdrawing...")
//         const provider = new ethers.BrowserProvider(window.ethereum)
//         const signer = await provider.getSigner()
//         const contract = new ethers.Contract(contractAddress, abi, signer)
//         try {
//             const transactionResponse = await contract.withdraw()
//             await listenForTransactionMine(transactionResponse, provider)
//             showMessages(["Withdrawing...", "Completed"])
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

// async function getOwner() {
//     let ownerAddress = null
//     try {
//         const provider = new ethers.BrowserProvider(window.ethereum)
//         const signer = await provider.getSigner()
//         const contract = new ethers.Contract(contractAddress, abi, signer)
//         ownerAddress = await contract.getOwner()
//         console.log(`Owner is... ${ownerAddress}`)
//         showMessage("Please check your website console")
//     } catch (err) {
//         console.log(err)
//     }
// }

// async function trackFunder() {
//     const funderIndex = document.getElementById("funderIndex").value
//     const funderAddress = await getFunder(funderIndex)
//     console.log(`Funder's address: ${funderAddress}`)
//     showMessage("Please check your website console")
// }

// async function getFunder(funderIndex) {
//     let funderAddress = null
//     try {
//         const provider = new ethers.BrowserProvider(window.ethereum)
//         const signer = await provider.getSigner()
//         const contract = new ethers.Contract(contractAddress, abi, signer)
//         funderAddress = await contract.getFunder(funderIndex)
//         return funderAddress
//     } catch (err) {
//         console.log(err)
//     }
// }
