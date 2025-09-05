/**
 * Next.js Example - Email Autocorrect
 * Works with App Router and Pages Router
 * Full IDNA2008/EAI support
 */

'use client';

import { useState, FormEvent } from 'react';
import { correctEmail, validateEmail } from 'email-autocorrect';

export function EmailSignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
    setSuggestion(null);
    
    // Real-time validation
    const validation = validateEmail(value);
    if (value && !validation.isValid) {
      setError(validation.error || 'Invalid email');
    }
    
    // Check for typos
    if (value.includes('@')) {
      const correction = correctEmail(value);
      if (correction && correction.confidence > 0.8) {
        setSuggestion(correction.suggested);
      }
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid email');
      return;
    }
    
    // Check for typos before submission
    const correction = correctEmail(email);
    if (correction && correction.confidence > 0.9) {
      if (!confirm(`Did you mean ${correction.suggested}?`)) {
        return;
      }
      setEmail(correction.suggested);
    }
    
    setIsSubmitting(true);
    
    try {
      // Your API call here
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: suggestion || email }),
      });
      
      if (response.ok) {
        alert('Success! Check your email for confirmation.');
        setEmail('');
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="email-form">
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Enter your email"
          className={`form-input ${error ? 'error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
          disabled={isSubmitting}
        />
        
        {error && (
          <p id="email-error" className="error-message" role="alert">
            {error}
          </p>
        )}
        
        {suggestion && suggestion !== email && (
          <div className="suggestion">
            <button
              type="button"
              onClick={() => {
                setEmail(suggestion);
                setSuggestion(null);
              }}
              className="suggestion-button"
            >
              Did you mean <strong>{suggestion}</strong>?
            </button>
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting || !!error}
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
      
      <style jsx>{`
        .email-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #007aff;
        }
        
        .form-input.error {
          border-color: #ff3b30;
        }
        
        .error-message {
          color: #ff3b30;
          font-size: 14px;
          margin-top: 4px;
        }
        
        .suggestion {
          margin-top: 8px;
        }
        
        .suggestion-button {
          padding: 8px 12px;
          background: #e3f2ff;
          border: none;
          border-radius: 6px;
          color: #007aff;
          cursor: pointer;
          font-size: 14px;
        }
        
        .suggestion-button:hover {
          background: #cce5ff;
        }
        
        .submit-button {
          width: 100%;
          padding: 14px;
          background: #007aff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

// Server-side validation example (API route)
export async function validateEmailServer(email: string) {
  // This can be used in API routes or server components
  const validation = validateEmail(email);
  
  if (!validation.isValid) {
    return {
      valid: false,
      error: validation.error,
    };
  }
  
  // Check for common typos
  const correction = correctEmail(email);
  
  return {
    valid: true,
    suggestion: correction?.suggested,
    confidence: correction?.confidence,
  };
}

// Example API route handler (app/api/validate-email/route.ts)
export async function POST(request: Request) {
  const { email } = await request.json();
  
  const result = await validateEmailServer(email);
  
  return Response.json(result);
}