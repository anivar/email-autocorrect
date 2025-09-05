/**
 * IANA TLD Loading Example
 * Demonstrates dynamic loading of IANA TLD list for LGR compliance
 * IANA list follows IDN Label Generation Rules (LGR)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { loadTLDs, validateEmail, correctEmail } from 'email-autocorrect';

export function IANATLDLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [tldCount, setTldCount] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  
  // Load IANA TLDs (LGR compliant)
  const loadIANATLDs = async () => {
    setIsLoading(true);
    setLoadError('');
    
    try {
      // Load from official IANA source
      // This list is LGR compliant and includes all valid TLDs
      await loadTLDs('https://data.iana.org/TLD/tlds-alpha-by-domain.txt');
      
      // The loadTLDs function adds these to the validator
      setTldCount(1500); // Approximate count
      
      // Test with some new gTLDs and IDN TLDs
      const testEmails = [
        'user@example.みんな',     // Japanese IDN TLD
        'info@company.संगठन',      // Hindi IDN TLD  
        'contact@site.中国',       // Chinese IDN TLD
        'admin@app.photography',   // New gTLD
        'hello@world.amsterdam',   // City TLD
        'test@demo.technology',    // Generic TLD
      ];
      
      const results = testEmails.map(email => ({
        email,
        validation: validateEmail(email),
        suggestion: correctEmail(email),
      }));
      
      setTestResults(results);
    } catch (error) {
      setLoadError(`Failed to load IANA TLDs: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IANA TLD Dynamic Loading</Text>
      <Text style={styles.subtitle}>
        Load LGR-compliant TLDs from IANA registry
      </Text>
      
      <Button
        title="Load IANA TLD List"
        onPress={loadIANATLDs}
        disabled={isLoading}
      />
      
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading IANA TLDs...</Text>
        </View>
      )}
      
      {loadError && (
        <Text style={styles.error}>{loadError}</Text>
      )}
      
      {tldCount > 0 && (
        <View style={styles.success}>
          <Text style={styles.successText}>
            ✓ Loaded {tldCount}+ TLDs from IANA
          </Text>
          <Text style={styles.note}>
            All TLDs are LGR (Label Generation Rules) compliant
          </Text>
        </View>
      )}
      
      {testResults.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Validation with IANA TLDs:</Text>
          {testResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.email}>{result.email}</Text>
              <Text style={[
                styles.status,
                result.validation.isValid ? styles.valid : styles.invalid
              ]}>
                {result.validation.isValid ? '✓ Valid' : '✗ Invalid'}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.infoTitle}>About IANA TLDs:</Text>
        <Text style={styles.infoText}>
          • IANA maintains the authoritative list of all TLDs{'\n'}
          • Includes gTLDs, ccTLDs, and IDN TLDs{'\n'}
          • All entries follow LGR (Label Generation Rules){'\n'}
          • Updated regularly with new TLDs{'\n'}
          • Ensures IDNA2008 compliance
        </Text>
      </View>
    </View>
  );
}

// Example: Custom TLD loading from your own source
export function CustomTLDLoader() {
  const [customTLDs, setCustomTLDs] = useState<string[]>([]);
  
  const loadCustomTLDs = async () => {
    // You can also load from your own source
    // as long as it follows IANA format
    const response = await fetch('/api/custom-tlds');
    const text = await response.text();
    
    // Parse IANA format (skip comments)
    const tlds = text
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(tld => tld.toLowerCase().trim());
    
    setCustomTLDs(tlds);
    
    // Load into the validator
    await loadTLDs('/api/custom-tlds');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom TLD Source</Text>
      <Button title="Load Custom TLDs" onPress={loadCustomTLDs} />
      {customTLDs.length > 0 && (
        <Text>Loaded {customTLDs.length} custom TLDs</Text>
      )}
    </View>
  );
}

// Example: Using with Node.js/Server
export async function serverSideIANALoad() {
  // Load IANA TLDs on server startup
  try {
    await loadTLDs(); // Uses default IANA URL
    console.log('IANA TLDs loaded successfully');
    
    // Now validation includes all IANA TLDs
    const isValid = validateEmail('user@example.photography');
    console.log('Validation result:', isValid);
    
  } catch (error) {
    console.error('Failed to load IANA TLDs:', error);
  }
}

// Example: Caching IANA list locally
export function CachedIANATLDs() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    // Check if we need to refresh (e.g., once per week)
    const cached = localStorage.getItem('iana-tlds-updated');
    if (cached) {
      const cachedDate = new Date(cached);
      const daysSinceUpdate = (Date.now() - cachedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceUpdate < 7) {
        setLastUpdated(cachedDate);
        return; // Use cached TLDs
      }
    }
    
    // Load fresh from IANA
    loadTLDs().then(() => {
      const now = new Date();
      localStorage.setItem('iana-tlds-updated', now.toISOString());
      setLastUpdated(now);
    });
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cached IANA TLDs</Text>
      {lastUpdated && (
        <Text style={styles.note}>
          Last updated: {lastUpdated.toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  loading: {
    marginTop: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  error: {
    marginTop: 16,
    color: '#ff3b30',
    fontSize: 14,
  },
  success: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#d4edda',
    borderRadius: 8,
  },
  successText: {
    color: '#155724',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  results: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  email: {
    fontSize: 13,
    flex: 1,
  },
  status: {
    fontSize: 12,
    marginLeft: 8,
  },
  valid: {
    color: '#28a745',
  },
  invalid: {
    color: '#dc3545',
  },
  info: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#666',
  },
});