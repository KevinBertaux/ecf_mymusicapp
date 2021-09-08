// Fonction de recherche
function apiGetSearch(query, type, limit, offset, firstSubmit) {
  const queryRequest = `https://musicbrainz.org/ws/2/recording?inc=releases+artists&query=${encodeURIComponent(type)}"${encodeURIComponent(query)}"&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;
  const request = new XMLHttpRequest();
  request.open("GET", queryRequest, true);
  request.addEventListener("readystatechange", function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        const c = response.count;
        c >= 1 ? responseCount.textContent = `Result${c > 1 ? `s:` : `:`} ${c} - Page ${currentPage} of ${Math.ceil(c / limit)}` : responseCount.textContent = `Result: 0`;
        if (firstSubmit) {
          currentPage = 1;
          buttonIndex = 1;
        }
        generatePageButtonList(c);
        if (c != 0) {
          showResults(response.recordings, offset);
        } else {
          responseTable.innerHTML = "";
        }
      }
      else {
        console.error(`NOPE!`);
      }
    }
  });
  request.setRequestHeader('Accept', 'application/json');
  request.send();
}

function apiGetRating(mbid) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://musicbrainz.org/ws/2/recording/${encodeURIComponent(mbid)}?inc=ratings`, true);
  request.addEventListener("readystatechange", function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        const ratingResponse = response.rating.value;
        if (ratingResponse != null) {
          modalInfoItems[5].textContent = `Note: ${ratingResponse} out of 5`;
        } else {
          modalInfoItems[5].textContent = `Note: N/A`;
        }
      }
      else {
        console.error(`NOPE!`);
        modalInfoItems[5].textContent = `Note:`;
      }
    }
  });
  request.setRequestHeader('Accept', 'application/json');
  request.send();
}

function apiGetCover(mbid) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://coverartarchive.org/release/${encodeURIComponent(mbid)}`, true);
  request.addEventListener("readystatechange", function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        response.images.forEach(function (image) {
          const modalCoverItem = document.createElement('li');
          modalCoverItem.classList.add('modal-cover-item');
          const cover = document.createElement('img');
          cover.src = (image.thumbnails.small);
          modalCoverItem.appendChild(cover);
          modalCoverList.appendChild(modalCoverItem);
        })
      }
      else {
        const noCover = document.createElement('p');
        //noCover.textContent = `No Cover Available`;
        modalCoverList.appendChild(noCover);
        console.error(`NOPE!`);
      }
    }
  });
  request.setRequestHeader('Accept', 'application/json');
  request.send();
}
