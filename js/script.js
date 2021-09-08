let offset = 0;
let limit = 25;
let currentPage = 1;
let buttonIndex = 1;
let eventListenerAdded = false;

// DOM Header
const queryField = document.querySelector("#query-field");
const typeField = document.querySelector("#type-field");
const limitField = document.querySelector("#limit-field");
const submitButton = document.querySelector("#submit-button");
const searchForm = document.querySelector("#search-form");

// DOM Response section
const loadingImage = document.createElement("img");
loadingImage.src = ("/img/Infinity-2s-100px.svg");
loadingImage.classList.add("display-none");
const pageButtonList = document.querySelector(".page-button-list");
const pageButtonItems = document.querySelectorAll(".page-button-item");
const tableHeadText = document.querySelector("#table-head-text");
const responseCount = document.querySelector("#response-count");
const responseTable = document.querySelector("#response-table");
responseTable.appendChild(loadingImage);

queryField.addEventListener("input", ev => {
  ev.preventDefault();
  if (queryField.value.length >= 1) {
    submitButton.disabled = false;
    if (!eventListenerAdded) {
      eventListenerAdded = true;
      searchForm.addEventListener("submit", ev => {
        ev.preventDefault();
        launchQuery(0, true);
      });
    }
  } else if (queryField.value.length == 0) {
    submitButton.disabled = true;
  }
})

function launchQuery(offset, firstSubmit) {
  loadingImage.classList.remove("display-none");
  const queryValue = queryField.value;
  const typeValue = typeField.value;
  limit = limitField.value;
  apiGetSearch(queryValue, typeValue, limit, offset, firstSubmit);
}

function generatePageButtonList(c) {
  const nbButton = Math.ceil(c / limit);
  pageButtonList.innerHTML = "";

  if (nbButton > 1) {
    let j = 0;
    if (nbButton < 9) {
      j = nbButton;
    } else {
      j = 9;
    }

    for (let i = 0; i < j; i++) {
      const pageButtonItem = document.createElement("li");
      const pageButton = document.createElement("button");
      pageButton.classList.add("page-button");
      pageButton.type = "submit";
      pageButtonList.appendChild(pageButtonItem);
      pageButtonItem.appendChild(pageButton);
    }

    pageButtonList.childNodes.forEach((el, i) => {
      if (i + buttonIndex <= nbButton) {
        el.firstChild.textContent = i + buttonIndex;
        el.firstChild.textContent == currentPage ? el.firstChild.disabled = true : el.firstChild.disabled = false;
        el.addEventListener("click", ev => {
          ev.preventDefault();
          window.scroll(0, 0);
          launchQuery((limit * (el.firstChild.textContent - 1)), false);
          currentPage = el.firstChild.textContent;
          buttonIndex = currentPage - 4;
          buttonIndex = buttonIndex < 1 ? 1 : buttonIndex;
        });
      } else {
        el.innerHTML = "";
      }
    });

    const firstPageButtonItem = document.createElement("li");
    const firstPageButton = document.createElement("button");
    firstPageButton.classList.add("page-button");
    firstPageButton.type = "submit";
    firstPageButtonItem.appendChild(firstPageButton);
    pageButtonList.prepend(firstPageButtonItem);
    firstPageButtonItem.firstChild.textContent = `First`;
    currentPage === 1 ? firstPageButton.disabled = true : firstPageButtonItem.disabled = false;
    firstPageButtonItem.addEventListener("click", ev => {
      ev.preventDefault();
      window.scroll(0, 0);
      launchQuery(0, false);
      currentPage = 1;
      buttonIndex = currentPage - 4;
      buttonIndex = buttonIndex < 1 ? 1 : buttonIndex;
    });

    const lastPageButtonItem = document.createElement("li");
    const lastPageButton = document.createElement("button");
    lastPageButton.classList.add("page-button");
    lastPageButton.type = "submit";
    lastPageButtonItem.appendChild(lastPageButton);
    pageButtonList.append(lastPageButtonItem);
    lastPageButtonItem.lastChild.textContent = `Last`;
    currentPage === nbButton ? lastPageButton.disabled = true : lastPageButtonItem.disabled = false;
    lastPageButtonItem.addEventListener("click", ev => {
      ev.preventDefault();
      window.scroll(0, 0);
      launchQuery(limit * (nbButton - 1), false);
      currentPage = nbButton;
      buttonIndex = currentPage - 4;
      buttonIndex = buttonIndex < 1 ? 1 : buttonIndex;
    });

    tableHeadText.textContent = "";
  } else {
    tableHeadText.textContent = "No results found";
    loadingImage.classList.add("display-none");
  }
}

function showResults(response, o) {
  responseTable.innerHTML = "";
  responseTable.appendChild(loadingImage);

  response.forEach((el, id) => {
    const responseItem = document.createElement("li");
    responseItem.classList.add("response-item");
    const responseTableList = document.createElement("ul");
    responseTableList.classList.add("response-table-list");
    responseTableList.setAttribute("role", "list");
    responseItem.appendChild(responseTableList);

    for (let i = 0; i < 5; i++) {
      const responseTableItem = document.createElement("li");
      responseTableItem.classList.add("response-table-item");
      responseTableList.appendChild(responseTableItem);
      switch (i) {
        case 0:
          responseTableItem.textContent = id + 1 + (o);
          break;
        case 1:
          responseTableItem.textContent = el["artist-credit"][0].name;
          break;
        case 2:
          responseTableItem.textContent = el.title;
          break;
        case 3:
          if (el.releases != undefined) {
            responseTableItem.textContent = el.releases[0].title;
          }
          break;
        case 4:
          const infoButton = document.createElement("button");
          infoButton.classList.add("info-button");
          infoButton.textContent = "➕";
          responseTableItem.appendChild(infoButton);
          infoButton.addEventListener("click", () => {
            prepareModal(el);
            showModal();
          })
          break;
      }
    }
    responseTable.appendChild(responseItem);
  })
  loadingImage.classList.add("display-none");
}
