import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Pheniox</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Document Chat
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Upload documents.
              <br />
              <span className="text-primary">Chat with AI.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Upload your PDFs and have intelligent conversations about their content.
              Get instant answers powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-base px-8" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base px-8" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              { icon: FileText, title: "Upload PDFs", desc: "Drag & drop your documents for instant processing" },
              { icon: MessageSquare, title: "Chat Naturally", desc: "Ask questions about your documents in plain language" },
              { icon: Zap, title: "Instant Answers", desc: "Get AI-powered responses with streaming in real-time" },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4 mx-auto">
                  <f.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
