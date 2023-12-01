"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-regular fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getUserFavorites(story) {
  const favoriteStories = Object.values(currentUser.favorites).map(fav => fav.storyId);

  story.each(function () {
    const $storyId = $(this).attr('id');
    if (favoriteStories.includes($storyId)) {
      $(this).children("i").addClass('fa-solid').removeClass('fa-regular');
    }
  });
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    getUserFavorites($story)
    $allStoriesList.append($story);
  }

  $faStar = $(".fa-regular.fa-star")
  $faStarFilled = $(".fa-solid.fa-star")
  $allStoriesList.show();
}

async function submitNewStory(){
  const author = $txtAuthor.val();
  const title = $txtTitle.val();
  const url = $txtURL.val();
  await storyList.addStory(currentUser, {title: title, author: author, url: url});
  putStoriesOnPage();

  $txtAuthor.val("");
  $txtTitle.val("");
  $txtURL.val("");
  $submitForm.hide();
}


$btnSubmit.on("click", submitNewStory);