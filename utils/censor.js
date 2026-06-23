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

const pattern = new RegExp(`\\b(?:${allFoulWords.join('|')})(?:s|es)?\\b`, 'gi');

function censorFoulWords(text) {
  if (!text) return text;

  return text.replace(pattern, (match) => {
    return '*'.repeat(match.length);
  });
}

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