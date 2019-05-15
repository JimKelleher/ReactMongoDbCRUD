import * as WorkingWebNodeJsServices from '../app/WorkingWebNodeJsServices.js';


export class Artist {

  constructor() {

    // Init:
    this.decade = 0;
    this.genre = "";

    // NOTE: The "write database" is the master copy, always contains all rows and
    // is tied to the MongoDB database during online processing:
    this.writeArtists = [];

    // NOTE 2: The "read database" is the slave copy, only contains the visible rows
    // (invisible rows being caused by filtering or deletion) and drives the generation
    // of the React GUI:
    this.readArtists = [];

    var response;
    var artists = [];
    globalRetrievalError = "";

		// Online - JSON from MongoDB:
		if (globalOnlineData == true) {

      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
      response = this.getJsonFromMongoDb();
      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
      //response = '[{"id":"ABBA","decade":1970,"genre":"POP","image":"http://nostalgic90s.com/wp-content/uploads/2015/10/abba-music-group.png"},{"id":"Above & Beyond","decade":2010,"genre":"CHILL","image":"http://static3.bigstockphoto.com/thumbs/9/2/1/large1500/12987428.jpg"},{"id":"Adele","decade":2010,"genre":"POP","image":"https://i.ytimg.com/vi/sql3dKRJy_E/maxresdefault.jpg"},{"id":"Barry White","decade":1970,"genre":"SOUL","image":"https://upload.wikimedia.org/wikipedia/commons/9/9c/Grand_Gala_du_Disque_Populaire_1974_-_Barry_White_927-0099.jpg"},{"id":"Bob Marley","decade":1970,"genre":"REGGAE","image":"http://www.bigfootevents.co.uk/Bigfoot/media/BigfootGallery/Images/Tributes/Bob-On-full-band.jpg"},{"id":"Bobby Darin","decade":1960,"genre":"CLASSIC","image":"https://s-media-cache-ak0.pinimg.com/736x/5b/53/a9/5b53a979c96c16579be243b1b93186f1.jpg"},{"id":"Buddy Holly","decade":1950,"genre":"ROCK","image":"https://s-media-cache-ak0.pinimg.com/originals/44/2b/b2/442bb2b6394d39d96a2d1e16061e260e.jpg"},{"id":"Coldplay","decade":2000,"genre":"ROCK","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Coldplay_Music_Midtown.jpg/220px-Coldplay_Music_Midtown.jpg"},{"id":"Collective Soul","decade":1990,"genre":"SOUL","image":"https://i.pinimg.com/736x/28/64/02/2864024d0742e61369c941fdbcc2e7b1--music-songs-songs-album.jpg"},{"id":"Delerium","decade":1980,"genre":"CHILL","image":"https://upload.wikimedia.org/wikipedia/commons/f/f8/Delirium_Un_disco_per_lestate.jpg"},{"id":"Elton John","decade":1970,"genre":"ROCK","image":"https://www.billboard.com/files/styles/article_main_image/public/stylus/2512859-elvis-bob-birch-617-409.jpg"},{"id":"Frank Sinatra","decade":1940,"genre":"CLASSIC","image":"https://upload.wikimedia.org/wikipedia/commons/a/af/Frank_Sinatra_%2757.jpg"},{"id":"Henry Mancini","decade":1950,"genre":"CLASSIC","image":"http://www.lasplash.com/uploads//1/bigband.jpg"},{"id":"Jem","decade":2000,"genre":"POP","image":"http://jem-music.com/wp-content/uploads/2016/06/Jem-Down-To-Earth.jpg"},{"id":"Jimmy Webb","decade":1970,"genre":"CLASSIC","image":"https://images-na.ssl-images-amazon.com/images/I/51gTP8IWWKL.jpg"},{"id":"Johnny Cash","decade":1950,"genre":"COUNTRY","image":"http://cp91279.biography.com/Johnny-Cash_The-Man-in-Black_HD_768x432-16x9.jpg"},{"id":"Kelly Rowland","decade":2000,"genre":"SOUL","image":"https://www.bellanaija.com/wp-content/uploads/2016/05/GettyImages-533631890.jpg"},{"id":"Kris Kristofferson","decade":1970,"genre":"COUNTRY","image":"http://tasteofcountry.com/files/2016/04/kris-kristofferson-top-career-songs.jpg?w=630&h=420&zc=1&s=0&a=t&q=89"},{"id":"Little Richard","decade":1950,"genre":"SOUL","image":"http://media.gettyimages.com/photos/rock-and-roll-pioneer-little-richard-preaches-to-a-small-group-in-a-picture-id129594412"},{"id":"Lyle Lovett","decade":1980,"genre":"COUNTRY","image":"http://g1j1g1up91ni2kf7q4x2f132.wpengine.netdna-cdn.com/wp-content/uploads/2015/08/LyleLovett3.jpg"},{"id":"No Doubt","decade":1990,"genre":"ROCK","image":"https://images.bit-tech.net/news_images/2009/11/no-doubt-sues-activision-over-band-hero/article_img.jpg"},{"id":"Sarah Brightman","decade":1990,"genre":"CLASSIC","image":"http://images1.buymusichere.net/images/universal/162/04228391162.jpg"},{"id":"Seal","decade":1990,"genre":"POP","image":"http://media.gettyimages.com/photos/singer-seal-arrives-at-warner-music-groups-2011-post-grammy-event-at-picture-id109070280?s=594x594"},{"id":"Sly and the Family Stone","decade":1960,"genre":"SOUL","image":"http://thepressoffice.com/wp-content/uploads/2016/04/family-stone-21e7ec1af3fbdd24.jpg"},{"id":"The B-52\'s","decade":1980,"genre":"POP","image":"https://s-media-cache-ak0.pinimg.com/236x/96/f5/a4/96f5a4d895d946dadfc5e88a9d0f8f53.jpg"},{"id":"The Cardigans","decade":1990,"genre":"CHILL","image":"http://www.alwaysontherun.net/cardiganstop2.jpg"},{"id":"The Pretenders","decade":1980,"genre":"ROCK","image":"http://d1ya1fm0bicxg1.cloudfront.net/2015/04/promoted-media-optimized_55341fc64d20d.jpg"},{"id":"The Who","decade":1960,"genre":"ROCK","image":"http://www.acappellanews.com/images/brutha.jpg"},{"id":"Tom Jones","decade":1960,"genre":"POP","image":"https://upload.wikimedia.org/wikipedia/commons/6/69/Tom_Jones_concert.jpg"},{"id":"Zero 7","decade":2000,"genre":"CHILL","image":"http://www.rightchordmusic.co.uk/wp/wp-content/uploads/2015/08/dear-plastic-001.jpg"},{"id":"Ziggy Marley","decade":2000,"genre":"REGGAE","image":"http://questgarden.com/106/46/3/100709090340/images/Ziggy%20Marley.jpg"}]';
      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

      try {
        artists = JSON.parse(response);
      } catch (error) {
        globalRetrievalError = "Retrieve database failure.  Error: " + response;
      }

		}
		// Offline - JSON from WorkingWeb Database app:
		else {

      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
      response = this.getJsonFromJsonDatabase();
      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
      if(response == "") {
        globalRetrievalError = "Artist retrieval error."
      }
      else {
        // The escaped apostrophes are for the server, not the client.  Turn them
        // into regular apostrophes:
        response = response.split("\\'").join("'");

        var artist_object = JSON.parse(response);
        artists = artist_object.artist;
      }
      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
      // response = '[{"id":"ABBA","decade":1970,"genre":"POP","image":"http://nostalgic90s.com/wp-content/uploads/2015/10/abba-music-group.png"},{"id":"Above & Beyond","decade":2010,"genre":"CHILL","image":"http://static3.bigstockphoto.com/thumbs/9/2/1/large1500/12987428.jpg"},{"id":"Adele","decade":2010,"genre":"POP","image":"https://i.ytimg.com/vi/sql3dKRJy_E/maxresdefault.jpg"},{"id":"Barry White","decade":1970,"genre":"SOUL","image":"https://upload.wikimedia.org/wikipedia/commons/9/9c/Grand_Gala_du_Disque_Populaire_1974_-_Barry_White_927-0099.jpg"},{"id":"Bob Marley","decade":1970,"genre":"REGGAE","image":"http://www.bigfootevents.co.uk/Bigfoot/media/BigfootGallery/Images/Tributes/Bob-On-full-band.jpg"},{"id":"Bobby Darin","decade":1960,"genre":"CLASSIC","image":"https://s-media-cache-ak0.pinimg.com/736x/5b/53/a9/5b53a979c96c16579be243b1b93186f1.jpg"},{"id":"Buddy Holly","decade":1950,"genre":"ROCK","image":"https://s-media-cache-ak0.pinimg.com/originals/44/2b/b2/442bb2b6394d39d96a2d1e16061e260e.jpg"},{"id":"Coldplay","decade":2000,"genre":"ROCK","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Coldplay_Music_Midtown.jpg/220px-Coldplay_Music_Midtown.jpg"},{"id":"Collective Soul","decade":1990,"genre":"SOUL","image":"https://i.pinimg.com/736x/28/64/02/2864024d0742e61369c941fdbcc2e7b1--music-songs-songs-album.jpg"},{"id":"Delerium","decade":1980,"genre":"CHILL","image":"https://upload.wikimedia.org/wikipedia/commons/f/f8/Delirium_Un_disco_per_lestate.jpg"},{"id":"Elton John","decade":1970,"genre":"ROCK","image":"https://www.billboard.com/files/styles/article_main_image/public/stylus/2512859-elvis-bob-birch-617-409.jpg"},{"id":"Frank Sinatra","decade":1940,"genre":"CLASSIC","image":"https://upload.wikimedia.org/wikipedia/commons/a/af/Frank_Sinatra_%2757.jpg"},{"id":"Henry Mancini","decade":1950,"genre":"CLASSIC","image":"http://www.lasplash.com/uploads//1/bigband.jpg"},{"id":"Jem","decade":2000,"genre":"POP","image":"http://jem-music.com/wp-content/uploads/2016/06/Jem-Down-To-Earth.jpg"},{"id":"Jimmy Webb","decade":1970,"genre":"CLASSIC","image":"https://images-na.ssl-images-amazon.com/images/I/51gTP8IWWKL.jpg"},{"id":"Johnny Cash","decade":1950,"genre":"COUNTRY","image":"http://cp91279.biography.com/Johnny-Cash_The-Man-in-Black_HD_768x432-16x9.jpg"},{"id":"Kelly Rowland","decade":2000,"genre":"SOUL","image":"https://www.bellanaija.com/wp-content/uploads/2016/05/GettyImages-533631890.jpg"},{"id":"Kris Kristofferson","decade":1970,"genre":"COUNTRY","image":"http://tasteofcountry.com/files/2016/04/kris-kristofferson-top-career-songs.jpg?w=630&h=420&zc=1&s=0&a=t&q=89"},{"id":"Little Richard","decade":1950,"genre":"SOUL","image":"http://media.gettyimages.com/photos/rock-and-roll-pioneer-little-richard-preaches-to-a-small-group-in-a-picture-id129594412"},{"id":"Lyle Lovett","decade":1980,"genre":"COUNTRY","image":"http://g1j1g1up91ni2kf7q4x2f132.wpengine.netdna-cdn.com/wp-content/uploads/2015/08/LyleLovett3.jpg"},{"id":"No Doubt","decade":1990,"genre":"ROCK","image":"https://images.bit-tech.net/news_images/2009/11/no-doubt-sues-activision-over-band-hero/article_img.jpg"},{"id":"Sarah Brightman","decade":1990,"genre":"CLASSIC","image":"http://images1.buymusichere.net/images/universal/162/04228391162.jpg"},{"id":"Seal","decade":1990,"genre":"POP","image":"http://media.gettyimages.com/photos/singer-seal-arrives-at-warner-music-groups-2011-post-grammy-event-at-picture-id109070280?s=594x594"},{"id":"Sly and the Family Stone","decade":1960,"genre":"SOUL","image":"http://thepressoffice.com/wp-content/uploads/2016/04/family-stone-21e7ec1af3fbdd24.jpg"},{"id":"The B-52s","decade":1980,"genre":"POP","image":"https://s-media-cache-ak0.pinimg.com/236x/96/f5/a4/96f5a4d895d946dadfc5e88a9d0f8f53.jpg"},{"id":"The Cardigans","decade":1990,"genre":"CHILL","image":"http://www.alwaysontherun.net/cardiganstop2.jpg"},{"id":"The Pretenders","decade":1980,"genre":"ROCK","image":"http://d1ya1fm0bicxg1.cloudfront.net/2015/04/promoted-media-optimized_55341fc64d20d.jpg"},{"id":"The Who","decade":1960,"genre":"ROCK","image":"http://www.acappellanews.com/images/brutha.jpg"},{"id":"Tom Jones","decade":1960,"genre":"POP","image":"https://upload.wikimedia.org/wikipedia/commons/6/69/Tom_Jones_concert.jpg"},{"id":"Zero 7","decade":2000,"genre":"CHILL","image":"http://www.rightchordmusic.co.uk/wp/wp-content/uploads/2015/08/dear-plastic-001.jpg"},{"id":"Ziggy Marley","decade":2000,"genre":"REGGAE","image":"http://questgarden.com/106/46/3/100709090340/images/Ziggy%20Marley.jpg"}]';
      // artists = JSON.parse(response);
      //oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

    }
    
    if(globalRetrievalError != "") {
      try {
        hide_spinner();
      } catch (error) {}
    }
    else {

      // Copy the array contents:

      // Online - JSON from MongoDB:
      if (globalOnlineData == true) {
        this.writeArtists = artists.artist.slice(0);
      }
      // Offline - JSON from WorkingWeb Database app:
      else {
        this.writeArtists = artists.slice(0);
      }
    
      // NOTE: The array, which comes from the server, is sorted differently than it
      // will be in the browser, so lets sort it now.

      // Server:  ? and the Mysterians, 10,000 Maniacs, 10cc, A Flock of Seagulls,
      // Browser: 10,000 Maniacs, 10cc, ? and the Mysterians, A Flock of Seagulls,

      this.writeArtists = this.sort(this.writeArtists);

      for (var i = 0; i < this.writeArtists.length; i++) { 

          // Assign a matching set of colors:
          var randomColor = WorkingWebNodeJsServices.get_random_color();
          this.writeArtists[i].background = randomColor;
          this.writeArtists[i].textColor = WorkingWebNodeJsServices.get_complementary_color(randomColor);

          // Offline - JSON from WorkingWeb Database app:
          if (globalOnlineData == false) {

            // Overlay.  Assign a thumbnail-size image (for fast loading):
            this.writeArtists[i].thumbnail = "http://www.workingweb.info/database/images/Artist/" +
              WorkingWebNodeJsServices.get_file_name(this.writeArtists[i].id) + ".jpg";
          }

          this.writeArtists[i].index = i;
          this.writeArtists[i].idMinusSpaces = this.writeArtists[i].id.split(' ').join('');

          this.writeArtists[i].WdReportHtml = "";
          this.writeArtists[i].YaReportHtml = "";

          this.writeArtists[i].WdReportJson = "";
          this.writeArtists[i].YaReportJson = "";

          this.writeArtists[i].dummy = 0; // false, is not a dummy, is a legitimate Artist item

      }

      // Copy the array contents:
      this.loadReadFromWrite();
    }

  }
    
