$(document).ready(function() {
    // The base url for all API calls
    var apiBaseURL = 'https://api.themoviedb.org/3/';
    //   var apiKey = "28e7691b28199415eec6fd8d3e1ffd18"
    var apiKey = "aa646ce85e6dc313d0a091f90ffff9c4";

    // URL in Authentication. Base URL of image
    var imageBaseUrl = 'https://image.tmdb.org/t/p/';

    const movieUrl = apiBaseURL + 'movie/now_playing?api_key=' + apiKey;
    const showUrl = apiBaseURL + 'tv/top_rated?api_key=' + apiKey;

    var todoListData;

    function getToDo() {
        const request = async () => {
            const response = await fetch("/todo_list");
            const json = response.json();
            //   console.log(json);
            return json;
        }
        todoListData = request();
    }

    getToDo();

    // Check genreIDs and genre names:
    // http://api.themoviedb.org/3/movie/:movieID?api_key=<<>>
    //28 = action
    //12 = adventure
    //16 = animation
    //35 = comedy
    //80 = crime
    //18 = drama
    //10751 = family
    //14 = fantasy
    //36 = history
    //27 = horror
    //10402 = music
    //10749 = romance
    //878 = science fiction
    //53 = thriller

    function inToDoList(EntityType, EntityID) {
        console.log(EntityType + " " + EntityID);
        for (let i = 0; i < todoListData.length; i++) {
            //   console.log(EntityID + " " + todoListData[i].id);
            if (todoListData[i].id == EntityID && todoListData[i].type == EntityType) {
                return true;
            }
        }

        return false;
    }

    function getModalCode(obj, i, entityType) {
        var id = obj.results[i].id;
        var poster = imageBaseUrl + 'w300' + obj.results[i].poster_path;
        var title = obj.results[i].original_title;
        // var youtubeKey = movieKey.results[0].key;
        // var youtubeLink = 'https://www.youtube.com/watch?v=' + youtubeKey;
        var releaseDate = obj.results[i].release_date;
        var overview = obj.results[i].overview;
        var voteAverage = obj.results[i].vote_average;
        var codeHTML = '';
        codeHTML += '<div class="col-sm-3 eachMovie">';
        codeHTML += '<button type="button" class="btnModal" data-toggle="modal" data-target="#exampleModal' + obj.results[i].id + '" data-whatever="@' + obj.results[i].id + '">' + '<img src="' + poster + '"></button>';
        codeHTML += '<div class="modal fade" id="exampleModal' + obj.results[i].id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
        codeHTML += '<div class="modal-dialog" role="document">';
        codeHTML += '<div class="modal-content col-sm-12">';
        codeHTML += '<div class="col-sm-6 moviePosterInModal">';
        // codeHTML += '<a href="' + youtubeLink + '"><img src="' + poster + '"></a>';
        codeHTML += '<img src="' + poster + '">';
        codeHTML += '</div><br>'; //close trailerLink
        codeHTML += '<div class="col-sm-6 movieDetails">';
        codeHTML += '<div class="movieName">' + title + '</div><br>';
        // codeHTML += '<div class="linkToTrailer"><a href="' + youtubeLink + '"><span class="glyphicon glyphicon-play"></span>&nbspPlay trailer</a>' + '</div><br>';
        codeHTML += '<div class="release">Release Date: ' + releaseDate + '</div><br>';
        codeHTML += '<div class="overview">' + overview + '</div><br>'; // Put overview in a separate div to make it easier to style
        codeHTML += '<div class="rating">Rating: ' + voteAverage + '/10</div><br>';

        if (inToDoList(1, id)) {
            console.log("in to do");
            codeHTML += '<button id = "btn '+ entityType + ' ' + id + '" type="button" onclick="alert("Already added to your to-do list");">Add to binge list</button>';
        } else {
            console.log("not in to do");
            codeHTML += '<button id = "btn ' + entityType + ' ' + id + '" type="button" onclick="addToDo(' + entityType + ',' + id + ');">Add to binge list</button>';
        }
        codeHTML += '</div>'; //close movieDetails
        codeHTML += '</div>'; //close modal-content
        codeHTML += '</div>'; //close modal-dialog
        codeHTML += '</div>'; //close modal
        codeHTML += '</div>'; //close off each div
        return codeHTML;
    }

    function getDataFromJson(url, title, entity, divGrid, entityType) {
        fetch(url).then(response => response.json()).then((data) => {
            console.log(data);
            $(divGrid).append(title);
            for (let i = 0; i < data.results.length; i++) {
                var dataRes = data.results[i].id;
                var thisMovieUrl = apiBaseURL + entity + dataRes + '/videos?api_key=' + apiKey;
                // fetch(thisMovieUrl).then(response => response.json()).then((movieKey) => {
                //     var codeHTML = getModalCode(data, i, "movieKey");
                //     $(divGrid).append(codeHTML);
                // });

                var codeHTML = getModalCode(data, i, entityType);
                $(divGrid).append(codeHTML);
            }
        });
    }


    function getTrendingMovieData(divGrid) {
        var titleTrending = '<h1 class="movieGenreLabel">Trending Movies</h1>';
        getDataFromJson(movieUrl, titleTrending, "movie/", divGrid, 1);
    }

    function getTrendingShowData(divGrid) {
        var titleTrending = '<h1 class="movieGenreLabel">Trending Shows</h1>';
        getDataFromJson(showUrl, titleTrending, "tv/", divGrid, 2);
    }

    function getByGenre(genre_id, genre) {
        clearPage();
        getMoviesByGenre(genre_id, genre);
        getShowsByGenre(genre_id, genre);
    }

    function getMoviesByGenre(genre_id, genre) {
        const getMoviesByGenreURL = apiBaseURL + 'genre/' + genre_id + '/movies?api_key=' + apiKey + '&language=en-US&include_adult=false&sort_by=created_at.asc';
        const titleGenre = '<h1 class="movieGenreLabel">"' + genre + '" in Movies</h1>';
        getDataFromJson(getMoviesByGenreURL, titleGenre, "/movie", "#search-movie-grid");
    }

    function getShowsByGenre(genre_id, genre) {
        const getShowsByGenreURL = apiBaseURL + 'discover/tv?api_key=' + apiKey + '&language=en-US&sort_by=first_air_date.asc&with_genres=' + genre_id;
        const titleGenre = '<h1 class="movieGenreLabel">"' + genre + '" in Shows</h1>';
        getDataFromJson(getShowsByGenreURL, titleGenre, "/tv", "#search-show-grid");
    }

    function getHomePage() {
        clearPage();
        getTrendingMovieData("#movie-grid");
        getTrendingShowData("#show-grid");
        // getTrendingBookData("#book-grid");
    }

    function clearPage() {
        $('#movie-grid').html('');
        $('#show-grid').html('');
        $('#book-grid').html('');
        $('#search-movie-grid').html('');
        $('#search-show-grid').html('');
        $('#search-book-grid').html('');
    }
    getHomePage();

    //Reset HTML strings to empty to overwrite with new one!
    var nowPlayingHTML = '';
    var genreHTML = '';

    $('#action').click(function() {
        getByGenre(28, "Action");
    });
    $('#adventure').click(function() {
        getByGenre(12, "Adventure");
    });
    $('#animation').click(function() {
        getByGenre(16, "Animation");
    });
    $('#comedy').click(function() {
        getByGenre(35, "Comedy");
    });
    $('#drama').click(function() {
        getByGenre(18, "Drama");
    });
    $('#family').click(function() {
        getByGenre(10751, "Family");
    });
    $('#fantasy').click(function() {
        getByGenre(14, "Fantasy");
    });
    $('#horror').click(function() {
        getByGenre(27, "Horror");
    });
    $('#music').click(function() {
        getByGenre(10402, "Music");
    });
    $('#romance').click(function() {
        getByGenre(10749, "Romance");
    });
    $('#scifi').click(function() {
        getByGenre(878, "Sci-Fi");
    });
    $('#thriller').click(function() {
        getByGenre(53, "Thriller");
    });

    // Search Function
    //Run function searchMovies AFTER an input has been submitted. Submit form first.
    //Run searchMovies once to add an empty html to movie-grid using .html(). Then, overwrite it with the new html using .append(). Need to use .append() to overwrite or all the images will display on top of each other.
    var searchTerm = '';
    //reference entire search form
    $('.searchForm').submit(function(event) {
        event.preventDefault();
        clearPage();
        //search term is only concerned with what the user inputted
        //Get input with .val();
        searchTerm = $('.form-control').val();
        searchMovies();
        searchShows();
    });

    function searchMovies() {
        const searchMovieURL = apiBaseURL + 'search/movie?api_key=' + apiKey + '&language=en-US&page=1&include_adult=false&query=' + searchTerm;
        var searchedTerm = '<h1 class="movieGenreLabel" >"' + searchTerm + '" in Movies.</h1>'
        getDataFromJson(searchMovieURL, searchedTerm, "/movie", "#search-movie-grid");
    }

    function searchShows() {
        const searchShowURL = apiBaseURL + 'search/tv?api_key=' + apiKey + '&language=en-US&page=1&include_adult=false&query=' + searchTerm;
        var searchedTerm = '<h1 class="movieGenreLabel" >"' + searchTerm + '" in TV shows.</h1>'
        getDataFromJson(searchShowURL, searchedTerm, "/tv", "#search-show-grid");
    }

});

//.append(nowPlayingHTML) adds nowPlayingHTML to the present HTML
//.html(nowPlayingHTML) ovwrwrites the HTML present with nowPlayingHTML.
//.html() is faster than DOM creation
//.html() is good for when the element is empty.
//.append() is better when you want to add something dynamically, like adding a list item dynamically. (You would be adding a new string of HTML to the element.)

function addToDo(entityType, entityID) {
  $.ajax({
      url: '/mark_todo',
      type: 'POST',
      data: {EntityType: entityType, EntityID: entityID},
      success: function(data){
        if (data.status_code == 201){
            alert("Item added to bingelist!");
        }
        else{
            alert("Item couldn't be added to bingelist!");
        }
      }
  });
  document.getElementById("btn "+ entityType + " " + entityID).disabled = true;
}

function removeFromTodo(entityType, entityID) {
  $.ajax({
      url: '/unmark_todo',
      type: 'POST',
      data: {EntityType: entityType, EntityID: entityID},
      success: function(data){
        if (data.status_code == 200){
            alert("Item removed from bingelist!");
        }
        else{
            alert("Item couldn't be removed from bingelist!");
        }
      }
  });
  document.getElementById("btn "+ entityType + " " + entityID).disabled = true;
}
