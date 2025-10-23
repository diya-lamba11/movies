const searchBtn = document.getElementById('search');
const titleInput = document.getElementById('title');
const yearInput = document.getElementById('year');
const typeSelect = document.getElementById('type');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementById('closeModal');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let currentPage = 1;
let lastSearchTitle = "";
let lastSearchYear = "";
let lastSearchType = "";



searchBtn.addEventListener('click',(async () => {
    const title = titleInput.value.trim();
    const year = yearInput.value.trim();
    const type = typeSelect.value;


    if (!title) {
        resultDiv.innerHTML = '<p style="color:red;">Please enter a title!</p>';
        return;
    }

    currentPage = 1;
    lastSearchTitle = title;
    lastSearchYear = year;
    lastSearchType = type;
    resultDiv.innerHTML = "";
    errorDiv.innerHTML = "loading....";
    loadMore();
}));
loadMoreBtn.addEventListener('click', loadMore);
async function loadMore() {
    if (!lastSearchTitle) return;


    const Url = `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_MOVIES_API_KEY}&s=${lastSearchTitle}&y=${lastSearchYear}&type=${lastSearchType}&page=${currentPage}`;

    try {
        const response = await fetch(Url);
        const data = await response.json();
        errorDiv.innerHTML = "";
        if (data.Response === "False") {
            if (currentPage === 1) resultDiv.innerHTML = "";
            errorDiv.innerHTML = `<p style="color:red;">${data.Error}</p>`;
            loadMoreBtn.style.display = "none";
            return;
        }

        errorDiv.innerHTML = "";
        data.Search.forEach(movie => {
            const card = document.createElement("div");

            const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150";

            card.innerHTML = `<img src="${poster}" alt="${movie.Title}" height="250" width="200"/>
                 <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                `;
            card.addEventListener('click', async () => {
                const detailUrl = `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_MOVIES_API_KEY}&i=${movie.imdbID}&plot=full`;
                const detailResponse = await fetch(detailUrl);
                const details = await detailResponse.json();

                modalBody.innerHTML = `
                    <h2>${details.Title}</h2>
                    <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/200"}" alt="${details.Title}" />
                    <p><strong>Year:</strong> ${details.Year}</p>
                    <p><strong>Genre:</strong> ${details.Genre}</p>
                    <p><strong>IMDB Rating:</strong> ${details.imdbRating}</p>
                    <p><strong>Plot:</strong> ${details.Plot}</p>
                `;
                modal.style.display = "flex";
            });

            resultDiv.appendChild(card);

        });
        if (currentPage * 10 < parseInt(data.totalResults)) {
            loadMoreBtn.style.display = "block";
        } else {
            loadMoreBtn.style.display = "none";
        }
        currentPage++;

        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });



    }


    catch (e) {
        resultDiv.innerHTML = '<p style="color:blue;">loading.....</p>';
        errorDiv.innerHTML = '<p style="color:red;">Please try again!</p>';
        loadMoreBtn.style.display = "none";

    }
}
