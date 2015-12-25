suite('troute.lookup', function() {
  test('returns the most specific match', function() {
    var r = troute();

    r.add('user/:name', 1);
    r.add('user/john',  2);

    var match = r.lookup('user/john');
    assert(match.data === 2);
  });

  test('sanitises the url', function() {
    var r = troute();

    r.add('user', 1);

    var urls = [
      '/user/',
      '/user',
      'user/',
    ];
    for (var i=urls.length; i--;) {
      var match = r.lookup(urls[i]);
      assert(match.data === 1);
    }
  });

  test('returns null or undefined if theres no match', function() {
    var r = troute();
    assert(!r.lookup('/'));
  });
});
