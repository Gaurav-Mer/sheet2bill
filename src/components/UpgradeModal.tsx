import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"
import Link from "next/link"
import { useUpgradeModal } from "./providers/UpgradeModalProvider"

type UpgradeModalProps = {
    isOpen: boolean
    onClose: () => void
    message: string
}

export function UpgradeModal({ isOpen, onClose, message }: UpgradeModalProps) {
    const { closeUpgrade } = useUpgradeModal()

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            closeUpgrade()
            onClose()
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <Star className="h-6 w-6 text-orange-500" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold pt-4">Upgrade to Unlock More</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center pt-4">
                    <Button type="button" variant="outline" onClick={() => {
                        closeUpgrade()
                        onClose()
                    }}>
                        Maybe Later
                    </Button>
                    <Link onClick={closeUpgrade} href="/pricing" passHref>
                        <Button>View Plans</Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
