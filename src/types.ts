export interface EmailSuggestion {
  original: string;
  suggested: string;
  confidence: number;
  reason: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface EmailAutocorrectConfig {
  enableSuggestions?: boolean;
  enableValidation?: boolean;
  debounceMs?: number;
  minConfidence?: number;
  country?: string;
  customDomains?: string[];
}

export interface EmailInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onEmailChange?: (email: string, isValid: boolean) => void;
  onEmailSubmit?: (email: string) => void;
  config?: EmailAutocorrectConfig;
  showSuggestion?: boolean;
  showValidation?: boolean;
  placeholder?: string;
  testID?: string;
  [key: string]: any;
}