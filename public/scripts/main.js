console.log(`main.js loaded`)

/// Variables
/// Variables - Attributes
const apiUrl = `https://davinas-cms.herokuapp.com/api/`
const dataElementAttr = `data-element`
const ariaExpandedAttr = `aria-expanded`
const hrefAttr = `href`
const disabledAttr = `disabled`
const formEl = `form`
const svgEl = `svg`
const iEl = `i`

/// Variables - Elements
const bodyEl = document.body
const primaryHeaderEl = document.querySelector(
  `[${dataElementAttr}="primary-header"]`
)
const latestPostLinkEl = document.querySelector(
  `[${dataElementAttr}="latest-post-link"]`
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
const subscribeFormEl = subscribeModalEl.querySelector(formEl)
const subscribeFormStatusEl = subscribeModalEl.querySelector(
  `[${dataElementAttr}="subscribe-form-status"]`
)

const featuredContentEl = document.querySelector(
  `[${dataElementAttr}="featured-content"]`
)

const contactFormEl = document.querySelector(
  `form[${dataElementAttr}="contact-form"]`
)
let contactFormStatusEl = null
if (contactFormEl) {
  contactFormStatusEl = contactFormEl.querySelector(
    `[${dataElementAttr}="contact-form-status"]`
  )
}

const latestEl = document.querySelector(`[${dataElementAttr}="latest"]`)
const archiveEl = document.querySelector(`[${dataElementAttr}="archive"]`)
const postEl = document.querySelector(`[${dataElementAttr}="post"]`)

// Add event listeners
btnPrimaryMenuEl
  .querySelector(svgEl)
  .addEventListener(`click`, (event) => togglePrimaryHeader())

btnSubscribeEl.addEventListener(`click`, (event) =>
  subscribeModalEl.showModal()
)
btnCloseModalEl
  .querySelector(iEl)
  .addEventListener(`click`, (event) => resetSubscribeForm())
subscribeFormEl.addEventListener(`submit`, (event) =>
  subscribeFormHandler(event)
)
if (contactFormEl) {
  contactFormEl.addEventListener(`submit`, (event) => contactFormHandler(event))
}

updateLatestPostLink()
resetSubscribeForm()
resetContactForm()
renderIndex()
renderArchive()
renderPost()

// Functions
function togglePrimaryHeader() {
  console.log(`fn: togglePrimaryHeader`)

  const ariaExpanded = primaryHeaderEl.getAttribute(ariaExpandedAttr)
  const btnAriaExpanded = btnPrimaryMenuEl.getAttribute(ariaExpandedAttr)

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

function resetSubscribeForm() {
  console.log(`fn: resetSubscribeForm`)

  subscribeModalEl.close()

  subscribeFormEl.reset()

  disableSubscribeForm(false)

  subscribeFormStatusEl.innerHTML = ``
}

function resetContactForm() {
  console.log(`fn: resetContactForm`)

  if (contactFormEl) {
    contactFormEl.reset()

    contactFormStatusEl.innerHTML = ``

    disableContactForm(false)
  }
}

function disableSubscribeForm(disable) {
  const submitBtnEl = subscribeFormEl.querySelector(`button[type="submit"]`)

  if (disable) {
    submitBtnEl.setAttribute(disabledAttr, true)
  } else {
    submitBtnEl.removeAttribute(disabledAttr)
  }
}

function disableContactForm(disable) {
  const submitBtnEl = contactFormEl.querySelector(`button[type="submit"]`)

  if (disable) {
    submitBtnEl.setAttribute(disabledAttr, true)
  } else {
    submitBtnEl.removeAttribute(disabledAttr)
  }
}

async function subscribeFormHandler(event) {
  console.log(`fn: subscribeFormHandler`)

  event.preventDefault()
  disableSubscribeForm(true)
  subscribeFormStatusEl.innerHTML = ``

  const form = event.currentTarget
  const url = form.action

  try {
    const formData = new FormData(form)
    const responseData = await postFormDataAsJson({ url, formData })

    const { message, status, errors } = responseData
    if (errors && errors.email && errors.email.length > 0) {
      subscribeFormStatusEl.innerHTML = `
        <p class="form-status__error">${message}</p>
      `

      disableSubscribeForm(false)
      return
    }

    if (status) {
      if (status === "ERROR") {
        subscribeFormStatusEl.innerHTML = `
          <p class="form-status__error">${message}</p>
        `

        disableSubscribeForm(false)
        return
      } else {
        subscribeFormStatusEl.innerHTML = `
          <p class="form-status__success">Thank you for subscribing!</p>
        `
        return
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function contactFormHandler(event) {
  console.log(`fn: contactFormHandler`)

  event.preventDefault()
  disableContactForm(true)
  contactFormStatusEl.innerHTML = ``

  const form = event.currentTarget
  const url = form.action

  try {
    const formData = new FormData(form)
    const responseData = await postFormDataAsJson({ url, formData })

    const errorHtml = ``
    const { message, status, errors } = responseData

    if (errors) {
      const { name, email, subject } = errors
      const messageErrors = errors.message

      if (name && name.length > 0) {
        name.map(
          (error) => (errorHtml += `<li class="text-danger-400">${error}</li>`)
        )
      }

      if (email && email.length > 0) {
        email.map(
          (error) => (errorHtml += `<li class="text-danger-400">${error}</li>`)
        )
      }

      if (subject && subject.length > 0) {
        subject.map(
          (error) => (errorHtml += `<li class="text-danger-400">${error}</li>`)
        )
      }

      if (messageErrors && messageErrors.length > 0) {
        messageErrors.map(
          (error) => (errorHtml += `<li class="text-danger-400">${error}</li>`)
        )
      }

      contactFormStatusEl.innerHTML = errorHtml
      disableContactForm(false)
      return
    }

    if (status) {
      if (status === "ERROR") {
        contactFormStatusEl.innerHTML = `
          <li class="text-danger-400">${message}</li>
        `

        disableContactForm(false)
        return
      } else {
        contactFormStatusEl.innerHTML = `
          <li class="text-success-400">Thank you for inquiry. We will get back to you within a few days!</li>
        `

        disableContactForm(false)
        return
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function postFormDataAsJson({ url, formData }) {
  const plainFormData = Object.fromEntries(formData.entries())
  const formDataJsonString = JSON.stringify(plainFormData)

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: formDataJsonString,
  }

  const response = await fetch(url, fetchOptions)
  return response.json()
}

async function getPageJsonData(url) {
  const response = await fetch(url)
  return response.json()
}

async function renderIndex() {
  console.log(`fn: renderIndex`)

  const data = await getPageJsonData(`${apiUrl}blog/home`)
  const { featured, latest, years } = data

  let selectedYear = dayjs().format("YYYY")
  let featuredContentHtml = ``

  if (featuredContentEl) {
    if (featured) {
      const { title, slug, summary } = featured
      featuredContentHtml = `
        <h2 class="heading heading-section">[Featured Article]</h2>
        <h3 class="heading heading-sub m-f-b-400">${title}</h3>
        <p class="m-f-b-400">${summary}</p>
        <p>
          <a href="/post?slug=${slug}" class="btn btn-secondary btn-slide">
            Read more <i class="fa-solid fa-chevron-right"></i>
          </a>
        </p>
      `
    }

    featuredContentEl.innerHTML = featuredContentHtml
  }

  let latestHtml = ``
  if (latestEl) {
    let postListHtml = `<p class="fz-small ta-center">No articles found.</p>`
    let postsHtml = ``
    if (latest && latest.length > 0) {
      latest.forEach((post) => {
        const { title, slug, summary, published_at } = post
        const publishedAt = dayjs(published_at).format(`DD MMM YYYY`)

        postsHtml += `
        <li class="post-list__item">
          <article class="post-article">
            <header class="post-article__header">
              <h3 class="heading heading-article">${title}</h3>
              <p class="article-date">${publishedAt}</p>
            </header>

            <p>${summary}</p>

            <p>
              <a href="post?slug=${slug}" class="btn btn-secondary-outline btn-slide">
                Read more <i class="fa-solid fa-chevron-right"></i>
              </a>
            </p>
          </article>
        </li>
        `
      })

      if (years && years.length > 0 && years[0]) {
        selectedYear = years[0].year
      }

      postListHtml = `
        <ul class="post-list" role="list">
          ${postsHtml}
        </ul>
      `
    }

    latestHtml = `
      <section class="section section-post">
        <div class="container container-no-padding">
          <div class="post-grid">
            <div class="post-cell-content">
              <h2 class="heading heading-section m-f-b-500">[Latests Articles]</h2>

              ${postListHtml}
            </div>
            <div class="post-cell-button">
              <a href="/archive?year=${selectedYear}&page=1" class="btn btn-secondary-outline btn-slide">
                See more articles <i class="fa-solid fa-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    `

    latestEl.innerHTML = latestHtml
  }
}

async function updateLatestPostLink() {
  console.log(`fn: updateLatestPostLink`)

  const data = await getPageJsonData(`${apiUrl}blog/home`)
  const { latest } = data
  if (latest && latest.length && latest[0]) {
    latestPostLinkEl.setAttribute(hrefAttr, `/post?slug=${latest[0].slug}`)
  }
}

async function renderArchive() {
  console.log(`fn: renderArchive`)

  let html = ``
  if (archiveEl) {
    const urlParams = new URLSearchParams(window.location.search)
    const selectedYear = urlParams.get("year")
    const selectedPage = urlParams.get("page")

    const data = await getPageJsonData(
      `${apiUrl}blog/archive/${selectedYear}?page=${selectedPage}`
    )
    const { years, posts } = data

    let yearsHtml = ``
    years.forEach((yearItem) => {
      const { year } = yearItem
      const active =
        Number(year) === Number(selectedYear) ? `btn-post-nav-active` : ``

      yearsHtml += `
        <li class="post-nav-list__item">
          <a href="/archive?year=${year}&page=1" class="btn btn-post-nav ${active}">${year}</a>
        </li>
      `
    })

    const first = 1
    const { last_page } = posts
    const firstUrl = `/archive?year=${selectedYear}&page=${first}`

    let prev = Number(selectedPage) - 1
    if (prev <= 1) {
      prev = 1
    }
    const prevUrl = `/archive?year=${selectedYear}&page=${prev}`

    let next = Number(selectedPage) + 1
    if (next >= last_page) {
      next = last_page
    }

    const nextUrl = `/archive?year=${selectedYear}&page=${next}`
    const lastUrl = `/archive?year=${selectedYear}&page=${last_page}`

    const pages = [first]
    if (last_page > first) {
      for (let i = 2; i <= last_page; ++i) {
        pages.push(i)
      }
    }

    let pagesHtml = ``
    pages.forEach((page) => {
      const pageUrl = `/archive?year=${selectedYear}&page=${page}`
      const active =
        Number(selectedPage) === page ? `btn-pagination-active` : ``

      pagesHtml += `
        <li class="pagination-list__item">
          <a href="${pageUrl}" class="btn btn-slide btn-pagination ${active}">${page}</a>
        </li>
      `
    })

    let postListHtml = `
      <p class="fz-small ta-center">No articles found.</p>
    `
    let postsHtml = ``
    if (posts.data && posts.data.length > 0 && posts.data[0]) {
      posts.data.forEach((post) => {
        const { title, slug, summary, featured, published_at } = post

        const featuredClass = featured ? `post-article-featured` : ``
        const postUrl = `../post?slug=${slug}`
        const publishedAt = dayjs(published_at).format(`DD MMM YYYY`)

        postsHtml += `
        <li class="post-list__item">
          <article class="post-article ${featuredClass}">
            <header class="post-article__header">
              <h3 class="heading heading-article">${title}</h3>
              <p class="article-date">${publishedAt}</p>
            </header>

            <p>${summary}</p>

            <p>
              <a href="${postUrl}" class="btn btn-secondary-outline btn-slide">
                Read more <i class="fa-solid fa-chevron-right"></i>
              </a>
            </p>
          </article>
        </li>
        `
      })

      postListHtml = `
        <ul class="post-list" role="list">
          ${postsHtml}
        </ul>
      `
    }

    html = `
    <section class="section section-post">
        <div class="container container-no-padding">
          <div class="post-grid post-grid-archive">
            <div class="post-cell-nav">
              <nav class="post-nav">
                <h2 class="heading heading-year">Year</h2>
                <ul class="post-nav-list" role="list">${yearsHtml}</ul>
              </nav>
            </div>
            <div class="post-cell-content">
              <h2 class="heading heading-section m-f-b-500">[${selectedYear}]</h2>

              ${postListHtml}
            </div>
            <div class="post-cell-pagination">
              <ul class="pagination-list" role="list">
                <li class="pagination-list__item">
                  <a href="${firstUrl}" class="btn btn-pagination" aria-label="first">
                    <i class="fa-solid fa-chevrons-left"></i>
                  </a>
                </li>
                <li class="pagination-list__item">
                  <a href="${prevUrl}" class="btn btn-pagination" aria-label="prev">
                    <i class="fa-solid fa-chevron-left"></i>
                  </a>
                </li>
                ${pagesHtml}
                <li class="pagination-list__item">
                  <a href="${nextUrl}" class="btn btn-pagination" aria-label="next">
                    <i class="fa-solid fa-chevron-right"></i>
                  </a>
                </li>
                <li class="pagination-list__item">
                  <a href="${lastUrl}" class="btn btn-pagination" aria-label="last">
                    <i class="fa-solid fa-chevrons-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `

    archiveEl.innerHTML = html
  }
}

async function renderPost() {
  console.log(`fn: renderPost`)

  let postHtml = ``

  if (postEl) {
    const urlParams = new URLSearchParams(window.location.search)
    const selectedSlug = urlParams.get("slug")

    const data = await getPageJsonData(`${apiUrl}blog/posts/${selectedSlug}`)
    const { posts } = data

    postHtml = `
        <section class="section-hero section-hero-post">
          <div class="container container-hero">
            <h2 class="heading heading-section">[404]</h2>
            <h1 class="heading heading-hero">Article Not Found <i class="fa-duotone fa-face-sad-tear"></i></h1>
          </div>
        </section>
      `

    if (posts.data && posts.data.length > 0 && posts.data[0]) {
      const { title, subtitle, text, featured, published_at } = posts.data[0]

      const featuredHtml = featured
        ? `<h2 class="heading heading-section">[Featured]</h2>`
        : ``
      const subtitleHtml = subtitle
        ? subtitle.replace(/(?:\r\n|\r|\n)/g, "<br>")
        : ``
      const publishedAt = dayjs(published_at).format(`DD MMM YYYY`)

      let subContent = ``
      if (subtitle) {
        subContent = `
          <div class="hero-divider m-v-y-300"></div>
          <p>${subtitleHtml}</p>
        `
      }

      postHtml = `
        <section class="section-hero section-hero-post">
          <div class="container container-hero">
            ${featuredHtml}
            <h1 class="heading heading-hero">${title}</h1>
            <p class="text-primary-300">${publishedAt}</p>
            ${subContent}

            <a href="#next" class="btn btn-hero">
              <i class="fa-solid fa-chevron-down hero-chevron-one"></i>
              <i class="fa-solid fa-chevron-down hero-chevron-two"></i>
            </a>
          </div>
        </section>

        <section id="next" class="section section-content">
          <article class="container container-section">
            <header class="visually-hidden">
              <h2>${title}</h2>
              <p>${subtitleHtml}</p>
            </header>

            ${marked.parse(text)}
          </article>
        </section>
      `
    }

    postEl.innerHTML = postHtml
  }
}
