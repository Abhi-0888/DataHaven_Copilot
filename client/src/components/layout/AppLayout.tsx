import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Database, Home, Shield, Sparkles, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Datasets", href: "/datasets", icon: Database },
    { label: "Verification", href: "/verification", icon: Shield },
    { label: "Copilot", href: "/copilot", icon: Sparkles },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-card/30 backdrop-blur-xl hidden md:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">DataHeaven</h1>
            <p className="text-xs text-muted-foreground font-mono">COPILOT OS</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary hover:bg-primary/15" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-xs font-mono text-muted-foreground mb-1">NETWORK STATUS</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Mainnet Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Background Ambient Orbs */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob pointer-events-none" />
        <div className="absolute top-0 -right-40 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-blob animation-delay-2000 pointer-events-none" />
        
        <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="md:hidden flex items-center gap-3">
            <Database className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg">DataHeaven</span>
          </div>
          
          <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full px-4 py-2 w-96">
            <input 
              type="text" 
              placeholder="Search datasets, insights, hashes..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">0x8a...4b9C</div>
              <div className="text-xs text-muted-foreground">Connected Wallet</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-primary flex items-center justify-center border-2 border-background">
              <span className="font-bold text-sm">0x</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto z-10 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
