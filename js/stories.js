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

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-regular fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          <b>${story.title}</b>
        </a>
        <small class="story-hostname">(${hostName})</small><br>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li><hr>
    `);
}


// Goes through HTML and adds solid stars to any favorited stories
function getUserFavorites(story) {
  const favoriteStories = Object.values(currentUser.favorites).map(fav => fav.storyId);

  story.each(function () {
    const $storyId = $(this).attr('id');
    if (favoriteStories.includes($storyId)) {
      $(this).children("i").addClass('fa-solid').removeClass('fa-regular');
    }
  });
}


// Adds a remove button to user's own stories
function addOwnStories(story){
  const ownStories = Object.values(currentUser.ownStories).map(own => own.storyId);

  story.each(function () {
    const $storyId = $(this).attr('id');
    if (ownStories.includes($storyId)) {
      const $newButton = $("<input>")
      $newButton.prop('type', "button").attr("class", "btnRemoveStory").prop('value', "remove?");
      $(this).append($newButton);
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
    if(currentUser){
      getUserFavorites($story)
      addOwnStories($story);
    }
    
    $allStoriesList.append($story);
  }

  $faStar = $(".fa-regular.fa-star")
  $faStarFilled = $(".fa-solid.fa-star")
  $removeButton = $(".btnRemoveStory");

  $allStoriesList.show();

}

async function submitNewStory(){
  const author = $txtAuthor.val();
  const title = $txtTitle.val();
  const url = $txtURL.val();

  if(author == '' || title == '' || url == '') alert("Please fill out all fields!")
  else{
    await storyList.addStory(currentUser, {title: title, author: author, url: url});
    putStoriesOnPage();

    $txtAuthor.val("");
    $txtTitle.val("");
    $txtURL.val("");
    $submitForm.hide();
  }
  
}

// Removes story
async function removeStory(){
  const confirmed = window.confirm("Are you sure you want to delete this story?");
  if(confirmed){
    const $story = $(this).parent().attr('id'); 
    const favoriteStories = Object.values(currentUser.favorites).map(fav => fav.storyId);
 
    // Check if the removed story is a favorite
    if(favoriteStories.includes($story)){
      currentUser.favorites = Object.values(currentUser.favorites).filter(story => story.storyId !== $story);
      const removeFave = await axios({
        url: `${BASE_URL}/users/${currentUser.username}/favorites/${$story}`,
        method: "DELETE",
        data: {token: currentUser.loginToken},
      });
    }

    const removeStory = await axios({
      url: `${BASE_URL}/stories/${$story}`,
      method: "DELETE",
      data: {token: currentUser.loginToken},
    });

    // Remove from own stories 
    currentUser.ownStories = currentUser.ownStories.filter(story => story.storyId !== $story);

    // Remove from storyList
    storyList.stories = storyList.stories.filter(story => story.storyId !== $story);

    // Removes from DOM
    $(this).parent().remove();

    location.reload();
  }
  else return;
}

$(document).on("click", "#btnSubmit", submitNewStory);
$(document).on("click", ".btnRemoveStory", removeStory);
