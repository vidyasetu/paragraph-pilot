
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Lock } from "lucide-react";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For demo purposes, check hardcoded credentials
    if (username === "vidyasetu" && password === "vidyasetu") {
      try {
        // Create a "fake" email using the username for Supabase
        const email = `${username}@vidyasetu.demo`;
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If the user doesn't exist, sign them up first
          if (error.message.includes("Invalid login credentials")) {
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
            });
            if (signUpError) throw signUpError;
            
            // Try logging in again after signup
            const { error: loginError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (loginError) throw loginError;
          } else {
            throw error;
          }
        }

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/");
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Error",
          description: "An error occurred during authentication.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your username and password.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Vidya Setu
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to continue
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
