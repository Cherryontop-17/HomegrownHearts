/**
 * UI micro-copy (nav labels, buttons, a11y strings).
 *
 * Long-form page prose lives in `src/content/{en,es}/` — not here.
 *
 * `es` is typed as `Record<UIKey, string>`, so **omitting a key is a compile
 * error**. Spanish can never silently fall behind English.
 *
 * Spanish register: Latin-American, plain language, `usted`. Translated for
 * meaning, not word-for-word. See docs/COMPLIANCE.md before touching any string
 * that mentions food, health, or donations.
 */

const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.partners': 'For Clinics',
  'nav.getInvolved': 'Get Involved',
  'nav.impact': 'Our Impact',
  'nav.contact': 'Contact',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  // Accessibility
  'a11y.skipToContent': 'Skip to content',
  'a11y.mainNav': 'Main navigation',
  'a11y.langSwitch': 'Change language',
  'a11y.homeLink': 'Homegrown Hearts, home',

  // Calls to action
  'cta.volunteer': 'Volunteer with us',
  'cta.partner': 'Partner with us',
  'cta.donate': 'Donate supplies',
  'cta.learnMore': 'Learn more',
  'cta.contactUs': 'Get in touch',

  // Language switcher
  'lang.en': 'English',
  'lang.es': 'Español',

  // Footer
  // Localised place name. Rendering ORG.location straight from config put
  // "Union County, NC" on the Spanish page.
  'org.place': 'Union County, North Carolina',
  'footer.blurb':
    'A student-led initiative growing free produce bundles for pregnant and postpartum mothers.',

  'footer.advisor': 'Adult advisor',
  'footer.advisorPending': 'Supported by an adult advisor',
  'footer.followUs': 'Follow along',
  'footer.rights': 'All rights reserved.',

  // Legal — do not reword without reading docs/COMPLIANCE.md
  'legal.status':
    'Homegrown Hearts is a student-led initiative. We accept donated supplies only. Donations are not tax-deductible.',
  'legal.privacy':
    'We never collect, store, or publish the names, photographs, or details of the mothers we serve. Our partner clinic decides who receives a bundle.',

  // Impact
  'impact.bundles': 'Bundles delivered',
  'impact.mothers': 'Mothers served',
  'impact.volunteers': 'Volunteers',
  'impact.updated': 'Last updated',
  'impact.starting': 'We are just getting started. These numbers update after every delivery.',

  'contact.responseTime': 'Typical reply time',

  // Fact strip under the hero. Facts about the service, never metrics —
  // COMPLIANCE.md Rule 5.
  'facts.cost': 'Always free',
  'facts.costNote': 'No cost to families or clinics',
  'facts.season': 'In season',
  'facts.seasonNote': 'Picked the morning it goes out',
  'facts.route': 'Via a clinic',
  'facts.routeNote': 'Our partner decides who receives',

  // Gallery
  'gallery.eyebrow': 'The garden',
  'gallery.title': 'What a season looks like.',
  'gallery.garden': 'Young vegetable plants growing in the garden.',
  'gallery.harvest': 'Freshly harvested vegetables at a market stall.',
  'gallery.produce': 'A spread of mixed seasonal vegetables.',

  // Forms
  'form.comingSoon': 'Sign-up opens soon. Email us in the meantime.',

  // Errors
  'error.404.title': 'This page has not sprouted yet',
  'error.404.body': 'The page you are looking for does not exist. Let us get you back on track.',
  'error.backHome': 'Back to home',
} as const;

export type UIKey = keyof typeof en;

const es: Record<UIKey, string> = {
  // Navegación
  'nav.home': 'Inicio',
  'nav.about': 'Quiénes somos',
  'nav.partners': 'Para clínicas',
  'nav.getInvolved': 'Participa',
  'nav.impact': 'Nuestro impacto',
  'nav.contact': 'Contacto',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar menú',

  // Accesibilidad
  'a11y.skipToContent': 'Saltar al contenido',
  'a11y.mainNav': 'Navegación principal',
  'a11y.langSwitch': 'Cambiar idioma',
  'a11y.homeLink': 'Homegrown Hearts, inicio',

  // Llamados a la acción
  'cta.volunteer': 'Sea voluntario',
  'cta.partner': 'Colabore con nosotras',
  'cta.donate': 'Done materiales',
  'cta.learnMore': 'Conozca más',
  'cta.contactUs': 'Escríbanos',

  // Selector de idioma
  'lang.en': 'English',
  'lang.es': 'Español',

  // Pie de página
  'org.place': 'Condado de Union, Carolina del Norte',
  'footer.blurb':
    'Iniciativa estudiantil que cultiva paquetes gratuitos de verduras para madres embarazadas y recién dadas a luz.',

  'footer.advisor': 'Asesora responsable',
  'footer.advisorPending': 'Con el apoyo de una persona adulta responsable',
  'footer.followUs': 'Síganos',
  'footer.rights': 'Todos los derechos reservados.',

  // Legal — no reformular sin leer docs/COMPLIANCE.md
  'legal.status':
    'Homegrown Hearts es una iniciativa estudiantil. Solo aceptamos donaciones de materiales. Las donaciones no son deducibles de impuestos.',
  'legal.privacy':
    'Nunca recopilamos, guardamos ni publicamos los nombres, las fotografías ni los datos de las madres a quienes servimos. La clínica asociada decide quién recibe cada entrega.',

  // Impacto
  'impact.bundles': 'Entregas realizadas',
  'impact.mothers': 'Madres atendidas',
  'impact.volunteers': 'Voluntarios',
  'impact.updated': 'Última actualización',
  'impact.starting':
    'Apenas estamos comenzando. Estos números se actualizan después de cada entrega.',

  'contact.responseTime': 'Tiempo de respuesta habitual',

  // Franja de datos bajo el encabezado
  'facts.cost': 'Siempre gratis',
  'facts.costNote': 'Sin costo para familias ni clínicas',
  'facts.season': 'De temporada',
  'facts.seasonNote': 'Cosechado la misma mañana',
  'facts.route': 'Vía una clínica',
  'facts.routeNote': 'Nuestra clínica asociada decide quién recibe',

  // Galería
  'gallery.eyebrow': 'El huerto',
  'gallery.title': 'Así se ve una temporada.',
  'gallery.garden': 'Plantas jóvenes de hortalizas creciendo en el huerto.',
  'gallery.harvest': 'Verduras recién cosechadas en un puesto de mercado.',
  'gallery.produce': 'Una variedad de verduras de temporada.',

  // Formularios
  'form.comingSoon': 'La inscripción abre pronto. Mientras tanto, escríbanos.',

  // Errores
  'error.404.title': 'Esta página todavía no ha germinado',
  'error.404.body': 'La página que busca no existe. Le ayudamos a volver al camino.',
  'error.backHome': 'Volver al inicio',
};

export const ui = { en, es } as const;
