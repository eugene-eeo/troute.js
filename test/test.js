suite('troute.lookup', function() {
  var r = troute();

  r.add('user/',      0);
  r.add('user/:name', 1);
  r.add('user/john',  2);

  test('returns the most specific match', function() {
    var match = r.lookup('user/john');
    assert(match.data === 2);
  });

  test('sanitises the url', function() {
    var urls = [
      '/user/',
      '/user',
      'user/',
    ];
    for (var i=urls.length; i--;) {
      var match = r.lookup(urls[i]);
      assert(match.data === 0);
    }
  });

  test('ignores the case when matching', function() {
    var match = r.lookup('/User/JoHN');
    assert(match.data === 2);
  });

  test('preserves case in parameters', function() {
    var match = r.lookup('/user/ONE');
    assert(match.params.name === 'ONE');
  });

  test('decodes the url segments', function() {
    var match = r.lookup('/user/%2F');
    assert(match.params.name === '/');
  });

  test('returns null or undefined if theres no match', function() {
    assert(!r.lookup('/'));
  });
});
