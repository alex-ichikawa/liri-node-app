require("dotenv").config();
let fs = require("fs");
let request = require("request");
let moment = require("moment");

var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);

let command = '';
let userRequest = '';

if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            let randomArray = data.split(",");
            command = randomArray[0];
            userRequest = randomArray[1];
            switch (command) {
                case "concert-this":
                    concertThis();
                    break;

                case "spotify-this-song":
                    spotifyThisSong();
                    break;

                case "movie-this":
                    movieThis();
                    break;

                default:
            }
        }
    })
} else {
    command = process.argv[2];
    userRequest = process.argv[3];

    switch (command) {
        case "concert-this":
            concertThis();
            break;

        case "spotify-this-song":
            spotifyThisSong();
            break;

        case "movie-this":
            movieThis();
            break;

        default:
    }

}

function concertThis() {
    let artist = userRequest.replace(/ /g, "+");
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(err, response, body) {
        if (!err && response.statusCode === 200) {
            let date = moment(JSON.parse(body)[0].datetime).format("L");
            console.log(`\r\nArtist: ${userRequest}\r\nVenue: ${JSON.parse(body)[0].venue.name}\r\nState: ${JSON.parse(body)[0].venue.region}\r\nCity: ${JSON.parse(body)[0].venue.city}\r\nDate: ${date}`);
            fs.appendFile("log.txt", `\r\nVenue: ${JSON.parse(body)[0].venue.name}\r\nState: ${JSON.parse(body)[0].venue.region}\r\nCity: ${JSON.parse(body)[0].venue.city}\r\nDate: ${date}`);
        } else {
            console.log(err);
        }
    });
}

function spotifyThisSong() {
    let song = userRequest.replace(/ /g, "+");
    spotify.search({
        type: 'track', query: song,
    }).then(function(data) {
        console.log(`\r\nArtist: ${data.tracks.items[0].artists[0].name}\r\nTitle: ${userRequest}\r\nAlbum: ${data.tracks.items[0].name}\r\nLink: ${data.tracks.items[0].artists[0].external_urls.spotify}`);
        fs.appendFile("log.txt", `\r\nArtist: ${data.tracks.items[0].artists[0].name}\r\nTitle: ${userRequest}\r\nAlbum: ${data.tracks.items[0].name}\r\nLink: ${data.tracks.items[0].artists[0].external_urls.spotify}`);
    })
        .catch(function(err) {
            console.log(`\r\nArtist: Ace of Base\r\nTitle: The Sign\r\nAlbum: The Sign\r\nLink: https://open.spotify.com/album/5UwIyIyFzkM7wKeGtRJPgB`);
        });
}

function movieThis() {
    let movie = userRequest.replace(/ /g, "+");
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + movie, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            console.log(`\r\nTitle: ${JSON.parse(body).Title}\r\nTitle: ${JSON.parse(body).Year}\r\nIMBD Rating: ${JSON.parse(body).imdbRating}\r\nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}\r\nProduced In: ${JSON.parse(body).Country}\r\nLanguage: ${JSON.parse(body).Language}\r\nPlot: ${JSON.parse(body).Plot}\r\nActors: ${JSON.parse(body).Actors}`);
            fs.appendFile("log.txt",`\r\nTitle: ${JSON.parse(body).Title}\r\nTitle: ${JSON.parse(body).Year}\r\nIMBD Rating: ${JSON.parse(body).imdbRating}\r\nRotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}\r\nProduced In: ${JSON.parse(body).Country}\r\nLanguage: ${JSON.parse(body).Language}\r\nPlot: ${JSON.parse(body).Plot}\r\nActors: ${JSON.parse(body).Actors}` )
        }
    });
}
