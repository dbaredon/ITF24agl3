let albumsData = []; 

async function fetchAlbums() {
    try {
        const response = await fetch('albums.json');
        const albums = await response.json();
        return albums;
    } catch (error) {
        console.error('Error fetching albums:', error);
        return [];
    }
}


async function populateTable() {
    const albums = await fetchAlbums();
    albumsData = albums.slice(); 
    const tableBody = document.querySelector('#albumTable tbody');
    tableBody.innerHTML = '';

    albums.forEach(album => {
        const albumRow = document.createElement('tr');
        albumRow.innerHTML = `
  <td>${album.albumName}</td>
  <td>${album.artistName}</td>
  <td>${album.productionYear}</td>
  <td>${album.genre}</td>
`;
        tableBody.appendChild(albumRow);

        const songRow = document.createElement('tr');
        songRow.className = 'song-row';
        songRow.innerHTML = `<td colspan="4">
  <ul>
    ${album.trackList.map(track => `<li>${track.trackTitle} (${formatTime(track.trackTimeInSeconds)})</li>`).join('')}
  </ul>
</td>`;
        tableBody.appendChild(songRow);

        albumRow.addEventListener('click', () => {
            songRow.classList.toggle('active');
        });
    });
}


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}


function sortTable(property) {
    albumsData.sort((a, b) => {
        const valueA = a[property].toUpperCase();
        const valueB = b[property].toUpperCase();
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    });
    populateTable();
}

function filterTable() {
    const filterValue = document.getElementById('filterInput').value.toUpperCase();
    const tableRows = document.querySelectorAll('#albumTable tbody tr');

    tableRows.forEach(row => {
        let rowVisible = false;
        row.querySelectorAll('td').forEach(cell => {
            if (cell.innerText.toUpperCase().includes(filterValue)) {
                rowVisible = true;
            }
        });

        if (rowVisible) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

populateTable();

