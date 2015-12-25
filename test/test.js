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

  test('can backtrack with complex trees', function() {
    var r = troute();

    r.add('user/:a',      1);
    r.add('user/1/:a',    2);
    r.add('user/:a/2/:c', 3);

    var m = r.lookup('user/1');
    assert(m.params.a === '1');

    var m = r.lookup('user/1/2');
    assert(m.params.a === '2');

    var m = r.lookup('user/1/2/3');
    assert(m.params.a === '1');
    assert(m.params.c === '3');
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
});
