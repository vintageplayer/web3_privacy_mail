var UserProfile = (function() {
  var userKeys = null;
  var mailsSent = null;
  var inbox = null;

  var setKeys = function(keyData) {
    userKeys = keyData;
    // Also set this in cookie/localStorage
  };

  var getKeys = function() {
    return userKeys;  // Or pull this from cookie/localStorage
  };

  var setInbox = function(mailItems) {
    inbox = mailItems;    
  };

  var getInbox = function() {
    return inbox; 
  };

  var setSent = function(mailItems) {
    mailsSent = mailItems;    
  };

  var getSent = function() {
    return mailsSent;	
  };

  return {
    setKeys: setKeys,
    getKeys: getKeys,
    setSent: setSent,
    getSent: getSent,
    setInbox: setInbox,
    getInbox: getInbox
  }

})();

export default UserProfile;
