const utils = require('../lib/hashUtils');
const models = require('../models');

//GLearn Goals
// Write a middleware function that will:
// (1) access the cookies on an incoming request,
// (2) parse them into an object, and
// (3) assign this object to a cookies property on the request.

//Spec Runner Tests for Cookies
//parses cookies and assigns an object of key-value pairs to a session property on the request

//Spec Runner Tests for Sessions
//initializes a new session when there are no cookies on the request
//sets a new cookie on the response when a session is initialized
//assigns a session object to the request if a session already exists
//creates a new hash for each new session
//assigns a username and userId property to the session object if the session is assigned to a user
//clears and reassigns a new cookie if there is no session assigned to the cookie
module.exports.parseCookies = (req, res, next) => {
  //console.log('req from cookies: ', req);
  //pull cookies out of request
  var cookies = req.headers.cookie;

  // if cookies, parse into object
  if (cookies !== undefined) {
    cookies = JSON.parse('{"' + cookies.split(' ').join('", "').replaceAll(';', '').replaceAll('=', '": "') + '"}');
    //  assign object to cookies property on request (req._setCookiesVariable)
    for (var key in cookies) {
      req._setCookiesVariable(key, cookies[key]);
    }
  }

  // console.log('request: ', req);

  // Go to the next middleware fn
  next();

  // return (models.Sessions.create({ 'hash': null, 'userId': null }))
  //   .then(results => {
  //     return utils.createRandom32String();
  //   })
  //   .then(hash => {
  //     return models.Sessions.update({ 'hash': hash, 'userId': null });
  //   })
  //   .then(results => {
  //     res.status(201).send(results.hash);
  //     next();
  //   })
  //   .error(error => {
  //     res.status(500).send(error);
  //     next();
  //   });

  // return (models.Sessions.get())

  //  If the cookie was found in the sessions table, assign that obj to the session (for each cookie)
  //    if session assigned to user
  //    username and userID property assignment to session object
  //  {userId: userId, cookie: cookie}
  //    else req._setSessionVariable with cookies?
  //  return 'cookies are present' so we can catch malicious cookies
  //if no cookies
  //  start a new session
  //  createRandom32String to generate hash for new session
  //  add to sessions table (userId column may be null?)
  //look at sessions table for current cookie
  //  if cookie is not found
  //    assign to current hash (cookie)
};

// module.exports = parseCookies;