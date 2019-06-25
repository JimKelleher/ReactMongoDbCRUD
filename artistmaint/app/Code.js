export class Code {

  constructor(argDecades, argGenres) {

    // Init:
    this.decades = [];
    this.genres = [];
 
    // NOTE: The JSON database app is producing bad results.  These results correct
    // all errors.

    // http://www.workingweb.info/database/Code/Get/?codeId=ArtistDecade
    // http://www.workingweb.info/database/Code/Get/?codeId=ArtistGenre
 
    // Copy the array contents:
    this.decades = argDecades.code.slice(0);
    this.genres = argGenres.code.slice(0);

  }

  // Internet Explorer, Safari:  "Object doesn't support property or method 'find'""
  findPollyfill(lookIn, lookFor) {

    return lookIn.filter(function (lookIn) {
      return lookIn.value === lookFor
    })[0];
    
  }

  getDecadeDescription(findDecade) {

    if(typeof findDecade == "string") {
      findDecade = parseInt(findDecade);
    }

    if(findDecade == 0) {
      return "";
    }
    else {

      //-------------------------------------------------------------------------------
      // Internet Explorer, Safari:  Object doesn't support property or method 'find':
      //var codeEntry = this.decades.find(decade => decade.value == findDecade);
      //-------------------------------------------------------------------------------
      var codeEntry = this.findPollyfill(this.decades, findDecade);
      //-------------------------------------------------------------------------------

      return codeEntry.description;

    }

  }

  getGenreDescription(findGenre) {

    if(findGenre == "") {
      return "";
    }
    else {

      //-------------------------------------------------------------------------------
      // Internet Explorer, Safari:  Object doesn't support property or method 'find':
      //var codeEntry = this.genres.find(genre => genre.value == findGenre);
      //-------------------------------------------------------------------------------
      var codeEntry = this.findPollyfill(this.genres, findGenre);
      //-------------------------------------------------------------------------------

      return codeEntry.description;
    }

  }

}