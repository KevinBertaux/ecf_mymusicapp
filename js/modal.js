const overlap = document.querySelector("#overlap");
const modalClose = document.querySelector("#modal-close");
const modalInfoItems = document.querySelectorAll(".modal-info-item");
const modalCoverList = document.querySelector('#modal-cover-list');
const modalArray = new (Array);

function showModal() {
  overlap.hidden = false;
}

function hideModal() {
  overlap.hidden = true;
}

function prepareModal(el) {
  modalArray.length = 0;
  const mbidRating = el.id;
  const mbidRelease = [];

  if (el.releases != undefined) {
    el.releases.forEach(release => {
      mbidRelease.push(release.id);
    })
    modalArray.push(`Album: ${el.releases[0].title}`);
  } else {
    modalArray.push(`Album: N/A`);
  }

  modalArray.push(`Title: ${el.title}`);
  modalArray.push(`Artist: ${el["artist-credit"][0].name}`);
  let tags = "N/A";
  if (el.tags != undefined) {
    tags = "";
    el.tags.forEach(tag => {
      tags += (tag.name + ", ");
    })
  }
  modalArray.push(`Genre: ${tags}`);

  if (el.length != undefined) {
    const lengthInSeconds = (el.length / 1000);
    const lengthMinute = Math.floor(lengthInSeconds / 60);
    const lengthSecond = Math.floor(lengthInSeconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    modalArray.push(`Length: ${lengthMinute}:${lengthSecond}`);
  } else {
    modalArray.push(`Length: N/A`);
  }
  setModalInfo();
  apiGetRating(mbidRating);

  mbidRelease.forEach((release, i) => {
    apiGetCover(mbidRelease[i]);
  })
}

function setModalInfo() {
  modalCoverList.innerHTML = "";
  modalArray.forEach((el, i) => {
    modalInfoItems[i].textContent = `${el}`;
  })
}

modalClose.addEventListener("click", hideModal);
