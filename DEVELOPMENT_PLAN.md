# Richi Store: Review and Next Steps

## Current project status

The storefront now has one complete semantic HTML document, responsive styles
for the existing Richi layout, and JavaScript loaded with `defer`.

- Search, category filtering, quick view, mobile navigation, theme persistence,
  cart drawer open/close, and newsletter email validation are implemented.
- Eight clearly labeled catalog placeholders are shown. Product purchases and
  price/popularity sorting remain unavailable until the store supplies verified
  product IDs, prices, currencies, and popularity information. Add-to-cart is
  intentionally disabled rather than implying unavailable items are for sale.
- Delivery, payment, returns, support, and newsletter information is marked as
  unavailable/demo information instead of making unverified store claims.
- `three.js` remains empty and unused. It is not needed for this storefront.

## Remaining steps before launch

1. **Add verified catalog data.** Replace the generic catalog placeholders with
   store-provided products. Add verified prices and currency codes before
   enabling purchases; provide popularity data before enabling popularity sort.
   Do not infer specs, ratings, warranties, or reviews.
2. **Connect commerce.** Configure checkout and confirm inventory, delivery,
   returns, payment, and support information before advertising these services.
3. **Connect newsletter sign-up.** The current form validates email addresses
   locally and displays an honest demo message; it does not subscribe users.
   Connect it to the store's chosen mailing-list service.
4. **Verify before release.** Recheck unique IDs, in-page links, keyboard
   operation, visible focus, theme persistence, mobile navigation, responsive
   overflow, and browser-console errors after adding real data and services.
5. **Document launch details.** Update `README.md` with the actual run method,
   store integrations, and supported production features.

## Reusable prompt: improve the CSS to match this project

> Review `richi.html`, `richi.css`, and `richi.js` before making changes. Improve
> `richi.css` to match the actual Richi storefront markup. Fix misaligned text,
> uneven spacing, inconsistent card sizes, awkward wrapping, overflow, and
> responsive layout issues on phone, tablet, and desktop sizes.
>
> The page has an announcement bar, header/search/navigation, mobile
> navigation, theme toggle, catalog search/category filters/sorting, hero,
> catalog cards, promotional banner, benefits, newsletter, footer, quick-view
> dialog, and cart drawer. Style the real elements, including `.container`,
> `.announcement-bar`, `.site-header`, `.header-container`, `.main-nav`,
> `.header-actions`, `.mobile-nav-container`, `.category-filters`,
> `.hero-section`, `.hero-content`, `.products-grid`, `.product-card`,
> `.promo-banner`, `.benefits-grid`, `.newsletter-section`, `.site-footer`,
> `.cart-panel`, and `.quick-view-dialog`. Confirm selectors exist before
> introducing new ones.
>
> Keep Richi's dark navy/charcoal, cyan/blue, and white visual direction. Use
> consistent spacing, readable type, aligned responsive grids, subtle shadows,
> restrained transitions, visible `:focus-visible` indicators, sufficient
> contrast, and `prefers-reduced-motion` support. Keep the existing `body.light`
> theme convention and avoid external frameworks.
>
> Preserve the HTML structure and working behavior. Check for horizontal
> overflow at narrow widths and verify navigation, theme, cart, and newsletter
> controls after styling. Do not invent product details, prices, promotions,
> or customer ratings.
