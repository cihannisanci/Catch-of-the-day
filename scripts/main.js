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
    return {
        fishes: {},
        orders:{}
    };
  },

  addFish: function(fish) {
    var timestamp = (new Date()).getTime();
    this.state.fishes['fish '+ timestamp] = fish;
    this.setState({
      fishes: this.state.fishes
    });
  },

  addOrder: function(key) {
    this.state.orders[key] = this.state.orders[key] + 1 || 1;
    this.setState({
      orders: this.state.orders
    });
  },

  loadFishes: function() {
    this.setState({
      fishes: require('./sample-fishes.js')
    });
  },

  renderFish: function(key) {
    return <FishEntry key={key} index={key} fish={this.state.fishes[key]} addOrder={this.addOrder} />
  }, 

  render: function() {
    return (
      <div className='catch-of-the-day'>
      <div className='menu'>
        <Header tagline='Fresh Seafood Market' />
        <ul>
          {Object.keys(this.state.fishes).map(this.renderFish)}
        </ul>
      </div>
        <Order />
        <Inventory addFish={this.addFish} loadFishes={this.loadFishes} />
      </div>
    );
  }
});

var FishEntry = React.createClass({

  onButtonClick: function() {
    this.props.addOrder(this.props.index);
  },

  render: function() {
    var buttonText = this.props.fish.status ? "Add To Order" : "Sold Out";
    var isAvailable = this.props.fish.status === 'available' ? true : false;
    return (
      <li className="menu-fish">
        <img src={this.props.fish.image} />
        <h3 className='fish-name'>
          {this.props.fish.name}
          <span className='price'>{helper.formatPrice(this.props.fish.price)}</span>
        </h3>
        <p>{this.props.fish.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
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
        <button onClick={this.props.loadFishes}>Load Sample Fishess</button>
      </div>
    );
  }

});

var AddFishForm = React.createClass({

  createFish: function(event) {
    event.preventDefault();
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    };
    this.props.addFish(fish);
    this.refs.fishForm.reset();
  },

  render: function() {
    return(
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
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
