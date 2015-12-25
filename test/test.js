suite('troute.lookup', function() {
  var r = troute();

  r.add('user/:name',    1);
  r.add('user/john/:id', 2);

  test('returns the most specific match', function() {
    var match = r.lookup('user/dave');
    assert(match.data === 1);
    assert(match.params.name === 'dave');

    var match = r.lookup('user/john');
    assert(match.data === 1);
  });
});
