suite('troute.lookup', function() {
  test('returns the most specific match', function() {
    var r = troute();

    r.add('user/:name', 1);
    r.add('user/john',  2);

    var match = r.lookup('user/john');
    assert(match.data === 2);
  });

  test('can backtrack', function() {
    var r = troute();

    r.add('user/:name',  1);
    r.add('user/john/1', 2);

    var match = r.lookup('user/john');
    assert(match.data === 1);
    assert(match.params.name === 'john');
  });

  test('parses the query parameters', function() {
    var r = troute();

    r.add('user', 1);

    var match = r.lookup('/user/?q=1');
    assert(match.data === 1);
    assert(match.query.q === '1');
  });

  test('sanitises the url', function() {
    var r = troute();

    r.add('user', 1);

    var urls = [
      '/user/?q=1',
      '/user?q=1',
      'user/?q=1',
      'user?q=1',
    ];
    for (var i=urls.length; i--;) {
      var match = r.lookup(urls[i]);
      assert(match.data === 1);
      assert(match.query.q === '1');
    }
  });
});
