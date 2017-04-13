'use-strict'

import methods from './methods'

const torrentStatusMap = [
  'Stopped',          /* Torrent is stopped */
  'Queued',           /* Queued to check files */
  'Checking',         /* Checking files */
  'Queued for DL',    /* Queued to download */
  'Downloading',      /* Downloading */
  'Queue to seed',    /* Queued to seed */
  'Seeding'           /* Seeding */
]

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

  compose(method, body = null) {
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

    if (body)
      params.body = body

    if (this.authHeader)
      params.headers.Authorization = this.authHeader

    console.log("Composing with params", params)
    return params
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

  getTransmissionSession(callback) {
    console.log("Getting transmission stats...")

    body = JSON.stringify({ method: this.methods.session.get })
    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.getTransmissionSession.bind(this, callback)))
      .then(callback)
  }

  getSessionStats(callback) {
    console.log("Getting session stats...")

    body = JSON.stringify({ method: this.methods.session.stats })

    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.getSessionStats.bind(this, callback)))
      .then(callback)
  }

  getTorrents(ids = [], callback) {
    if (typeof(ids) === 'function') {
      callback = ids
      ids = []
    }

    body = JSON.stringify({
      method: this.methods.torrents.get,
      arguments: { fields: this.methods.torrents.fields },
    })

    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.getTorrents.bind(this, callback)))
      .then(callback)
  }

  startTorrent(ids = [], callback) {
    body = JSON.stringify({
      method: this.methods.torrents.start,
      arguments: {
        ids: ids
      },
    })

    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.startTorrent.bind(this, callback)))
      .then(callback)
  }

  startTorrentNow(ids = [], callback) {
    body = JSON.stringify({
      method: this.methods.torrents.startNow,
      arguments: {
        ids: ids
      },
    })

    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.startTorrentNow.bind(this, callback)))
      .then(callback)
  }

  stopTorrent(ids = [], callback) {
    body = JSON.stringify({
      method: this.methods.torrents.stop,
      arguments: {
        ids: ids
      },
    })

    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.stopTorrent.bind(this, callback)))
      .then(callback)
  }

  addTorrent(filename, callback) {
    body = JSON.stringify({
      method: this.methods.torrents.add,
      arguments: {
        filename: filename,
        paused: this.startPaused,
        "download-dir": this.downloadDir
      }
    })

    fetch(this.getBaseUrl(), this.compose("POST", body))
      .then((response) => this.checkResponse(response, this.addTorrent.bind(this, filename, callback)))
      .then(callback)
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
