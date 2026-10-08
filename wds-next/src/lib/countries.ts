export interface CountryOption {
  code: string;
  namePl: string;
  nameEn: string;
  phonePrefix: string;
  flag: string;
  isDomestic?: boolean;
}

export const COUNTRIES: CountryOption[] = [
  // Domestic
  { code: 'PL', namePl: 'Polska', nameEn: 'Poland', phonePrefix: '+48', flag: '🇵🇱', isDomestic: true },

  // European Union & EEA
  { code: 'DE', namePl: 'Niemcy', nameEn: 'Germany', phonePrefix: '+49', flag: '🇩🇪' },
  { code: 'GB', namePl: 'Wielka Brytania', nameEn: 'United Kingdom', phonePrefix: '+44', flag: '🇬🇧' },
  { code: 'FR', namePl: 'Francja', nameEn: 'France', phonePrefix: '+33', flag: '🇫🇷' },
  { code: 'NL', namePl: 'Holandia', nameEn: 'Netherlands', phonePrefix: '+31', flag: '🇳🇱' },
  { code: 'IT', namePl: 'Włochy', nameEn: 'Italy', phonePrefix: '+39', flag: '🇮🇹' },
  { code: 'ES', namePl: 'Hiszpania', nameEn: 'Spain', phonePrefix: '+34', flag: '🇪🇸' },
  { code: 'AT', namePl: 'Austria', nameEn: 'Austria', phonePrefix: '+43', flag: '🇦🇹' },
  { code: 'BE', namePl: 'Belgia', nameEn: 'Belgium', phonePrefix: '+32', flag: '🇧🇪' },
  { code: 'CZ', namePl: 'Czechy', nameEn: 'Czech Republic', phonePrefix: '+420', flag: '🇨🇿' },
  { code: 'SK', namePl: 'Słowacja', nameEn: 'Slovakia', phonePrefix: '+421', flag: '🇸🇰' },
  { code: 'SE', namePl: 'Szwecja', nameEn: 'Sweden', phonePrefix: '+46', flag: '🇸🇪' },
  { code: 'DK', namePl: 'Dania', nameEn: 'Denmark', phonePrefix: '+45', flag: '🇩🇰' },
  { code: 'IE', namePl: 'Irlandia', nameEn: 'Ireland', phonePrefix: '+353', flag: '🇮🇪' },
  { code: 'PT', namePl: 'Portugalia', nameEn: 'Portugal', phonePrefix: '+351', flag: '🇵🇹' },
  { code: 'FI', namePl: 'Finlandia', nameEn: 'Finland', phonePrefix: '+358', flag: '🇫🇮' },
  { code: 'NO', namePl: 'Norwegia', nameEn: 'Norway', phonePrefix: '+47', flag: '🇳🇴' },
  { code: 'CH', namePl: 'Szwajcaria', nameEn: 'Switzerland', phonePrefix: '+41', flag: '🇨🇭' },
  { code: 'UA', namePl: 'Ukraina', nameEn: 'Ukraine', phonePrefix: '+380', flag: '🇺🇦' },
  { code: 'LT', namePl: 'Litwa', nameEn: 'Lithuania', phonePrefix: '+370', flag: '🇱🇹' },
  { code: 'LV', namePl: 'Łotwa', nameEn: 'Latvia', phonePrefix: '+371', flag: '🇱🇻' },
  { code: 'EE', namePl: 'Estonia', nameEn: 'Estonia', phonePrefix: '+372', flag: '🇪🇪' },
  { code: 'HU', namePl: 'Węgry', nameEn: 'Hungary', phonePrefix: '+36', flag: '🇭🇺' },
  { code: 'RO', namePl: 'Rumunia', nameEn: 'Romania', phonePrefix: '+40', flag: '🇷🇴' },
  { code: 'BG', namePl: 'Bułgaria', nameEn: 'Bulgaria', phonePrefix: '+359', flag: '🇧🇬' },
  { code: 'GR', namePl: 'Grecja', nameEn: 'Greece', phonePrefix: '+30', flag: '🇬🇷' },
  { code: 'HR', namePl: 'Chorwacja', nameEn: 'Croatia', phonePrefix: '+385', flag: '🇭🇷' },
  { code: 'SI', namePl: 'Słowenia', nameEn: 'Slovenia', phonePrefix: '+386', flag: '🇸🇮' },
  { code: 'LU', namePl: 'Luksemburg', nameEn: 'Luxembourg', phonePrefix: '+352', flag: '🇱🇺' },
  { code: 'CY', namePl: 'Cypr', nameEn: 'Cyprus', phonePrefix: '+357', flag: '🇨🇾' },
  { code: 'MT', namePl: 'Malta', nameEn: 'Malta', phonePrefix: '+356', flag: '🇲🇹' },

  // North America & World
  { code: 'US', namePl: 'Stany Zjednoczone', nameEn: 'United States', phonePrefix: '+1', flag: '🇺🇸' },
  { code: 'CA', namePl: 'Kanada', nameEn: 'Canada', phonePrefix: '+1', flag: '🇨🇦' },
  { code: 'OTHER', namePl: 'Inny kraj / Other', nameEn: 'Other country', phonePrefix: '+48', flag: '🌍' },
];

export const POPULAR_PHONE_PREFIXES = [
  { prefix: '+48', label: '🇵🇱 Polska (+48)' },
  { prefix: '+49', label: '🇩🇪 Niemcy (+49)' },
  { prefix: '+44', label: '🇬🇧 UK (+44)' },
  { prefix: '+33', label: '🇫🇷 Francja (+33)' },
  { prefix: '+31', label: '🇳🇱 Holandia (+31)' },
  { prefix: '+39', label: '🇮🇹 Włochy (+39)' },
  { prefix: '+34', label: '🇪🇸 Hiszpania (+34)' },
  { prefix: '+43', label: '🇦🇹 Austria (+43)' },
  { prefix: '+32', label: '🇧🇪 Belgia (+32)' },
  { prefix: '+420', label: '🇨🇿 Czechy (+420)' },
  { prefix: '+421', label: '🇸🇰 Słowacja (+421)' },
  { prefix: '+46', label: '🇸🇪 Szwecja (+46)' },
  { prefix: '+45', label: '🇩🇰 Dania (+45)' },
  { prefix: '+47', label: '🇳🇴 Norwegia (+47)' },
  { prefix: '+41', label: '🇨🇭 Szwajcaria (+41)' },
  { prefix: '+353', label: '🇮🇪 Irlandia (+353)' },
  { prefix: '+380', label: '🇺🇦 Ukraina (+380)' },
  { prefix: '+1', label: '🇺🇸/🇨🇦 USA & Kanada (+1)' },
];

export function getCountryByCode(code: string): CountryOption {
  return COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
}
