var React = require('react');
var $ = require('jquery');
var RefTagger = require('react-reftagger');

var QuestionList = React.createClass({
  loadQuestionsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return { data: [] };
  },
  componentDidMount: function () {
    this.loadQuestionsFromServer();
  },
  render: function () {
    var questionNodes = this.state.data.map(function (question) {
      return (
        <Question key={ question.id } data={ question }></Question>
      );
    });

    return (
      <section id="questions">
        { questionNodes }
        <RefTagger />
      </section>
    );
  }
});

var Question = React.createClass({
  getInitialState: function () {
    return { display: true }
  },
  handleClick: function (e) {
    this.setState({ display: !this.state.display });
    var responseEl = this.getDOMNode().getElementsByClassName('response')[0];

    if (!this.state.display) {
      responseEl.className = 'response closed';
    } else {
      responseEl.className = 'response'
    }
  },
  render: function () {
    var data = this.props.data;
    return (
      <article className="question">
        <h1 onClick={ this.handleClick }>{ data.id }. { data.question }</h1>
        <Response data={ data } />
      </article>
    );
  }
});

var Response = React.createClass({
  render: function () {
    var i = 1;
    var verses = this.props.data.verses;

    return (
      <div className="response closed">
        <p className="answer">{ this.props.data.answer }</p>
        <p className="verses">{ verses }</p>
      </div>
    );
  }
});

module.exports = React.render(
  <QuestionList url="/hc/static/hcat.json" />,
  document.getElementById('content')
);