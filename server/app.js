const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const Auth = require('./middleware/auth');
const models = require('./models');

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/',
  (req, res) => {
    res.render('index');
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then(link => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then(title => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin
        });
      })
      .then(results => {
        return models.Links.get({ id: results.insertId });
      })
      .then(link => {
        throw link;
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(link => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

// signup
app.post('/signup',
//  take in request and response params
  (req, res) => {
    // Don't take directly from req.body! Use vars
    var username = req.body.username;
    var password = req.body.password;
    //  use get to check if username already exists
    return (models.Users.get({ username }))
    // if successful, redirect to signup page, let them know username already exists
      .then(user => {
        if (user) {
          throw user;
        }
        // create new user object
        return models.Users.create({'username': username, 'password': password});
      })
      // get salt with createrandom32string
      .then(results => {
        return utils.createRandom32String();
      })
      // if successful return update so salt is in database
      .then(salt => {
        return models.Users.update({'username': username, 'password': password, 'salt': null}, {'username': username, 'password': password, 'salt': salt});
      })
      // create a hash for the password with generated salt
      .then(results => {
        return utils.createHash(password, results.salt);
      })
      //  if successful return update so hashed password is in database
      .then(hashedPassword => {
        return models.Users.update({'username': username, 'password': password}, {'username': username, 'password': hashedPassword});
      })
      // Let the user log in (redirect to '/' or '/index') status 302
      .then(results => {
        res.redirect('/');
      })
      .error(error => {
        res.status(500).send(error);
      })
      .catch(user => {
        res.redirect('/signup');
      });
  });

// login
app.post('/login',
  //  Take in request and response params
  (req, res, next) => {
    // Don't take directly from req.body! Use vars
    var username = req.body.username;
    var password = req.body.password;
    //  Check if the username already exists (get)
    return (models.Users.get({ username }))
      .then(user => {
        //  If the user exists, compare attempted pwd, stored pwd, salt (under Users constructor)
        if (user) {
          return models.Users.compare(password, user.password, user.salt);
        //  If the user does NOT exist, throw noUser
        } else {
          throw noUser;
        }
      })
      .then(isMatch => {
        //  If true (is a match)
        //    Let the user log in (redirect to '/' or '/index') send status 302
        //console.log('USER ID IN ISMaTCH: ', user.id);
        if (isMatch) {
          //return Auth.createSession(req, res, next);
          models.Sessions.create({'userId': user.id});
          //res.redirect('/');
        } else {
          //  If false (not a match), throw noUser
          throw noUser;
        }
      })
      .then(res.redirect('/'))
      //  If error send 500
      .error(error => {
        res.status(500).send(error);
      })
      .catch(noUser => {
        res.redirect('/login');
      });
  }
);

//app.use(Auth.createSession);


/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
