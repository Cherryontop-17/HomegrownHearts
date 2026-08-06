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

  // Dropdown sections. The garden group exists because the homepage is long
  // and the planting calendar was otherwise seven sections down.
  'nav.garden': 'The Garden',
  'nav.calendar': 'Planting calendar',
  'nav.calendarDesc': 'What goes in the ground, and when',
  'nav.crops': 'What we grow',
  'nav.cropsDesc': 'Seven crops and how long each takes',
  'nav.goals': 'Season goals',
  'nav.goalsDesc': 'What we are aiming for, and where we are',
  'nav.volunteer': 'Volunteer',
  'nav.volunteerDesc': 'Growing, packing, and driving',
  'nav.donate': 'Donate supplies',
  'nav.donateDesc': 'What we need, and what we cannot accept',
  'nav.dropOff': 'Drop-off locations',
  'nav.dropOffDesc': 'Where to bring donated supplies',
  'nav.recipeAi': 'Recipe AI',
  'nav.recipeAiDesc': 'The tool behind the bag tag',
  'nav.aboutUs': 'About us',
  'nav.aboutUsDesc': 'What Homegrown Hearts is',
  'nav.how': 'How it works',
  'nav.howDesc': 'Grow, harvest, pack, deliver',
  'nav.qr': 'QR code instructions',
  'nav.qrDesc': 'What the tag on every bundle does',
  'nav.getInTouch': 'Get in touch',
  'nav.getInTouchDesc': 'One shared inbox, answered in 2-3 days',
  'nav.founders': 'Our founders',
  'nav.foundersDesc': 'The two students who run this',
  'nav.ourPartners': 'Our partners',
  'nav.ourPartnersDesc': 'Who we already work with',
  'nav.partnersDesc': 'What a delivery partnership involves',
  'nav.openSubmenu': 'Show submenu',

  // Accessibility
  'a11y.skipToContent': 'Skip to content',
  'a11y.mainNav': 'Main navigation',
  'a11y.langSwitch': 'Change language',
  // Distinct names: two <nav> landmarks sharing one accessible name is a real
  // navigation problem for a screen-reader user, and both of these render twice
  // on every page.
  'a11y.langSwitchFooter': 'Change language, footer',
  'a11y.footerNav': 'Footer navigation',
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

  'footer.explore': 'Explore',
  'footer.help': 'Help out',
  'footer.more': 'More',
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

  // Season targets. These are GOALS, not achievements — COMPLIANCE Rule 5.
  // They are rendered only by <GoalMeter>, which forces the live actual from
  // config.ts to appear beside each one. Never surface these without that pair.
  'goals.caption': 'First season targets, August to November 2026',
  'goals.produce': 'Pounds of produce grown and delivered',
  'goals.bags': 'Bundles handed to our partner clinic',
  'goals.local': 'Grown at our own garden site',
  // `{actual}` and `{target}` are substituted in HomePage.astro.
  'goals.soFar': '{actual} of {target} so far',
  'goals.notStarted': 'Planting begins August 9',

  // Roadmap status labels.
  'roadmap.done': 'Done',
  'roadmap.now': 'In progress',
  'roadmap.ahead': 'Ahead',
  'roadmap.legend': 'Phases are highlighted on the calendar.',

  // Planting calendar and grow chart.
  // ⚠️ These label growing and kitchen facts only. There is no nutrient label
  // and no "good for" label, and neither may be added — COMPLIANCE Rule 1,
  // explained at length in docs/CROPS.md.
  'crops.prevMonth': 'Previous month',
  'crops.nextMonth': 'Next month',
  // "Planting schedule", not "sowing" — sowing is the correct horticultural
  // word but it is not one most readers use, and this list is aimed at donors
  // and volunteers rather than growers.
  'crops.sowing': 'Planting schedule',
  'crops.phaseDay': 'Phase day',
  'crops.sowingDay': 'Planting day',
  'crops.today': "Today's date",
  'crops.growing': 'Growing',
  'crops.harvest': 'Harvest window',
  // One per harvest tint on the chart. Named by pace, because that is what the
  // colour actually encodes and it is the point of succession planting.
  'crops.fast': 'Fast crop, ready first',
  'crops.medium': 'Mid-season',
  'crops.slow': 'Long-season, ready last',
  'crops.days': 'Days to harvest',
  'crops.sown': 'Planted',
  'crops.sourceNote':
    'Day counts are typical ranges for our growing zone and are being checked against NC State Extension guidance for the North Carolina Piedmont.',

  // Supply wishlist controls.
  'wishlist.all': 'Everything',
  'wishlist.filter': 'Filter supplies by type',
  // `{shown}` and `{total}` are substituted by the component's script.
  'wishlist.count': 'Showing {shown} of {total} supplies',

  // Flyers.
  'flyers.download': 'Download PDF',
  'flyers.view': 'opens full size in a new tab',

  // The QR-to-recipe tool.
  // ⚠️ Rule 1: this tool is keyed to WHAT IS IN THE BAG, never to who is
  // holding it. Do not reword any of these toward the reader, and do not
  // introduce the words nutrition, nutrients, or pregnancy into the first two.
  'smart.status': 'In development',
  'smart.qrCaption': 'A preview of the bag tag. Not a working code yet.',
  'smart.disclaimer':
    'Cooking ideas for the vegetables in the bundle. This is not dietary or medical advice. For guidance on eating during pregnancy, ask your clinician.',

  // Drop-off locations and their maps.
  'dropoff.pending': 'Not confirmed yet',
  'dropoff.showMap': 'Show map',
  'dropoff.openInMaps': 'Open in Google Maps',
  'dropoff.mapOf': 'Map of',
  // Explains the click-to-load embed. The promise this makes — that nothing is
  // requested until you press the button — is kept in MapEmbed.astro. Do not
  // reword it to describe a map that loads on its own.
  'dropoff.mapPrivacy': 'The map loads from Google only when you press this.',

  'contact.responseTime': 'Typical reply time',

  // Fact strip under the hero. Facts about the service, never metrics —
  // COMPLIANCE.md Rule 5.
  'facts.cost': 'Always free',
  'facts.costNote': 'No cost to families or clinics',
  'facts.season': 'In season',
  'facts.seasonNote': 'Picked the morning it goes out',
  'facts.route': 'Via a clinic',
  'facts.routeNote': 'Our partner decides who receives',
  // Rendered only behind has.partnerClinic() — COMPLIANCE Rule 4.
  'facts.partner': 'In partnership with',

  // Gallery
  'gallery.eyebrow': 'The garden',
  'gallery.title': 'What a season looks like.',
  'gallery.garden': 'Young vegetable plants growing in the garden.',
  'gallery.harvest': 'Freshly harvested vegetables at a market stall.',
  'gallery.produce': 'A spread of mixed seasonal vegetables.',
  /*
    For the wide gallery photo, which borrowed `gallery.produce` — a string
    saying "mixed seasonal vegetables" for a picture of soil and hand tools.

    Nothing was broken by that: `break-produce` is a DECORATIVE slot, and
    <Photo> discards alt for decorative images and renders alt="", which is the
    right output. This exists so the string in the source is true anyway. If
    the slot's role is ever flipped to 'meaningful' in photos.ts, the alt that
    starts being used should describe the photograph that is actually there.
  */
  'gallery.potting': 'Potting soil, a hand scoop, and pruners on a work surface.',

  // Forms
  'form.comingSoon': 'Sign-up opens soon. Email us in the meantime.',

  // The crop-matching easter egg on /get-involved/donate/.
  'game.open': 'Take a break. Can you name the crop?',
  'game.title': 'Name the crop',
  'game.intro': 'Match each vegetable to its name. Everything here is growing in our beds.',
  'game.reset': 'Shuffle',
  'game.moves': 'Moves: {n}',
  'game.match': 'Matched:',
  'game.won': 'All matched in {n} moves. Nicely done.',

  // "What should I cook tonight?" — the shuffling cards on /recipe-ai/.
  // ⚠️ Keyed to what is in the bundle, never to the reader. Read the header of
  // ShuffleCards.astro before rewording any of these.
  'shuffle.title': 'What should I cook tonight?',
  'shuffle.intro': 'Let the garden decide. Stop the cards and see what comes up.',
  'shuffle.spin': 'Shuffle the deck',
  'shuffle.stop': 'Stop!',
  'shuffle.again': 'Go again',
  'shuffle.resultEyebrow': 'The garden says',
  'shuffle.pending': 'IDK',
  'shuffle.pendingBody':
    'We have not written this one up yet. The recipes land alongside the first deliveries, and this will fill in as they do.',
  'shuffle.close': 'Close',
  'shuffle.alt': 'Not feeling it? Try Recipe AI',

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

  'nav.garden': 'El huerto',
  'nav.calendar': 'Calendario de siembra',
  'nav.calendarDesc': 'Qué se siembra y cuándo',
  'nav.crops': 'Qué cultivamos',
  'nav.cropsDesc': 'Siete cultivos y cuánto tarda cada uno',
  'nav.goals': 'Metas de temporada',
  'nav.goalsDesc': 'Hacia dónde vamos y dónde estamos',
  'nav.volunteer': 'Voluntariado',
  'nav.volunteerDesc': 'Sembrar, empacar y llevar entregas',
  'nav.donate': 'Done materiales',
  'nav.donateDesc': 'Qué necesitamos y qué no podemos recibir',
  'nav.dropOff': 'Puntos de entrega',
  'nav.dropOffDesc': 'Dónde llevar los materiales donados',
  'nav.recipeAi': 'Recetas con IA',
  'nav.recipeAiDesc': 'La herramienta detrás de la etiqueta',
  'nav.aboutUs': 'Sobre nosotras',
  'nav.aboutUsDesc': 'Qué es Homegrown Hearts',
  'nav.how': 'Cómo funciona',
  'nav.howDesc': 'Sembrar, cosechar, empacar, entregar',
  'nav.qr': 'Cómo usar el código QR',
  'nav.qrDesc': 'Qué hace la etiqueta de cada paquete',
  'nav.getInTouch': 'Escríbanos',
  'nav.getInTouchDesc': 'Un solo correo compartido, respuesta en 2 o 3 días',
  'nav.founders': 'Quiénes lo llevan',
  'nav.foundersDesc': 'Las dos estudiantes que lo dirigen',
  'nav.ourPartners': 'Nuestras alianzas',
  'nav.ourPartnersDesc': 'Con quiénes ya trabajamos',
  'nav.partnersDesc': 'En qué consiste una colaboración de entregas',
  'nav.openSubmenu': 'Mostrar submenú',

  // Accesibilidad
  'a11y.skipToContent': 'Saltar al contenido',
  'a11y.mainNav': 'Navegación principal',
  'a11y.langSwitch': 'Cambiar idioma',
  'a11y.langSwitchFooter': 'Cambiar idioma, pie de página',
  'a11y.footerNav': 'Navegación del pie de página',
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

  'footer.explore': 'Explorar',
  'footer.help': 'Colabore',
  'footer.more': 'Más',
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

  // Metas de temporada. Son METAS, no logros — Regla 5 de COMPLIANCE.
  'goals.caption': 'Metas de la primera temporada, de agosto a noviembre de 2026',
  'goals.produce': 'Libras de verduras cultivadas y entregadas',
  'goals.bags': 'Paquetes entregados a nuestra clínica aliada',
  'goals.local': 'Cultivado en nuestro propio huerto',
  'goals.soFar': '{actual} de {target} hasta ahora',
  'goals.notStarted': 'La siembra comienza el 9 de agosto',

  // Etapas del plan.
  'roadmap.done': 'Listo',
  'roadmap.now': 'En curso',
  'roadmap.ahead': 'Por venir',
  'roadmap.legend': 'Las etapas se resaltan en el calendario.',

  // Calendario de siembra y gráfico de cultivo.
  // ⚠️ Solo datos de cultivo y de cocina. No hay etiqueta de nutrientes ni de
  // «para qué sirve», y no se pueden agregar — Regla 1, ver docs/CROPS.md.
  'crops.prevMonth': 'Mes anterior',
  'crops.nextMonth': 'Mes siguiente',
  'crops.sowing': 'Calendario de siembra',
  'crops.phaseDay': 'Día de etapa',
  'crops.sowingDay': 'Día de siembra',
  'crops.today': 'Fecha de hoy',
  'crops.growing': 'En crecimiento',
  'crops.harvest': 'Ventana de cosecha',
  'crops.fast': 'Ciclo corto, primero',
  'crops.medium': 'Media temporada',
  'crops.slow': 'Temporada larga, al final',
  'crops.days': 'Días hasta la cosecha',
  'crops.sown': 'Sembrado',
  'crops.sourceNote':
    'Los días son rangos típicos para nuestra zona de cultivo y se están verificando con las guías de NC State Extension para el Piedmont de Carolina del Norte.',

  // Controles de la lista de insumos.
  'wishlist.all': 'Todo',
  'wishlist.filter': 'Filtrar insumos por tipo',
  'wishlist.count': 'Mostrando {shown} de {total} insumos',

  // Volantes.
  'flyers.download': 'Descargar PDF',
  'flyers.view': 'se abre en tamaño completo en una pestaña nueva',

  // La herramienta de recetas por código QR.
  // ⚠️ Regla 1: la herramienta responde a LO QUE HAY EN LA BOLSA, nunca a quien
  // la recibe. En español el registro se desliza hacia lo clínico con facilidad
  // (Regla 6): no usar "nutritivo", "saludable" ni "ayuda a" en estas líneas.
  'smart.status': 'En desarrollo',
  'smart.qrCaption': 'Una vista previa de la etiqueta. Todavía no es un código funcional.',
  'smart.disclaimer':
    'Ideas para cocinar las verduras del paquete. No es asesoría dietética ni médica. Para orientación sobre la alimentación durante el embarazo, consulte a su profesional clínico.',

  // Puntos de entrega y sus mapas.
  'dropoff.pending': 'Sin confirmar',
  'dropoff.showMap': 'Ver el mapa',
  'dropoff.openInMaps': 'Abrir en Google Maps',
  'dropoff.mapOf': 'Mapa de',
  'dropoff.mapPrivacy': 'El mapa se carga desde Google solo cuando usted lo pide.',

  'contact.responseTime': 'Tiempo de respuesta habitual',

  // Franja de datos bajo el encabezado
  'facts.cost': 'Siempre gratis',
  'facts.costNote': 'Sin costo para familias ni clínicas',
  'facts.season': 'De temporada',
  'facts.seasonNote': 'Cosechado la misma mañana',
  'facts.partner': 'En alianza con',
  'facts.route': 'Vía una clínica',
  'facts.routeNote': 'Nuestra clínica asociada decide quién recibe',

  // Galería
  'gallery.eyebrow': 'El huerto',
  'gallery.title': 'Así se ve una temporada.',
  'gallery.garden': 'Plantas jóvenes de hortalizas creciendo en el huerto.',
  'gallery.harvest': 'Verduras recién cosechadas en un puesto de mercado.',
  'gallery.produce': 'Una variedad de verduras de temporada.',
  'gallery.potting': 'Tierra para macetas, una pala de mano y tijeras de podar sobre una mesa.',

  // Formularios
  'form.comingSoon': 'La inscripción abre pronto. Mientras tanto, escríbanos.',

  // El juego de emparejar cultivos en /get-involved/donate/.
  'game.open': 'Tómese un descanso. ¿Adivina el cultivo?',
  'game.title': 'Adivine el cultivo',
  'game.intro': 'Empareje cada verdura con su nombre. Todas están creciendo en nuestros canteros.',
  'game.reset': 'Barajar',
  'game.moves': 'Movimientos: {n}',
  'game.match': 'Emparejado:',
  'game.won': 'Todo emparejado en {n} movimientos. Muy bien.',

  // Las cartas que se barajan en /recipe-ai/.
  // ⚠️ Responden a lo que hay en el paquete, nunca a quien lee.
  'shuffle.title': '¿Qué cocino hoy?',
  'shuffle.intro': 'Que decida el huerto. Detenga las cartas y vea qué sale.',
  'shuffle.spin': 'Barajar',
  'shuffle.stop': '¡Alto!',
  'shuffle.again': 'Otra vez',
  'shuffle.resultEyebrow': 'El huerto dice',
  'shuffle.pending': 'NPI',
  'shuffle.pendingBody':
    'Esta todavía no la hemos escrito. Las recetas llegan junto con las primeras entregas, y esto se irá llenando con ellas.',
  'shuffle.close': 'Cerrar',
  'shuffle.alt': '¿No le convence? Pruebe Recetas con IA',

  // Errores
  'error.404.title': 'Esta página todavía no ha germinado',
  'error.404.body': 'La página que busca no existe. Le ayudamos a volver al camino.',
  'error.backHome': 'Volver al inicio',
};

export const ui = { en, es } as const;
