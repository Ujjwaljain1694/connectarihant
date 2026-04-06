/**
 * Masks PAN card: ABCDE1234F -> XXXXXXX234F
 */
const maskPAN = (pan) => {
  if (!pan || pan.length < 4) return 'XXXXXXXXXX';
  return 'XXXXXX' + pan.slice(-4);
};

/**
 * Masks mobile number: 9876543210 -> XXXXXX3210
 */
const maskMobile = (mobile) => {
  if (!mobile || mobile.length < 4) return 'XXXXXXXXXX';
  return 'XXXXXX' + mobile.slice(-4);
};

/**
 * Masks email: john.doe@gmail.com -> jo***@g*****.com
 */
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return 'XXXXXXXXXXXX';
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, 2) + '***';
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0].slice(0, 1) + '*****';
  const tld = domainParts.slice(1).join('.');
  return `${maskedLocal}@${maskedDomain}.${tld}`;
};

module.exports = { maskPAN, maskMobile, maskEmail };