	filterByDecadeGenre(artists, decade, genre) {

		return artists.filter(function(artist) {

		  if (decade != 0 && genre != "") {
	  
        return (
          (artist.genre.indexOf(genre)                         > -1) &&
          (artist.decade.toString().indexOf(decade.toString()) > -1)
        );
          
      }
      else if (decade != 0) {
      
        return (
          (artist.decade.toString().indexOf(decade.toString()) > -1)
        );
      
      }
      else if (genre != "") {
      
        return (
          (artist.genre.indexOf(genre) > -1)
        );
	  
		  }
		  else if (decade == 0 && genre == "") {
	  
			  // remove filter
		  }
		  
		  return (
			  (artist.genre.indexOf(genre)                         > -1) &&
			  (artist.decade.toString().indexOf(decade.toString()) > -1)
		  );
	  
		})
		
	}
  
  findArtist(artists, id) {

    var foundIndex = -1; // init

    for (var i = 0; i < artists.length; i++) { 			

      if (artists[i].id == id) {
        foundIndex = i;
        break;
      }

    }
    return foundIndex;

  }

	getJsonFromJsonDatabase() {

		const DATABASE_ARTISTS = "http://www.workingweb.info/database/Artist/Get/";
      
    var json = ""; // init
    
    // Get and unpackage the artist JSON:
		var response =
      WorkingWebNodeJsServices.get_xml_http_request_via_proxy_server(DATABASE_ARTISTS);
      
    if(response.indexOf("retrieval error") == -1 &&
       response.indexOf("error has occurred") == -1) {

          json = WorkingWebNodeJsServices.remove_response_packaging(response);

          // Clean up:
          json = WorkingWebNodeJsServices.remove_all_procedural(json, "\\r");
          json = WorkingWebNodeJsServices.remove_all_procedural(json, "\\n");

          // Decode the characters that get translated when UTF-8 data is retrieved from
          // the JSON Database Artist lookup:
          json = WorkingWebNodeJsServices.decode_artist_name_special_chars(json);
            
    }

    return json;
    
  }
  
