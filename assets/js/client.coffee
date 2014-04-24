
Client = (host, path, charset) ->
  @host = host
  @path = path
  @charset = charset or stdCharset
  @cookie = {}
  return
http = require("http")
querystring = require("querystring")
_ = require("underscore")
BufferHelper = require("bufferhelper")
iconv = require("iconv-lite")
stdCharset = "utf8"
Client::get = (path, data, headers, callback) ->
  @request path, data, headers, callback, "GET"

Client::post = (path, data, headers, callback) ->
  @request path, data, headers, callback, "POST"

Client::request = (path, data, headers, callback, method) ->
    client = this
    data = querystring.stringify(data or {})  unless _.isString(data)
    req = http.request(
      host: client.host
      path: client.path + path
      method: method.toUpperCase()
      headers: _.extend({}
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        "Accept-Encoding": "gzip,deflate,sdch"
        "Accept-Language": "zh-CN,zh;q=0.8"
        "Cache-Control": "max-age=0"
        Connection: "keep-alive"
        "Content-Type": "application/x-www-form-urlencoded"
        "Content-Length": data.length
        Cookie: (->
          str = ""
          _.each client.cookie, (val, key) ->
            str += key + "=" + val + "; "
            return

          str
        )()
        Host: client.host
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.11 Safari/537.36"
      , headers)
    , (res) ->
      bufhelper = new BufferHelper()
      res.on("data", (chunk) ->
        bufhelper.concat chunk
        return
      ).on "end", ->
        buf = bufhelper.toBuffer()
        buf = iconv.encode(iconv.decode(buf, client.charset), stdCharset)  if client.charset isnt stdCharset
        body = buf.toString()
        setCookie = res.headers["set-cookie"]
        cookie = {}
        seg = undefined
        arr = undefined
        if setCookie
          _.each setCookie, (row) ->
            seg = row.split(/\s*;\s*/)[0]
            arr = seg.split(/\s*=\s*/)
            cookie[arr[0]] = arr[1]
            return

          _.extend client.cookie, cookie
        callback and callback.apply(client, [
          null
          res
          body
        ])
        return

      return
    ).on("error", (err) ->
      callback and callback.apply(client, [err])
      return
    )
    data and req.write(data)
    req.end()
    this
module.exports = Client