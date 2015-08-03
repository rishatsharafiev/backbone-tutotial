$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.url = 'http://backbone-beginner.herokuapp.com' + options.url;
});

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

/* Collections */
var Users = Backbone.Collection.extend({
  url: '/users'
});

/* Models */
var User = Backbone.Model.extend({
  urlRoot: '/users'
});

/* Views */
var UserList = Backbone.View.extend({

  el: '.page',

  template: _.template( $('#user_list_template').html() ),

  render: function() {
    var that = this;
    var users = new Users();
    users.fetch({
      success: function(users) {
        that.$el.html(  that.template( {users: users.models} )  );
      }
    });
  }

});

var EditUser = Backbone.View.extend({

  el: '.page',

  template: _.template( $('#edit_user_template').html() ),

  render: function(options) {
    var that = this;
    if(options.id) {
      that.user = new User({id: options.id });
      that.user.fetch({
        success: function(user) {
          that.$el.html(that.template({user: user}));
        }
      });
    } else {
      this.$el.html(this.template({user: null}));
    }
  },

  events: {
    'submit .edit_user_form': 'saveUser',
    'click .delete': 'deleteUser'
  },

  saveUser: function(e) {
    e.preventDefault();
    var userDetails = $(e.currentTarget).serializeObject();
    var user = new User();
    user.save(userDetails, {
      success: function(user) {
        router.navigate('', { trigger: true });
      }
    });
    return false;
  },

  deleteUser: function(e) {
    e.preventDefault();
    this.user.destroy({
      success: function(user) {
        router.navigate('', { trigger: true });
      }
    });
    return false;
  }

});

/* Routers */
var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'new': 'editUser',
    'edit/:id': 'editUser',
  }
});

var userList = new UserList();
var editUser = new EditUser();

var router = new Router();

router.on('route:home', function() {
  userList.render();
});

router.on('route:editUser', function(id) {
  editUser.render( {id: id} );
});

Backbone.history.start();