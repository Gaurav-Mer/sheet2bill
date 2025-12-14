
import { createContext, useContext, useState, ReactNode } from 'react'
import { UpgradeModal } from '@/components/UpgradeModal' // Adjust path if needed

type UpgradeModalContextType = {
    triggerUpgrade: (message?: string) => void
    closeUpgrade: () => void
}

const UpgradeModalContext = createContext<UpgradeModalContextType | undefined>(undefined)

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("You've reached the limit for your current plan.")

    const triggerUpgrade = (msg?: string) => {
        if (msg) setMessage(msg)
        setIsOpen(true)
    }

    const closeUpgrade = () => {
        setIsOpen(false)
    }

    return (
        <UpgradeModalContext.Provider value={{ triggerUpgrade, closeUpgrade }}>
            {children}

            {/* The Modal lives here globally */}
            <UpgradeModal
                isOpen={isOpen}
                onClose={closeUpgrade}
                message={message}
            />
        </UpgradeModalContext.Provider>
    )
}

// Custom Hook for easy access
export function useUpgradeModal() {
    const context = useContext(UpgradeModalContext)
    if (context === undefined) {
        throw new Error('useUpgradeModal must be used within an UpgradeModalProvider')
    }
    return context
}