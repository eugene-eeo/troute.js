suite('troute.lookup', function() {
  var r = troute();

  r.add('user/',      0);
  r.add('user/:name', 1);
  r.add('user/john',  2);

  test('returns the most specific match', function() {
    var match = r.lookup('user/john');
    assert(match.cb === 2);
  });

  test('sanitises the url', function() {
    var urls = [
      '/user/',
      '/user',
      'user/',
    ];
    for (var i=urls.length; i--;) {
      var match = r.lookup(urls[i]);
      assert(match.cb === 0);
    }
  });

  test('ignores the case when matching', function() {
    var match = r.lookup('/User/JoHN');
    assert(match.cb === 2);
  });

  test('preserves case in parameters', function() {
    var match = r.lookup('/user/ONE');
    assert(match.params.name === 'ONE');
  });

  test("doesn't expose the internals", function() {
    var charMap = {
      ':': '%3A',
      '$': '%24',
      '/': '%2F',
    };
    for (var c in charMap) {
      var match = r.lookup('/user/' + charMap[c]);
      assert(match.params.name === c);
    };
  });

  test('returns null or undefined if theres no match', function() {
    assert(!r.lookup('/'));
  });
});
