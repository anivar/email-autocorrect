/**
 * Next.js Example
 * Server and client component examples
 */

'use client'; // For Next.js 13+ app directory

import { useState } from 'react';
import { correctEmail, validateEmail } from 'email-autocorrect';

// Client Component Example
export function EmailFormExample() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const validation = validateEmail(email);
  const suggestion = email && !validation.isValid ? correctEmail(email) : null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.isValid) {
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    
    try {
      // Your API call here
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="email-form">
      <h2>Subscribe to Newsletter</h2>
      
      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={`form-input ${
            email && validation.isValid ? 'valid' : ''
          } ${email && !validation.isValid ? 'invalid' : ''}`}
          aria-invalid={email && !validation.isValid}
          aria-describedby={validation.error ? 'email-error' : undefined}
        />
        
        {validation.error && email && (
          <p id="email-error" className="error-message">
            {validation.error}
          </p>
        )}
        
        {suggestion && (
          <div className="suggestion">
            Did you mean{' '}
            <button
              type="button"
              onClick={() => setEmail(suggestion.suggested)}
              className="suggestion-link"
            >
              {suggestion.suggested}
            </button>
            ?
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={!email || !validation.isValid || status === 'loading'}
        className="submit-button"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      
      {status === 'success' && (
        <p className="success-message">Thanks for subscribing!</p>
      )}
      
      <style jsx>{`
        .email-form {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          margin-bottom: 1.5rem;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #0070f3;
        }
        
        .form-input.valid {
          border-color: #0cce6b;
        }
        
        .form-input.invalid {
          border-color: #ff4757;
        }
        
        .error-message {
          color: #ff4757;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        
        .suggestion {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }
        
        .suggestion-link {
          background: none;
          border: none;
          color: #0070f3;
          text-decoration: underline;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
        }
        
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #0051cc;
        }
        
        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .success-message {
          margin-top: 1rem;
          color: #0cce6b;
          text-align: center;
        }
      `}</style>
    </form>
  );
}

// Server Component Example (Next.js 13+)
export async function EmailList() {
  // This runs on the server
  const testEmails = [
    'user@gmial.com',
    'admin@yahooo.com',
    'test@hotmial.com',
  ];
  
  // You can use the validation on the server too!
  const validatedEmails = testEmails.map(email => ({
    email,
    valid: validateEmail(email).isValid,
    suggestion: correctEmail(email)?.suggested,
  }));
  
  return (
    <div className="email-list">
      <h3>Email Validation Results (Server-side)</h3>
      <ul>
        {validatedEmails.map(({ email, valid, suggestion }) => (
          <li key={email}>
            <span className={valid ? 'valid' : 'invalid'}>
              {email}
            </span>
            {suggestion && (
              <span className="suggestion"> → {suggestion}</span>
            )}
          </li>
        ))}
      </ul>
      
      <style jsx>{`
        .email-list {
          margin: 2rem 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        ul {
          list-style: none;
          padding: 0;
        }
        
        li {
          margin: 0.5rem 0;
        }
        
        .valid {
          color: #0cce6b;
        }
        
        .invalid {
          color: #ff4757;
        }
        
        .suggestion {
          color: #0070f3;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}