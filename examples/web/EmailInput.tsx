/**
 * React Email Input Component (Web version)
 * Accessible email input with autocorrection
 */

import React, { useRef, useId } from 'react';
import { useEmailAutocorrect } from './useEmailAutocorrect';
import { EmailAutocorrectConfig } from '../types';

export interface EmailInputProps {
  onEmailChange?: (email: string, isValid: boolean) => void;
  onEmailSubmit?: (email: string) => void;
  config?: EmailAutocorrectConfig;
  className?: string;
  style?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  suggestionClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  testId?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  onEmailChange,
  onEmailSubmit,
  config,
  className = '',
  style,
  inputClassName = '',
  inputStyle,
  suggestionClassName = '',
  placeholder = 'Enter your email',
  autoFocus = false,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  testId = 'email-input',
}) => {
  const {
    email,
    setEmail,
    validation,
    suggestion,
    acceptSuggestion,
    rejectSuggestion,
  } = useEmailAutocorrect(config);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionId = useId();
  const errorId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onEmailChange?.(newEmail, validation.isValid);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (suggestion && e.ctrlKey) {
        acceptSuggestion();
      } else if (email && validation.isValid) {
        onEmailSubmit?.(email);
      }
    } else if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
  };

  const handleAccept = () => {
    acceptSuggestion();
    inputRef.current?.focus();
  };

  const handleReject = () => {
    rejectSuggestion();
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`email-input-container ${className}`}
      style={style}
      data-testid={testId}
    >
      <input
        ref={inputRef}
        type="email"
        value={email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className={`email-input ${inputClassName} ${
          email && validation.isValid ? 'valid' : ''
        } ${email && !validation.isValid ? 'invalid' : ''}`}
        style={inputStyle}
        aria-label={ariaLabel || 'Email address'}
        aria-invalid={email && !validation.isValid}
        aria-describedby={[
          validation.error ? errorId : '',
          suggestion ? suggestionId : '',
          ariaDescribedBy,
        ].filter(Boolean).join(' ')}
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        data-testid={`${testId}-input`}
      />

      {/* Error message */}
      {validation.error && email && (
        <div
          id={errorId}
          className="email-error"
          role="alert"
          aria-live="polite"
          data-testid={`${testId}-error`}
        >
          {validation.error}
        </div>
      )}

      {/* Suggestion */}
      {suggestion && (
        <div
          id={suggestionId}
          className={`email-suggestion ${suggestionClassName}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          data-testid={`${testId}-suggestion`}
        >
          <span className="suggestion-text">
            Did you mean{' '}
            <strong className="suggestion-email">{suggestion.suggested}</strong>?
          </span>
          <div className="suggestion-actions">
            <button
              onClick={handleAccept}
              className="suggestion-button accept"
              aria-label={`Use suggested email ${suggestion.suggested}`}
              data-testid={`${testId}-accept`}
            >
              Yes
            </button>
            <button
              onClick={handleReject}
              className="suggestion-button reject"
              aria-label="Dismiss suggestion"
              data-testid={`${testId}-reject`}
            >
              No
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .email-input-container {
          position: relative;
          width: 100%;
        }

        .email-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
          background: white;
        }

        .email-input:focus {
          border-color: #0066cc;
        }

        .email-input.valid {
          border-color: #4caf50;
        }

        .email-input.invalid {
          border-color: #f44336;
        }

        .email-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .email-error {
          color: #f44336;
          font-size: 14px;
          margin-top: 4px;
        }

        .email-suggestion {
          margin-top: 8px;
          padding: 12px;
          background: #e3f2fd;
          border-radius: 6px;
          font-size: 14px;
        }

        .suggestion-text {
          color: #1976d2;
        }

        .suggestion-email {
          font-weight: 600;
        }

        .suggestion-actions {
          margin-top: 8px;
          display: flex;
          gap: 8px;
        }

        .suggestion-button {
          padding: 6px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .suggestion-button.accept {
          background: #1976d2;
          color: white;
        }

        .suggestion-button.accept:hover {
          background: #1565c0;
        }

        .suggestion-button.reject {
          background: #f5f5f5;
          color: #666;
        }

        .suggestion-button.reject:hover {
          background: #e0e0e0;
        }

        .suggestion-button:focus {
          outline: 2px solid #0066cc;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};