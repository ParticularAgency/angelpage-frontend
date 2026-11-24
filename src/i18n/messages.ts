export type Locale = 'en' | 'fr';

export const LOCALE_COOKIE = 'angelpage-locale';

const en = {
  lang: {
    label: 'Language',
    en: 'EN',
    fr: 'FR',
  },
  nav: {
    sell: 'Sell an item',
    secureCheckout: 'Secure checkout',
    search: 'Search',
  },
  card: {
    add: 'Add to basket',
    added: 'Added',
    toCharity: '{amount} to charity',
    sellerKeeps: 'Seller keeps {percent}%',
    addedToast: 'Added to your basket.',
    failedToast: 'Could not add this item to your basket.',
    favouriteIn: 'Save',
    ships: 'Ships USA, Canada & UK',
    personal: 'Personal delivery',
    collect: 'Collection only',
    local: 'Local: {areas}',
    limited: 'Limited areas',
  },
  footer: {
    howItWorks: 'How it works',
    blog: 'Blog',
    events: 'Events',
    products: 'Products',
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    joinTitle: 'Join the Angelpage community',
    joinBody:
      'Be part of a community that values giving back. Sign up for updates on our impact, exclusive offers, and tips for your next purchase.',
    emailPlaceholder: 'Enter email',
    subscribe: 'Subscribe',
    submitting: 'Submitting...',
    subscribed: 'Subscribed',
    support: 'Platform support',
    contact: 'Contact us',
    admin: 'Admin login',
    emailRequired: 'Please enter an email address.',
    subscribedOk: 'Subscription successful. Check your inbox.',
    already: 'This email is already subscribed.',
  },
  market: {
    residents:
      'Angelpage starts in the United States. We also sell in Canada and the United Kingdom.',
    shippingOnly:
      'Angelpage ships to the United States, Canada, and the United Kingdom.',
    billingOnly:
      'Billing address must be in the United States, Canada, or the United Kingdom.',
    country: 'Country',
    unitedStates: 'United States',
    canada: 'Canada',
    unitedKingdom: 'United Kingdom',
  },
  cart: {
    title: 'Your basket',
    empty: 'Your basket is empty.',
    charity: 'Charity',
    remove: 'Remove',
    affiliate: 'Partner items',
    affiliateNote: 'These check out on the partner site.',
    affiliateCheckout: 'Partner checkout',
    total: 'Total',
    taxNote: 'Tax and shipping are calculated at checkout.',
    checkout: 'Checkout',
    browse: 'Continue shopping',
  },
  prefs: {
    title: 'Choose your market',
    body: 'Tell us where you shop and which language you prefer. Both are optional.',
    country: 'Country',
    language: 'Language',
    optional: '(optional)',
    choose: 'Select',
    continue: 'Continue',
  },
};

const fr: typeof en = {
  lang: {
    label: 'Langue',
    en: 'EN',
    fr: 'FR',
  },
  nav: {
    sell: 'Vendre un article',
    secureCheckout: 'Paiement sécurisé',
    search: 'Rechercher',
  },
  card: {
    add: 'Ajouter au panier',
    added: 'Ajouté',
    toCharity: '{amount} pour l’organisme',
    sellerKeeps: 'Le vendeur garde {percent} %',
    addedToast: 'Article ajouté à votre panier.',
    failedToast: 'Impossible d’ajouter cet article au panier.',
    favouriteIn: 'Enregistrer',
    ships: 'Livraison États-Unis, Canada et R.-U.',
    personal: 'Livraison en personne',
    collect: 'Retrait seulement',
    local: 'Local : {areas}',
    limited: 'Zones limitées',
  },
  footer: {
    howItWorks: 'Comment ça marche',
    blog: 'Blogue',
    events: 'Événements',
    products: 'Produits',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d’utilisation',
    joinTitle: 'Rejoignez la communauté Angelpage',
    joinBody:
      'Faites partie d’une communauté qui redonne. Inscrivez-vous pour suivre notre impact, les offres exclusives et des conseils pour votre prochain achat.',
    emailPlaceholder: 'Entrez votre courriel',
    subscribe: 'S’abonner',
    submitting: 'Envoi...',
    subscribed: 'Abonné',
    support: 'Assistance',
    contact: 'Nous joindre',
    admin: 'Connexion admin',
    emailRequired: 'Veuillez entrer une adresse courriel.',
    subscribedOk: 'Abonnement confirmé. Vérifiez votre boîte de réception.',
    already: 'Ce courriel est déjà abonné.',
  },
  market: {
    residents:
      'Angelpage commence aux États-Unis. Nous vendons aussi au Canada et au Royaume-Uni.',
    shippingOnly:
      'Angelpage livre aux États-Unis, au Canada et au Royaume-Uni.',
    billingOnly:
      'L’adresse de facturation doit être aux États-Unis, au Canada ou au Royaume-Uni.',
    country: 'Pays',
    unitedStates: 'États-Unis',
    canada: 'Canada',
    unitedKingdom: 'Royaume-Uni',
  },
  cart: {
    title: 'Votre panier',
    empty: 'Votre panier est vide.',
    charity: 'Organisme',
    remove: 'Retirer',
    affiliate: 'Articles partenaires',
    affiliateNote: 'Le paiement se fait sur le site partenaire.',
    affiliateCheckout: 'Paiement partenaire',
    total: 'Total',
    taxNote: 'Les taxes et la livraison sont calculées au paiement.',
    checkout: 'Payer',
    browse: 'Continuer vos achats',
  },
  prefs: {
    title: 'Choisissez votre marché',
    body: 'Indiquez où vous magasinez et la langue que vous préférez. Les deux sont facultatifs.',
    country: 'Pays',
    language: 'Langue',
    optional: '(facultatif)',
    choose: 'Choisir',
    continue: 'Continuer',
  },
};

export const messages = { en, fr };

export type MessageTree = typeof en;

export function translate(
  locale: Locale,
  path: string,
  vars?: Record<string, string | number>,
) {
  const parts = path.split('.');
  let node: unknown = messages[locale];
  for (const part of parts) {
    if (!node || typeof node !== 'object') return path;
    node = (node as Record<string, unknown>)[part];
  }
  if (typeof node !== 'string') return path;
  if (!vars) return node;
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    node,
  );
}
