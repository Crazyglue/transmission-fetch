'use-strict'

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

    console.log("params", params)
    return params
  }

  getSessionId() {
    fetch(this.getBaseUrl(), this.compose("GET"))
    .then((response) => {
      if (response.ok === false && response.status === 409) {
        console.log("response", response)
        var session = response.headers.map['x-transmission-session-id'][0].split("\n")[0]
        console.log("Setting session id: " + session)
        this.sessionId = session
      }
      else {
        console.warn(response)
        throw new Error("Failed to ping. Check URL, port, and transmission availability")
      }
    })

  }

  getTorrentInfo(ids = []) {
    torrentParams = {
      fields: [
        'rateDownload',
        'rateUpload',
        'status',
        'name',
        'sizeWhenDone',
        'eta',
        'percentDone',
        'leftUntilDone',
      ]
    }

    body = JSON.stringify({
      method: "torrent-get",
      arguments: torrentParams,
    })

    console.log("getInfo body", body)
    return fetch(this.getBaseUrl(), this.compose("POST", body))
  }

  getTransmissionStats() {
    console.log("Getting transmission stats...")

    body = JSON.stringify({
      method: "session-get"
    })

    return fetch(this.getBaseUrl(), this.compose("POST", body))
  }

  getSessionStats() {
    console.log("Getting session stats...")

    body = JSON.stringify({
      method: "session-stats"
    })

    return fetch(this.getBaseUrl(), this.compose("POST", body))
  }

  addTorrent(filename) {
    body = JSON.stringify({
      method: "torrent-add",
      arguments: {
        filename: filename,
        paused: this.startPaused,
        "download-dir": this.downloadDir
      }
    })

    return fetch(this.getBaseUrl(), this.compose("POST", body))
  }

  setLocalUrl(url) { this.url = url }
  setLocalPort(port) { this.port = port }
  setSessionId(id) { this.sessionId = id }
  setDownloadDir(dir) { this.downloadDir = dir }
  setStartPaused(paused) { this.startPaused = paused }

  getLocalUrl() { return this.localUrl }
  getLocalPort() { return this.localPort }
  getDownloadDir() { return this.downloadDir }
  getStartPaused() { return this.startPaused }


  parseTorrentStatus(status) {
    return this.statusMap[status]
  }



}
