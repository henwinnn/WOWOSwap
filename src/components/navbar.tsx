"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, ChevronDown, Check, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Simulate connecting to MetaMask
  const connectWallet = async () => {
    // Simulate a loading state
    const button = document.getElementById("connect-button")
    if (button) {
      button.innerText = "Connecting..."
    }

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a random Ethereum address
    const randomAddress = "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")

    setAccount(randomAddress)
    setIsConnected(true)
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false)
    setAccount("")
    setIsDropdownOpen(false)
  }

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${
        isScrolled ? "py-2 bg-black/80 backdrop-blur-md" : "py-4 bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <span className="text-white font-bold text-xl tracking-tight">WOWOswap</span>
        </motion.div>

        {/* Connect Wallet Button */}
        {!isConnected ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              id="connect-button"
              onClick={connectWallet}
              className="bg-white text-black hover:bg-gray-200 rounded-xl px-4 py-2 h-10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              <motion.div
                className="flex items-center"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </motion.div>
            </Button>
          </motion.div>
        ) : (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl px-4 py-2 flex items-center border border-gray-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="mr-2">{formatAddress(account)}</span>
                <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white rounded-xl overflow-hidden min-w-[200px]">
              <div className="px-3 py-2 text-sm text-gray-400">Connected Wallet</div>
              <DropdownMenuItem className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-700">
                <Check className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">{formatAddress(account)}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-700 text-red-400"
                onClick={disconnectWallet}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.nav>
  )
}

