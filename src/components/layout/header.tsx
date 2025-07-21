import { Handshake, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Handshake className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Amig<span className="text-primary">or</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="User Profile">
            <UserCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