	getJsonFromMongoDb() {

    const DATABASE_ARTISTS = "http://artistrest.herokuapp.com/artist/getall";
      
    return WorkingWebNodeJsServices.get_xml_http_request(DATABASE_ARTISTS);
    
  }
  
  loadIndices(argArtists) {

    // Copy the array contents:
    var returnArtists = argArtists.slice(0);

    for (var i = 0; i < returnArtists.length; i++) { 
      returnArtists[i].index = i;
    }

    return returnArtists;
    
  }

  loadReadFromWrite() {

    this.writeArtists = this.sort(this.writeArtists);
    this.writeArtists = this.loadIndices(this.writeArtists);

    if (this.decade != "" || this.genre != "") {

			this.readArtists = this.filterByDecadeGenre(
        this.writeArtists,
        this.decade,
        this.genre
      );
          
      this.readArtists = this.loadIndices(this.readArtists);

    }
    else {

      // Copy the array contents:
      this.readArtists = this.writeArtists.slice(0);

    }

    // If the result set has fewer entries than the frame size:
    if (this.readArtists.length < 5) {

      // Augment the result set with dummy entries up to the frame size.
      // They will be invisible to the user but are crucial in making the
      // whole Card Stack process work correctly:
      for (var index = this.readArtists.length; index < 5; index++) {

        this.readArtists.push(
          JSON.parse(
            '{' +
            ' "id": "",' +
            ' "decade": 0,' +
            ' "genre": "",' +
            ' "image": "",' +
            ' "_id": "",' +

            ' "background": "#ffffff",' + // white
            ' "textColor": "#000000",' +  // black
            ' "thumbnail": "",' +
            ' "index": -1,' +
            ' "idMinusSpaces": "",' +

            ' "dummy": 1' + // true, is a dummy
            '}'
          )
        );

      }
    }

  }

  sort(argArtists) {

      // Copy the array contents:
      var returnArtists = argArtists.slice(0);

      returnArtists.sort(WorkingWebNodeJsServices.predicateBy("id"));

      return returnArtists;

  }

}