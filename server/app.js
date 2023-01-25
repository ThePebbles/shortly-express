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

//signup first
app.post('/signup',
//  take in reguest and response params
  (req, res, next) => {
    //  use get to check if username already exists
    var username = req.body.username;
    var password = req.body.password;
    if (models.Users.get({'username': username})) {
      //    if successful, redirect to signup page, let them know username already exists
      return res.redirect('/signup');
    }
    //  create method; create new user object
    //    return models.users.create user
    //      does not need to send info back
    return models.Users.create({'username': username, 'password': password})
    //  get salt with createrandom32string
      .then(results => {
        return utils.createrandom32string();
      })
    //    if successful return update so salt is in database
      .then(salt => {
        return models.Users.update({'username': username, 'password': password, 'salt': null}, {'username': username, 'password': password, 'salt': salt});
      })
    //  create a hash for the password with generated salt
      .then(results => {
        //console.log results and results.salt later
        return utils.createHash(password, results.salt); // salt might be accessed differetly***
      })
    //    if successful return update so hashed password is in database
      .then(hashedPassword => {
        //      does not need to send info back
        return models.Users.update({'username': username, 'password': password}, {'username': username, 'password': hashedPassword});
      })
    //  then response.send status
      .then(results => {
        //    Let the user log in (redirect to '/' or '/index') status 302
        res.redirect('/');
        //res.status(302).send('/');
      })
    //  if error send 500
      .error(error => {
        res.status(500).send(error);
      });
  });

//login
//  Take in request and response params
//  Check if the username already exists (get)
//    If the user does NOT exist, throw error, redirect to signup page (302 '/signup')
//  Get user from the db, (password, salt)
//    Return results
//  Compare attempted pwd, stored pwd, salt (under Users constructor)
//    If true (is a match)
//      Let the user log in (redirect to '/' or '/index') send status 302
//    If false (not a match)
//      Send 200 status code, potential console log or something to let the user know the password was incorrect
//  If error send 500

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
