console.log(`main.js loaded`)

/// Variables
/// Variables - Attributes
const dataElementAttr = `data-element`
const ariaExpandedAttr = `aria-expanded`
const formEl = `form`
const svgEl = `svg`
const iEl = `i`

/// Variables - Elements
const bodyEl = document.body
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
const subscribeFormEl = subscribeModalEl.querySelector(formEl)
const subscribeFormStatusEl = subscribeModalEl.querySelector(
  `[${dataElementAttr}="subscribe-form-status"]`
)

const archiveEl = document.querySelector(`[${dataElementAttr}="archive"]`)

// Add event listeners
btnPrimaryMenuEl
  .querySelector(svgEl)
  .addEventListener(`click`, (event) => togglePrimaryHeader())

btnSubscribeEl.addEventListener(`click`, (event) =>
  subscribeModalEl.showModal()
)
btnCloseModalEl
  .querySelector(iEl)
  .addEventListener(`click`, (event) => resetSubcribeForm())
subscribeFormEl.addEventListener(`submit`, (event) =>
  subscribeFormHandler(event)
)

resetSubcribeForm()
renderArchive(archiveEl)

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

function resetSubcribeForm() {
  console.log(`fn: resetSubcribeForm`)

  subscribeModalEl.close()

  const emailEl = subscribeFormEl.elements[`email`]
  emailEl.value = ``

  subscribeFormStatusEl.innerHTML = ``
}

function subscribeFormHandler(event) {
  console.log(`fn: subscribeFormHandler`)

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

async function renderArchive(archiveEl) {
  console.log(`fn: renderArchive`)

  let html = ``
  if (archiveEl) {
    const urlParams = new URLSearchParams(window.location.search)
    const selectedYear = urlParams.get("year")
    const selectedPage = urlParams.get("page")

    const response = await fetch(
      `https://davinas-cms.herokuapp.com/api/blog/archive/${selectedYear}?page=${selectedPage}`
    )
    const data = await response.json()
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
    console.log(pages)

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

    let postsHtml = ``
    if (posts.data && posts.data.length > 0 && posts.data[0]) {
      posts.data.forEach(post => {
        const { title, slug, summary, featured, published_at } = post

        const featuredClass = featured ? `post-article-featured` : ``
        const postUrl = `post?slug=${slug}`
        const summaryHtml = summary.replace(/(?:\r\n|\r|\n)/g, '<br>')
        const publishedAt = dayjs(published_at).format(`DD MMM YYYY`)

        postsHtml += `
        <li class="post-list__item">
          <article class="post-article ${featuredClass}">
            <header class="post-article__header">
              <h3 class="heading heading-article">${title}</h3>
              <p class="article-date">${publishedAt}</p>
            </header>

            <p>${summaryHtml}</p>

            <p>
              <a href="${postUrl}" class="btn btn-secondary-outline btn-slide">
                Read more <i class="fa-solid fa-chevron-right"></i>
              </a>
            </p>
          </article>
        </li>
        `
      })
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

              <ul class="post-list" role="list">
                ${postsHtml}
              </ul>
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
  }

  archiveEl.innerHTML = html
}
