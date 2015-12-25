// var t = troute();
// t.add('/:username/:id', 1)
// t.add('/:id', 2)
// t.lookup('/1').data == 2
// t.lookup('/user/1').data == 1


troute = function() {
  var escape = decodeURIComponent;
  var info = function() {
    return {
      next: {},
      param: null,
      route: null,
    };
  };

  var sanitise = function(url) {
    var hash = url.indexOf('#');
    if (~hash)                    url = url.slice(0, hash);
    if (~url.indexOf('/?'))       url = url.replace('/?', '/');
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url;
  };

  var parse_qs = function(qs) {
    var o = {};
    if (qs) {
      var query = qs.split('&');
      for (var i = 0; i < query.length; i++) {
        var q = query[i].split('=');
        o[q[0]] = escape(q[1]);
      }
    }
    return o;
  }

  var parse_url = function(url) {
    var frags = sanitise(url).split('?');
    return {
      p: frags[0].split('/'),
      q: frags[1],
    };
  };

  var routes = info();

  var add = function(pattern, data) {
    var parts  = pattern.split('/');
    var params = [];
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var c = p[0] == ':';
      t = (c)
        ? t.param    || (t.param = Branch())
        : t.next[p]  || (t.next[p] = Branch());
      if (c)
        params.push(p.slice(1));
    }

    t.route = {
      data: data,
      map: function(args) {
        var o = {};
        for (var i = args.length; i--;)
          o[params[i]] = args[i];
        return o;
      }
    };
    return routes;
  };

  var lookup = function(url) {
    var u = parse_url(url);
    var t = routes;
    var o = [];

    for (var i = 0; i < u.p.length; i++) {
      var p = escape(u.p[i]);
      var q = t.next[p.toLowerCase()];
      if (q) {
        t = q;
      } else if (t.param) {
        t = t.param;
        o.push(p);
      } else {
        return null;
      }
    }

    var r = t.r;
    return r && {
      data: r.data,
      params: r.map(o),
      query: parse_qs(u.q),
    };
  };

  return {
    add: add,
    lookup: lookup,
  };
};
