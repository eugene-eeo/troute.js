troute = function() {
  function split(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url.split('/');
  };

  var enc = encodeURIComponent;
  var dnc = decodeURIComponent;

  var tree = {};

  var add = function(url, cb) {
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

  var lookup = function(url) {
    var u = split(url);
    var t = tree;
    var params = {};

    for (var i = 0; i < u.length; i++) {
      var p = u[i];
      var q = dnc(p);

      t = t[enc(q.toLowerCase())] || t[':'];
      if (!t) return;
      t['~'] && (params[t['~']] = q);
    }
    return ('/' in t) && {
      params: params,
      cb: t['/'],
    };
  };

  return {
    add: add,
    lookup: lookup
  };
};
