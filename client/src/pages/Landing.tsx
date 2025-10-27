import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">Built on Base L2</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Connect. Build. Earn.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The first decentralized microjob marketplace on Base. Get paid instantly for simple online tasks — fully on-chain, transparent, and fee-efficient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/login">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/tasks">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Tasks
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">10%</div>
              <div className="text-sm text-muted-foreground">Platform Fee</div>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">Instant</div>
              <div className="text-sm text-muted-foreground">Payments</div>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Transparent</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose BaseConnect?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card border border-border hover:shadow-card transition-all">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Payments</h3>
              <p className="text-muted-foreground">
                Get paid immediately upon task approval. No waiting, no delays — payments are released automatically via smart contracts.
              </p>
            </div>
            
            <div className="p-8 rounded-xl bg-card border border-border hover:shadow-card transition-all">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trustless & Secure</h3>
              <p className="text-muted-foreground">
                Funds are held in escrow smart contracts. No middleman can access or withhold your earnings.
              </p>
            </div>
            
            <div className="p-8 rounded-xl bg-card border border-border hover:shadow-card transition-all">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Low Fees</h3>
              <p className="text-muted-foreground">
                Only 10% platform fee on completed tasks. Built on Base L2 for minimal gas costs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Task Creators */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">For Task Creators</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Connect Your Wallet</h4>
                    <p className="text-sm text-muted-foreground">Connect MetaMask or Coinbase Wallet</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Create a Task</h4>
                    <p className="text-sm text-muted-foreground">Define your task and set the reward</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Fund Escrow</h4>
                    <p className="text-sm text-muted-foreground">Lock funds in a smart contract</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Approve & Pay</h4>
                    <p className="text-sm text-muted-foreground">Review work and release payment instantly</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Task Doers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-accent">For Task Contributors</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Connect Your Wallet</h4>
                    <p className="text-sm text-muted-foreground">Sign up with your wallet address</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse Tasks</h4>
                    <p className="text-sm text-muted-foreground">Find tasks that match your skills</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Submit Work</h4>
                    <p className="text-sm text-muted-foreground">Complete the task and provide proof</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Paid</h4>
                    <p className="text-sm text-muted-foreground">Receive instant payment to your wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join the future of decentralized work. Connect your wallet and start earning today.
          </p>
          <Link to="/onboarding">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary/60">
              Connect Wallet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BaseConnect. Built on Base L2 by Coinbase.</p>
        </div>
      </footer>
    </div>
  );
}
