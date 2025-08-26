"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function AuthPopup({ onClose, onSuccess }) {
  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "619939042673-0kia60agj3l2u2sf3s7ad0md1k75l0hj.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_prompt: false,
      })

      window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
        type: "standard",
        size: "large",
        theme: "outline",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      })
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      // Send the credential to your backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // Set token in cookie
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
        onSuccess(data.user)
      } else {
        console.error("Authentication failed:", data.error)
      }
    } catch (error) {
      console.error("Authentication error:", error)
    }
  }

  // Make handleCredentialResponse available globally
  window.handleCredentialResponse = handleCredentialResponse

  return (
    <div className="fixed inset-0 z-50 auth-popup">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-background rounded-lg shadow-2xl w-full max-w-md p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Sign In Required</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-4">
              Please sign in to add items to your cart and continue shopping.
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="flex justify-center">
            <div id="google-signin-button"></div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
