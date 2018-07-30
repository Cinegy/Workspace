var mgr = new Oidc.UserManager();
console.log('Silent: Usermanager', mgr);

mgr.signinSilentCallback()
  .then(response => {
    console.logt('Silent: Usermanager: signinSilentCallback()', response)
  })
  .catch(err => {
    onsole.log('Silent: Usermanager: Error in signinSilentCallback()', err);
  });
// mgr.signinSilentCallback()
//   .catch((err) => {
//     console.log('Silent: Usermanager: Error in signinSilentCallback()', err);
//   });


