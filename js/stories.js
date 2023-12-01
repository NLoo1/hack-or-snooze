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

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
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
  // location.reload();
  console.log("ADDED STORY!")
  putStoriesOnPage();

  $txtAuthor.val("");
  $txtTitle.val("");
  $txtURL.val("");
  $submitForm.hide();
}


async function favorite(){
  // ADD FAVORITE
  if($(this).hasClass("fa-regular")){
    $(this).removeClass("fa-regular").addClass("fa-solid");

    const favStory = $(this).parent().attr('id')
    const getStories = await axios.get(`${BASE_URL}/stories`)

    // Filter current user's favorites
    const addStory = getStories.data.stories.filter(e=> e.storyId == favStory);
    const test = new Story(...addStory);
    currentUser.favorites.push(new Story(...addStory));

    // Make changes to API
    const addFave = await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${favStory}`,
      method: "POST",
      data: {token: currentUser.loginToken},
    });

    console.log(addFave);

  }

  // REMOVE FAVORITE
  else if($(this).hasClass("fa-solid")){
    $(this).removeClass("fa-solid").addClass("fa-regular");

    const favStory = $(this).parent().attr('id')

    // FINISH THIS LATER
    currentUser.favorites = currentUser.favorites.filter((e) => e.storyId !== favStory)    

    const removeFave = await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${favStory}`,
      method: "DELETE",
      data: {token: currentUser.loginToken},
    });
    // const removeFave = await axios.delete(`${BASE_URL}/users/${currentUser}/favorites/`
    // + $(this).parent().attr('id') + "&?token=" + currentUser.loginToken);
  }

}

$btnSubmit.on("click", submitNewStory);
$allStoriesList.on('click', "i", favorite)