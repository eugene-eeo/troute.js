troute = function() {
  function split(url) {
    return url.replace(/^\/|\/($|\?)/g, '')
              .split('/');
  };

  var enc = encodeURIComponent;
  var dnc = decodeURIComponent;
  var tree = {};

  function add(url, cb) {
    var u = split(url);
    var t = tree;
    for (var i = 0; i < u.length; i++) {
      var part = u[i];
      var capt = part[0] == ':';
      var name = capt ? ':' : enc(part);
      t = t[name] || (t[name] = {});
      if (capt)
        t['~'] = part.slice(1);
    }
    t['/'] = cb;
  };

  function lookup(url) {
    var u = split(url);
    var t = tree;
    var params = {};

    for (var i = 0; i < u.length; i++) {
      var q = dnc(u[i]);
      t = t[enc(q.toLowerCase())] || t[':'];
      if (!t) return;
      t['~'] && (params[t['~']] = q);
    }
    if ('/' in t)
      return {
        params: params,
        cb: t['/'],
      };
  };

  return {
    add: add,
    lookup: lookup
  };
};
