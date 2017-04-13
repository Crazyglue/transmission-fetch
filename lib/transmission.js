'use-strict'

import methods, { torrentStatusMap } from './methods'

export default class Transmission {
  constructor(params) {
    this.rpcEndpoint = params.rpcEndpoint || "/transmission/rpc"
    this.sessionId = null
    this.url = params.url
    this.port = params.port
    this.statusMap = torrentStatusMap
    this.downloadDir = params.defaultDir || ''
    this.startPaused = params.pause || true
    this.methods = methods

    if (params.username) {
      credentials = params.username + ":" + params.password
      base = btoa(credentials)
      this.authHeader = 'Basic ' + base
    }
  }

  getBaseUrl() { return("http://" + this.url + ":" + this.port + this.rpcEndpoint) }

  compose(method, transmissionMethod, torrentFields = {}) {
    credentials = this.username + ":" + this.password
    base = btoa(credentials)

    params = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "x-transmission-session-id": this.sessionId
      },
    }

    let body = {
      method: transmissionMethod
    }

    if (Object.keys(torrentFields).length > 0)
      body.arguments = torrentFields

    params.body = JSON.stringify(body)

    if (this.authHeader)
      params.headers.Authorization = this.authHeader

    console.log("Composed params", params)
    return [ this.getBaseUrl(), params ]
  }

  checkResponse(response, method) {
    if (response.ok && response.status === 200)
      return response.json()
    else if (!response.ok && response.status === 409) {
      // missing or stale sessionId, pull it from the header, save it, and call the method again.
      var sessionId = response.headers.map['x-transmission-session-id'][0].split("\n")[0]
      this.sessionId = sessionId
      console.log("Set session id: ", sessionId)
      method() // call the method again to retry
    }
    else if (response.status === 401) {
      return new Error("Unauthorized, check your credentials.")
    }
    else
      return new Error(JSON.stringify(response))
  }

  transmissionRequest(composedParams, boundMethod, callback) {
    fetch(...composedParams)
      .then((response) => this.checkResponse(response, boundMethod.bind(this, callback)))
      .then(callback)
  }

  getTransmissionSession(callback) {
    console.log("Getting transmission stats...")

    let composedParams = this.compose("POST", this.methods.session.get, {})

    this.transmissionRequest(composedParams, this.getTransmissionSession, callback)
  }

  getSessionStats(callback) {
    console.log("Getting session stats...")

    let composedParams = this.compose("POST", this.methods.session.stats, {})

    this.transmissionRequest(composedParams, this.getSessionStats, callback)
  }

  getTorrents(ids = [], callback) {
    if (typeof(ids) === 'function') {
      callback = ids
      ids = []
    }

    var params = { fields: this.methods.torrents.fields, ids: ids }
    let composedParams = this.compose("POST", this.methods.torrents.get, params)

    this.transmissionRequest(composedParams, this.getTorrents, callback)
  }

  startTorrent(ids = [], callback) {
    var params =  { ids: ids }
    let composedParams = this.compose("POST", this.methods.torrents.start, params)

    this.transmissionRequest(composedParams, this.startTorrent, callback)
  }

  startTorrentNow(ids = [], callback) {
    var params = { ids: ids }
    let composedParams = this.compose("POST", this.methods.torrents.startNow, params)

    this.transmissionRequest(composedParams, this.startTorrentNow, callback)
  }

  stopTorrent(ids = [], callback) {
    var params = { ids: ids }
    let composedParams = this.compose("POST", this.methods.torrents.stop, params)

    this.transmissionRequest(composedParams, this.stopTorrent, callback)
  }

  addTorrent(filename, params = {}, callback) {
    // temporary
    var params = {
      filename: filename,
      paused: this.startPaused,
      "download-dir": this.downloadDir
    }
    let composedParams = this.compose("POST", this.methods.torrents.add, params)

    this.transmissionRequest(composedParams, this.addTorrent, callback)
  }

  setUrl(url) { this.url = url }
  setPort(port) { this.port = port }
  setDownloadDir(dir) { this.downloadDir = dir }
  setStartPaused(paused) { this.startPaused = paused }

  getUrl() { return this.localUrl }
  getPort() { return this.localPort }
  getDownloadDir() { return this.downloadDir }

  parseTorrentStatus(status) { return this.statusMap[status] }
}
