module.exports = function (app, passport, db, ObjectID) {

  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/about', function (req, res) {
    res.render('about.ejs');
  });

  app.get('/migrationsapi', function (req, res) {
    db.collection('migrations').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.send(result)
    })
  });

  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('saveMigration').find({userId:req.user._id}).toArray((err, savedMigrations) => {
      if (err) return console.log(err)
      const migrationIdArray = savedMigrations.map(migration => migration.migrationId)
        console.log('returning migrationIdArray', migrationIdArray, savedMigrations)
      
      db.collection('migrations').find({_id:{$in:migrationIdArray}}).toArray((err, migrations) => {
        if (err) return console.log(err)
        for(let i=0; i < migrations.length; i++){
          const saveMigration = savedMigrations.find(sm => sm.migrationId.equals(migrations[i]._id))
          migrations[i].notes = saveMigration.notes
        }
        console.log('found migrations', migrations)
        res.render('profile.ejs', {
          user: req.user,
          userSavedMigrations: migrations
        })
      })
    })
  });


  app.get('/userNotes', isLoggedIn, function (req, res) {
    db.collection('userSavedNotes').findOne({migrationId: ObjectID(req.body.migrationId),
    userId: ObjectID(req.user._id)},
    (err, saveNote) => {
      if (err) return console.log(err)
      res.json(saveNote)}
    )}
  )
    

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


  app.post('/saveMigration', isLoggedIn, (req, res) => {
    console.log('post to saveMigration', req.body.notes)
    db.collection('saveMigration').save({
      migrationId: ObjectID(req.body.migrationId),
      userId: ObjectID(req.user._id),
      notes: req.body.notes

    },

      (err, result) => {
        if (err){
          console.log(err)
        }
        console.log('saved to database')
        res.redirect('/profile')
      })
  });

   app.delete('/saveMigration', (req, res) => {
     db.collection('saveMigration')
       .deleteMany({migrationId: ObjectID(req.body.migrationId), userId: req.user._id}, (err, result) => {
         if (err) return res.send(err)
         res.send(result)
       })
   });

   app.post('/userNotes', isLoggedIn, (req, res) => {
    console.log('note saved')
    db.collection('saveMigration').save({
      migrationId: ObjectID(req.body.migrationId),
      userId: ObjectID(req.user._id)
    },
      (err, result) => {
        if (err){
          console.log(err)
        }
     
      })
  });



//local login
 
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // SIGNUP =================================

  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));


  //SIGN OUT -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
    

  res.redirect('/login');
}
