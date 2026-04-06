import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelName: string;
}

const BookingDialog = ({ open, onOpenChange, hotelName }: BookingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="font-heading text-gold text-2xl font-bold">
            Your booking is done
          </DialogTitle>
        </DialogHeader>
        <p className="text-foreground font-body text-sm">
          Thank you for ordering from<br />
          <span className="font-semibold">{hotelName || "Grand Hotel"}</span>
        </p>
        <button
          onClick={() => onOpenChange(false)}
          className="mt-4 w-full py-3 rounded-xl font-body font-bold text-sm text-background
                     btn-gold-gradient hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
        >
          Get free voucher!
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
