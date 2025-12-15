import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useEffect, useRef } from "react";
import { Howl } from "howler";
import katanaSound from "@assets/katana-370403_(1)_1765760828510.mp3";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const katanaSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    katanaSoundRef.current = new Howl({
      src: [katanaSound],
      volume: 0.5,
    });

    const handleClick = () => {
      katanaSoundRef.current?.play();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      katanaSoundRef.current?.unload();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
