const englishFoulWords = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'bastard', 'slut', 'whore',
  'motherfucker', 'cock', 'faggot', 'nigger', 'nigga', 'dyke', 'prick', 'twat', 'wanker',
  'crap', 'bullshit', 'dumbass', 'jackass', 'piss', 'douche', 'douchebag'
];

const filipinoFoulWords = [
  'putangina', 'putang ina', 'gago', 'tarantado', 'bobo', 'tanga', 'hindot', 'pucha',
  'inamo', 'tangina', 'syet', 'pakyu', 'ulol', 'siraulo', 'kantot', 'iyot', 'pokpok',
  'pota', 'potek', 'pisting', 'leche', 'lintik', 'punyeta', 'inutil', 'gunggong'
];

const allFoulWords = [...englishFoulWords, ...filipinoFoulWords];

// Build a single case-insensitive regex pattern
// Using word boundaries \b and optional plural suffixes (s or es)
const pattern = new RegExp(`\\b(?:${allFoulWords.join('|')})(?:s|es)?\\b`, 'gi');

/**
 * Censors foul words in a given string.
 * @param {string} text - The input string to censor.
 * @returns {string} - The censored string.
 */
function censorFoulWords(text) {
  if (!text) return text;
  
  return text.replace(pattern, (match) => {
    return '*'.repeat(match.length);
  });
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} text - The input string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHTML(text) {
  if (!text) return text;
  return text.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

module.exports = {
  censorFoulWords,
  escapeHTML
};
