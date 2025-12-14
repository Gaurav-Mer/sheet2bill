'use client'

import { useState } from 'react'
import Link from 'next/link'
import ShowPricingSection from '@/components/pricing/PricingSection'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'

const PricingSection = () => {
    const [showLoginModal, setShowLoginModal] = useState(false)

    return (
        <div id='pricing'>
            {/* The Pricing Section with custom styles for the landing page */}
            <ShowPricingSection
                containerClass='bg-[#f9efe4]  py-12 text-2xl'
                onUpgradeClick={() => setShowLoginModal(true)}
            />

            {/* Login Prompt Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                            <LogIn className="h-6 w-6 text-blue-600" />
                        </div>
                        <DialogTitle className="text-center">Account Required</DialogTitle>
                        <DialogDescription className="text-center">
                            You need to be logged in to purchase a Pro plan. Please sign in or create an account to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowLoginModal(false)} className="">
                            Cancel
                        </Button>
                        <Link href="/login" passHref className="w-full sm:w-full">
                            <Button className="w-full bg-primary hover:bg-primary/90">
                                Login / Sign Up
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PricingSection