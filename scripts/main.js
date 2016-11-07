var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var History = ReactRouter.History;
var helper = require('./helpers.js');

var Rebase = require('re-base');
var base = Rebase.createClass('https://catchoftheday-ea496.firebaseio.com/');
var firebase = require('firebase');

var App = React.createClass({

  getInitialState: function() {
    return {
        fishes: {},
        orders:{}
    };
  },

  componentMount: function() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context:this,
      state:'fishes'
    });
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
    return <FishEntry key={key} index={key} fish={this.state.fishes[key]} orders={this.state.orders[key]} addOrder={this.addOrder} />
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
        <Order fishes={this.state.fishes} orders={this.state.orders} />
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

  renderOrder: function(key) {

    var fish = this.props.fishes[key];
    var count = this.props.orders[key];

    if(!fish) {
      return <li key={key}>Sorry, this fish is no longer availble!!</li>
    }

    return (
      <li>
        {count}lbs
        {fish.name}
        <span className='price'>{helper.formatPrice(count * fish.price)}</span>
      </li>
    ); 
  },

  render: function() {
     var orderIds = Object.keys(this.props.orders);

     var total = orderIds.reduce((prevTotal, key) => {
      var fish = this.props.fishes[key];
      var count = this.props.orders[key];
      var isAvailable = fish && fish.status === 'available';

      if(isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
     }, 0);

    return (
      <div className='order-wrap'>
        <h2 className='order-title'>Your Order</h2>
        <ul className='order'>
          {orderIds.map(this.renderOrder)}
          <li className='total'>
            <strong>TOTAL</strong>
            {helper.formatPrice(total)}
          </li>
        </ul>
      </div>
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
