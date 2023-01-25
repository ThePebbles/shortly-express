//GLearn Goals
// Write a middleware function that will:
// (1) access the cookies on an incoming request,
// (2) parse them into an object, and
// (3) assign this object to a cookies property on the request.

//Spec Runner Tests
//parses cookies and assigns an object of key-value pairs to a session property on the request
//initializes a new session when there are no cookies on the request
//sets a new cookie on the response when a session is initialized
//assigns a session object to the request if a session already exists
//creates a new hash for each new session
//assigns a username and userId property to the session object if the session is assigned to a user
//clears and reassigns a new cookie if there is no session assigned to the cookie
const parseCookies = (req, res, next) => {
  //console.log('THIS IS REQUEST', req);
  if (req.headers.cookie !== undefined) {
    var string = '{' + req.headers.cookie.split(' ').join().replaceAll(';', '').replaceAll('=', ': ').replaceAll(',', ', ') + '}';
    console.log('Parsing cookies: ', JSON.parse(string));
  }
};

module.exports = parseCookies;