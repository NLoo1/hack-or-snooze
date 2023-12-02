"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();

}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

function openStorySubmit(){
  if($submitForm.hasClass("hidden")){
    $submitForm.show();
    $submitForm.removeClass('hidden');
  } else if(!($submitForm.hasClass("hidden"))){
    $submitForm.addClass('hidden');
    $submitForm.hide();
  }
}

function showFavorites(){
  // Remove LIs and show only favorites
  $allStoriesList.empty();

  if(currentUser.favorites.length == 0){
    $allStoriesList.text("You have no favorites!")
    $allStoriesList.show();
    return;
  }
  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    getUserFavorites($story)
    addOwnStories($story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

}

function showOwnStories(){
  // Remove LIs and show only stories
  $allStoriesList.empty();

  if(currentUser.ownStories.length == 0){
    $allStoriesList.text("You have no stories!")
    $allStoriesList.show();
    return;
  }

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    getUserFavorites($story)
    addOwnStories($story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();


}

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();  
  $navLeft.show();
}

$(document).on('click', '#nav-submit', openStorySubmit);
$(document).on('click', '#nav-login', navLoginClick);
$(document).on('click', '#nav-favorites', showFavorites);
$(document).on('click', '#nav-stories', showOwnStories);
// $navLogin.on("click", navLoginClick);
// $navFavorites.on("click", showFavorites);
// $navStories.on("click", showOwnStories);