var React = require('react');

if (typeof window !== "undefined" && window !== null) {
  if (window.refTagger == null) {
    window.refTagger = {
      settings: {
        bibleVersion: "ESV",
        dropShadow: false,
        socialSharing: ["twitter","facebook"]
      }
    };
  }
}

var refTagger = React.createClass({
  componentDidMount: function () {
    return this.addScript();
  },
  addScript: function () {
    var el, s;
    el = document.createElement('script');
    el.src = 'https://api.reftagger.com/v2/RefTagger.js';
    s = document.getElementsByTagName('script')[0];
    return s.parentNode.insertBefore(el, s);
  },
  render: function () {
    return false;
  }
});

module.exports = refTagger;