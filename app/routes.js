module.exports = function(app, passport, db, ObjectID) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    //fetch to grab the data from the db to render into the ejs map in a loop
    app.get('/migrationsapi', function(req, res) {
      db.collection('migrations').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.send(result)
      })
  });
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

         /*taking the data from one object in the migrations database, and moving it with a user_id attached
      /to a new collection that the logged in user can reference later via their profile page */
       app.post('/saveMigration', isLoggedIn, (req, res) => {
         db.collection('saveMigration').save({ migrationId : ObjectID(req.body.migrationId),
          user:ObjectID(req.user._id )}, //corresponds to the fetchfunction in main.js. remember that mongoDB doesn't save as strings
           (err, result) => {
             if (err) return console.log(err)
             console.log('saved to database')
           })
       });

      // app.put('/userSaved', (req, res) => {
      //   db.collection('userSaved')
      //     .findOneAndUpdate(`${migrations[i]._id}`, {
      //       $set: {
      //       }
      //     }, {
      //       sort: { _id: -1 },
      //       upsert: true
      //     }, (err, result) => {
      //       if (err) return res.send(err)
      //       res.send(result)
      //     })
      // });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/profile');
}

/*ITEMS FOR DATABASE
const data = [
  {people: 'manasota', start: 900, startera: 'BC', end: 500, endera: 'BCE'}
]
*/