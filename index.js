import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

const greetingText = document.getElementById("greetingText")
const greetings = [
    "Hello there!",
    "Thank you for visiting!",
    "How is your day",
    "Welcome!",
]

function changeGreeting() {
    const randomIndex = Math.floor(Math.random() * greetings.length)
    greetingText.textContent = greetings[randomIndex]
}
setInterval(changeGreeting, 5000)

function showMessage(message) {
    let delay = 2000
    document.getElementById("messageArea").innerHTML = message

    setTimeout(() => {
        document.getElementById("messageArea").innerHTML = ""
    }, delay)
}

function showMessages(messages, index = 0, delay = 2000) {
    if (index < messages.length) {
        showMessage(messages[index])

        setTimeout(() => {
            showMessages(messages, index + 1, delay)
        }, delay)
    }
}

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
        } catch (error) {
            console.log(error)
        }
    }
}
