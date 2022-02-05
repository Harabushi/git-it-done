let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");

function formSubmitHandler (event) {
  event.preventDefault();
  // get value from input element
  let username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } 
  else {
    alert("Please enter a GitHub username");
  }
};

function getUserRepos (user) {
  // format the github api url
  let apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data, user);
      });
    } 
    else {
      alert("Error: Github User Not Found");
    }
  })
  .catch(function(error) {
    // notice this '.catch()' getting chained onto the of the '.then()'
    alert("Unable to connect to GitHub")
  });
};

function displayRepos (repos, searchTerm) {

  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  // clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
for (let i = 0; i < repos.length; i++) {
  // format repo name
  let repoName = repos[i].owner.login + "/" + repos[i].name;

  // create a container for each repo
  let repoEl = document.createElement("div");
  repoEl.classList = "list-item flex-row justify-space-between align-center";

  // create a span element to hold repository name
  let titleEl = document.createElement("span");
  titleEl.textContent = repoName;

  // create a status element
  var statusEl = document.createElement("span");
  statusEl.classList = "flex-row align-center";

  // append to container
  repoEl.appendChild(titleEl);

  // check if current repo has issues or not
  if (repos[i].open_issues_count > 0) {
    statusEl.innerHTML =
      "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
  } else {
    statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  };

  // append to container
  repoEl.appendChild(statusEl);

  // append container to the dom
  repoContainerEl.appendChild(repoEl);
}
};

userFormEl.addEventListener("submit", formSubmitHandler);