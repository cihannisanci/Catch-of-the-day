var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var History = ReactRouter.History;
var helper = require('./helpers.js');


var App = React.createClass({

  getInitialState: function() {
    return (
      {
        fishes: {},
        order:{}
      }
    );
  },

  addFish: function(fish) {
    var timestamp = new Date();
    this.state.fishes['fish '+ timestamp] = fish;
    this.setState({
      fishes: this.state.fishes
    });
  },

  render: function() {
    return (
      <div className='catch-of-the-day'>
      <div className='menu'>
        <Header tagline='Fresh Seafood Market' />
      </div>
        <Order />
        <Inventory addFish={this.addFish} />
      </div>
    );
  }
});


var Header = React.createClass({
  render: function() {
    return (
      <header className='top'>
        <h1>catch
          <span className='ofThe'>
            <span className='of'>of</span>
            <span className='the'>the</span>
          </span>
        Day</h1>
        <h3 className='tagline'><span>{this.props.tagline}</span></h3>
      </header>
    );
  }
});

var Order = React.createClass({
  render: function() {
    return (
      <p>Order</p>
    );
  }
});

var Inventory = React.createClass({
  render: function() {
    return (
      <div>
        <p>Inventory</p>
        <AddFishForm addFish={this.props.addFish} />
      </div>
    );
  }

});

var AddFishForm = React.createClass({

  myFunc: function(event) {
    event.preventDefault();
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value
    };
    this.props.addFish(fish);
  },

  render: function() {
    return(
    <form onSubmit={this.myFunc}>
      <input type='text' ref='name'></input>
      <input type='text' ref='price'></input>
      <input type='submit'></input>
    </form>
    );
  }
});

var NotFound = React.createClass({
  render: function() {
    return (
      <h1>Not Found !!</h1>
    );
  }
});

var StorePicker = React.createClass({

  mixins : [History],

  goToStore : function(event) {
    event.preventDefault();
    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);

  },

  render: function() {
    return (
      <form className='store-selector' onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" defaultValue={helper.getFunName()}  />
        <input type='submit' />
      </form>
    )
  }
});


var routes = (
  <Router history={createBrowserHistory()}>
    <Route path='/' component={StorePicker} />
    <Route path='/store/:storeId' component={App} />
    <Router path='*' component={NotFound} />
  </Router>
);
ReactDOM.render(routes, document.getElementById('main'));
