/**
 * Nori Name Detection Utility
 * Helps improve STT accuracy by detecting when "Nori" is mentioned in speech
 */

export interface NoriDetectionResult {
  containsNori: boolean;
  noriPosition: 'start' | 'middle' | 'end' | null;
  cleanedTranscript: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Detect if "Nori" is mentioned in the transcript
 * Supports multiple variations and languages
 */
export function detectNoriMention(transcript: string): NoriDetectionResult {
  if (!transcript || transcript.trim().length === 0) {
    return {
      containsNori: false,
      noriPosition: null,
      cleanedTranscript: transcript,
      confidence: 'low',
    };
  }

  const normalized = transcript.trim().toLowerCase();
  
  // Patterns to match "Nori" in various forms
  // English: "nori", "norie", "norry", "noree"
  // French: "nori", "lorie", "lori" (common STT mispronunciation)
  // Common variations: "hey nori", "nori,", "nori?", "nori!", etc.
  const noriPatterns = [
    /\bnori\b/i,           // Exact match (word boundary)
    /\bnorie\b/i,          // Common misspelling
    /\bnorry\b/i,          // Phonetic variation
    /\bnoree\b/i,          // Phonetic variation
    /\bnor[iy]\b/i,        // Flexible ending
    /\blorie\b/i,          // French STT variation (Lorie)
    /\blori\b/i,           // French STT variation (Lori)
    /\blor[iy]\b/i,        // French phonetic variations
  ];

  let containsNori = false;
  let noriPosition: 'start' | 'middle' | 'end' | null = null;
  let matchIndex = -1;

  // Check each pattern
  for (const pattern of noriPatterns) {
    const match = normalized.match(pattern);
    if (match && match.index !== undefined) {
      containsNori = true;
      matchIndex = match.index;
      break;
    }
  }

  // Determine position
  if (containsNori && matchIndex !== -1) {
    const transcriptLength = normalized.length;
    const relativePosition = matchIndex / transcriptLength;
    
    if (relativePosition < 0.2) {
      noriPosition = 'start'; // First 20% of transcript
    } else if (relativePosition > 0.8) {
      noriPosition = 'end'; // Last 20% of transcript
    } else {
      noriPosition = 'middle';
    }
  }

  // Calculate confidence based on position and context
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (containsNori) {
    if (noriPosition === 'start') {
      // High confidence if Nori is at the start (wake word pattern)
      confidence = 'high';
    } else if (noriPosition === 'middle' || noriPosition === 'end') {
      // Medium confidence if mentioned elsewhere
      confidence = 'medium';
    }
  }

  // Clean transcript: optionally remove "hey nori" or "nori" at start for cleaner input
  let cleanedTranscript = transcript;
  if (containsNori && noriPosition === 'start') {
    // Remove wake word patterns like "hey nori", "nori", "lorie", "nori,", etc.
    // Also handle French variations: "salut lorie", "lorie", "lori", etc.
    cleanedTranscript = transcript
      .replace(/^(hey\s+|salut\s+|bonjour\s+)?(nori|lorie|lori)[,\s]*/i, '')
      .trim();
  }

  return {
    containsNori,
    noriPosition,
    cleanedTranscript,
    confidence,
  };
}

/**
 * Check if transcript should be processed based on Nori detection
 * Returns true if Nori is mentioned OR if transcript is short (likely direct command)
 */
export function shouldProcessTranscript(
  transcript: string,
  requireNoriMention: boolean = false
): boolean {
  if (!transcript || transcript.trim().length === 0) {
    return false;
  }

  const detection = detectNoriMention(transcript);
  
  // If we require Nori mention, only process if found
  if (requireNoriMention) {
    return detection.containsNori;
  }

  // Otherwise, process if:
  // 1. Nori is mentioned, OR
  // 2. Transcript is short (likely a direct command without wake word)
  const isShortCommand = transcript.trim().split(/\s+/).length <= 5;
  return detection.containsNori || isShortCommand;
}

/**
 * Enhance transcript by adding context when Nori is detected
 * This can help the AI understand the intent better
 */
export function enhanceTranscriptWithNoriContext(transcript: string): string {
  const detection = detectNoriMention(transcript);
  
  if (!detection.containsNori) {
    return transcript; // No enhancement needed
  }

  // Use cleaned transcript (removes wake word)
  return detection.cleanedTranscript || transcript;
}
