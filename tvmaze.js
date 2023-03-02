"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const displaySection = document.getElementById("show_display");
let searchQuery = document.getElementById("search-query");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let searchQueryValue = searchQuery.value;

  const result = await axios.get("https://api.tvmaze.com/search/shows?", {
    params: { q: searchQueryValue },
  });

  let show = result.data[0].show;

  let myObject = [
    {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image.medium,
    },
  ];

  return myObject;

  // console.log(result.data[0].show.name);
  // console.log(result.data[0].show.id);
  // console.log(result.data[0].show.summary);
  // console.log(result.data[0].show.image);
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  let episodesButton = document.createElement("button");
  episodesButton.innerText = "Episodes";
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <div class="div" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
            
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
            <button class="get-episodes"> Episodes </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

// /** Handle search form submission: get shows from API and display.
//  *    Hide episodes area (that only gets shown if they ask for episodes)
//  */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

// /** Given a show ID, get from API and return (promise) array of episodes:
//  *      { id, name, season, number }
//  */

async function getEpisodesOfShow(id) {
  let results = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = results.data.map((result) => {
    [
      {
        id: result.id,
        name: result.name,
        season: result.season,
        url: result.url,
        rating: result.rating,
      },
    ];
  });
  return episodes;
}

// /** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $("#episodes-list").empty();
  for (let episode of episodes) {
    let listItem = document.createElement("LI");
    listItem.append(
      `${episode.name}, season ${episode.season}, episode${episode.number}`
    );
    $("#episodes-list").append(listItem);
  }

  $episodesArea.show();
}

$("#shows-list").on("click", ".get-episodes", async function (e) {
  let showId = $(e.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});
