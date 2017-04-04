var React = require('react');

var Loading = React.createClass({
  render: function () {
    return <div>
        <div className="spinner">
          <div className="cube1"></div>
          <div className="cube2"></div>
        </div>
        <h1 className='text-center'>Loading, please wait...</h1>
      </div>;
  }
});

module.exports = Loading;
