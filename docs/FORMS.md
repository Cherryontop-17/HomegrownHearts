# Google Forms — field specification

**For the founders.** Two forms, both bilingual, ready to paste into Google
Forms. Build them, then paste the URLs into
[`src/config.ts`](../src/config.ts) and the site wires itself up.

```ts
export const FORMS = {
  volunteer: 'https://forms.gle/...', // paste here
  supplies: 'https://forms.gle/...', // paste here
} as const;
```

Until those are filled in, the site shows "Sign-up opens soon. Email us in the
meantime." automatically — nothing breaks, and no dead link is ever published.

---

## Rules for both forms

**Collect the minimum.** Every field is a reason for someone to abandon the
form, and every stored answer is data you are then responsible for.

- **Do not** turn on "Collect email addresses" _and_ also ask for email. Pick one — ask for it as a field, so people can use whatever address they prefer.
- **Do not** require a Google sign-in. It excludes people and it stores identities you do not need.
- **Do not** ask for date of birth, address, or anything about health.
- **Ask for age only as a yes/no** ("Are you 18 or over?"), never a number.
- Put the **bilingual label in one field**, English first, Spanish under it. Two separate forms would double the maintenance and halve the chance both stay current.

**Settings for both:**

| Setting                        | Value                           |
| ------------------------------ | ------------------------------- |
| Collect email addresses        | Off                             |
| Limit to 1 response            | Off                             |
| Require sign-in                | Off                             |
| Confirmation message           | See below                       |
| Responses → notification email | On, to the shared project inbox |

---

## Form 1 — Volunteer sign-up

**Form title**
`Volunteer with Homegrown Hearts / Sea voluntario con Homegrown Hearts`

**Form description**

```
We grow vegetables in Union County and deliver them free to a partner clinic. Tell us
a bit about you and we will be in touch within 2-3 days.

Cultivamos verduras en el condado de Union y las entregamos gratuitamente a una clínica
asociada. Cuéntenos un poco sobre usted y le escribiremos en 2 o 3 días.
```

---

**Q1 · Short answer · Required**

```
Your name
Su nombre
```

**Q2 · Short answer · Required** · _Response validation: Text → Contains → `@`_

```
Email
Correo electrónico
```

**Q3 · Multiple choice · Required**

```
Are you 18 or over?
¿Tiene 18 años o más?
```

- `Yes / Sí`
- `No — I will bring a parent or guardian's permission / No — traeré la autorización de mi padre, madre o tutor`

**Q4 · Checkboxes · Required**

```
What would you like to help with? Choose as many as you like.
¿En qué le gustaría ayudar? Elija todas las que quiera.
```

- `Growing days — planting, weeding, watering / Días de cultivo — sembrar, deshierbar, regar`
- `Harvest and pack mornings / Mañanas de cosecha y empaque`
- `Driving deliveries — needs a licence and a car / Llevar entregas — requiere licencia y carro`
- `Whatever is most useful / Lo que más falta haga`

**Q5 · Checkboxes · Optional**

```
When are you usually free?
¿Cuándo suele estar disponible?
```

- `Weekday mornings / Mañanas entre semana`
- `Weekday afternoons / Tardes entre semana`
- `Saturday mornings / Sábados por la mañana`
- `Sunday mornings / Domingos por la mañana`

**Q6 · Paragraph · Optional**

```
Anything else we should know?
¿Algo más que debamos saber?
```

**Q7 · Multiple choice · Required**

```
Which language would you prefer we reply in?
¿En qué idioma prefiere que le respondamos?
```

- `English`
- `Español`

**Confirmation message**

```
Thank you — we will be in touch within 2-3 days.
Gracias — le escribiremos en 2 o 3 días.
```

---

## Form 2 — Supply drive

**Form title**
`Donate supplies to Homegrown Hearts / Done materiales a Homegrown Hearts`

**Form description**

```
We accept donated supplies only — we cannot accept money. Tell us what you have
and we will arrange to collect it.

Solo aceptamos donaciones de materiales; no podemos aceptar dinero. Cuéntenos
qué tiene y coordinamos para recogerlo.
```

> ⚠️ That second sentence is not optional and must not be softened. See
> [`COMPLIANCE.md`](COMPLIANCE.md) Rule 2.

---

**Q1 · Short answer · Required**

```
Your name
Su nombre
```

**Q2 · Short answer · Required** · _Response validation: Text → Contains → `@`_

```
Email
Correo electrónico
```

**Q3 · Checkboxes · Required**

```
What can you donate?
¿Qué puede donar?
```

- `Seeds or seedlings / Semillas o plántulas`
- `Soil, compost, or mulch / Tierra, composta o mantillo`
- `Clean bags or food-safe containers / Bolsas limpias o envases aptos para alimentos`
- `Hand tools / Herramientas de mano`
- `Hoses or watering equipment / Mangueras o equipo de riego`
- `Something else — described below / Otra cosa — la describo abajo`

**Q4 · Paragraph · Optional**

```
Tell us a bit more — roughly how much, and what condition it is in.
Cuéntenos un poco más: aproximadamente cuánto y en qué estado está.
```

**Q5 · Multiple choice · Required**

```
How should we collect it?
¿Cómo lo recogemos?
```

- `I can drop it off / Puedo llevarlo yo`
- `Please collect it from me / Prefiero que lo recojan`
- `Either works / Cualquiera funciona`

**Q6 · Multiple choice · Required**

```
Which language would you prefer we reply in?
¿En qué idioma prefiere que le respondamos?
```

- `English`
- `Español`

**Confirmation message**

```
Thank you — we will be in touch within 2-3 days to arrange it.
Gracias — le escribiremos en 2 o 3 días para coordinar.
```

---

## After you build them

1. **Send yourself a test response through each form**, in both languages, and confirm the notification email arrives at the shared inbox.
2. Copy each form's share link (`Send` → link icon → Copy).
3. Paste both into `FORMS` in [`src/config.ts`](../src/config.ts).
4. Run `npm run dev` and confirm the buttons now point at the forms instead of showing the "opens soon" message.
5. Own the forms from the **shared project account**, not a personal one — see decision D3 in [`TASKS.md`](../TASKS.md). A form owned by a personal account disappears when that account does.
