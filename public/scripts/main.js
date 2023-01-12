console.log(`main.js loaded`)

/// Variables
/// Variables - Attributes
const dataElementAttr = `data-element`
const ariaExpandedAttr = `aria-expanded`

/// Variables - Elements
const primaryHeaderEl = document.querySelector(
  `[${dataElementAttr}="primary-header"]`
)
const btnPrimaryMenuEl = document.querySelector(
  `[${dataElementAttr}="btn-primary-menu"]`
)
const btnSubscribeEl = document.querySelector(
  `[${dataElementAttr}="btn-subscribe"]`
)
const subscribeModalEl = document.querySelector(
  `[${dataElementAttr}="subscribe-modal"]`
)

const btnCloseModalEl = subscribeModalEl.querySelector(
  `[${dataElementAttr}="btn-close-modal"]`
)
const subscribeFormEl = subscribeModalEl.querySelector(`form`)
const subscribeFormStatusEl = subscribeModalEl.querySelector(
  `[${dataElementAttr}="subscribe-form-status"]`
)

btnPrimaryMenuEl
  .querySelector(`svg`)
  .addEventListener(`click`, (event) => togglePrimaryHeader())

btnSubscribeEl.addEventListener(`click`, (event) =>
  subscribeModalEl.showModal()
)
btnCloseModalEl
  .querySelector(`i`)
  .addEventListener(`click`, (event) => resetSubcribeForm())
subscribeFormEl.addEventListener(`submit`, (event) =>
  subscribeFormHandler(event)
)
resetSubcribeForm()

function togglePrimaryHeader() {
  const ariaExpanded = primaryHeaderEl.getAttribute(ariaExpandedAttr)
  const btnAriaExpanded = btnPrimaryMenuEl.getAttribute(ariaExpandedAttr)
  console.log(ariaExpanded)

  if (ariaExpanded) {
    primaryHeaderEl.removeAttribute(ariaExpandedAttr)
  } else {
    primaryHeaderEl.setAttribute(ariaExpandedAttr, true)
  }

  if (btnAriaExpanded) {
    btnPrimaryMenuEl.removeAttribute(ariaExpandedAttr)
  } else {
    btnPrimaryMenuEl.setAttribute(ariaExpandedAttr, true)
  }
}

function resetSubcribeForm() {
  subscribeModalEl.close()

  const emailEl = subscribeFormEl.elements[`email`]
  emailEl.value = ``

  subscribeFormStatusEl.innerHTML = ``
}

function subscribeFormHandler(event) {
  subscribeFormStatusEl.innerHTML = ``

  event.preventDefault()

  const emailEl = subscribeFormEl.elements[`email`]
  if (emailEl.value && emailEl.value !== ``) {
    subscribeFormStatusEl.innerHTML = `
      <p class="form-status__success">Thank you for subscribing!</p>
    `
  } else {
    subscribeFormStatusEl.innerHTML = `
      <p class="form-status__error">Please input your email!</p>
    `
  }
}