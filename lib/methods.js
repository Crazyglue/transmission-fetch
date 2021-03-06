const methods = {
  torrents: {
    stop: 'torrent-stop',
    start: 'torrent-start',
    startNow: 'torrent-start-now',
    verify: 'torrent-verify',
    reannounce: 'torrent-reannounce',
    set: 'torrent-set',
    setTypes: {
      'bandwidthPriority': true,
      'downloadLimit': true,
      'downloadLimited': true,
      'files-wanted': true,
      'files-unwanted': true,
      'honorsSessionLimits': true,
      'ids': true,
      'location': true,
      'peer-limit': true,
      'priority-high': true,
      'priority-low': true,
      'priority-normal': true,
      'seedRatioLimit': true,
      'seedRatioMode': true,
      'uploadLimit': true,
      'uploadLimited': true
    },
    add: 'torrent-add',
    addTypes: {
      'download-dir': true,
      'filename': true,
      'metainfo': true,
      'paused': true,
      'peer-limit': true,
      'files-wanted': true,
      'files-unwanted': true,
      'priority-high': true,
      'priority-low': true,
      'priority-normal': true
    },
    rename: 'torrent-rename-path',
    remove: 'torrent-remove',
    removeTypes: {
      'ids': true,
      'delete-local-data': true
    },
    location: 'torrent-set-location',
    locationTypes: {
      'location': true,
      'ids': true,
      'move': true
    },
    get: 'torrent-get',
    fields: [
      'activityDate',
      'addedDate',
      'bandwidthPriority',
      'comment',
      'corruptEver',
      'creator',
      'dateCreated',
      'desiredAvailable',
      'doneDate',
      'downloadDir',
      'downloadedEver',
      'downloadLimit',
      'downloadLimited',
      'error',
      'errorString',
      'eta',
      'files',
      'fileStats',
      'hashString',
      'haveUnchecked',
      'haveValid',
      'honorsSessionLimits',
      'id',
      'isFinished',
      'isPrivate',
      'leftUntilDone',
      'magnetLink',
      'manualAnnounceTime',
      'maxConnectedPeers',
      'metadataPercentComplete',
      'name',
      'peer-limit',
      'peers',
      'peersConnected',
      'peersFrom',
      'peersGettingFromUs',
      'peersKnown',
      'peersSendingToUs',
      'percentDone',
      'pieces',
      'pieceCount',
      'pieceSize',
      'priorities',
      'rateDownload',
      'rateUpload',
      'recheckProgress',
      'seedIdleLimit',
      'seedIdleMode',
      'seedRatioLimit',
      'seedRatioMode',
      'sizeWhenDone',
      'startDate',
      'status',
      'trackers',
      'trackerStats',
      'totalSize',
      'torrentFile',
      'uploadedEver',
      'uploadLimit',
      'uploadLimited',
      'uploadRatio',
      'wanted',
      'webseeds',
      'webseedsSendingToUs']
  },
  session: {
    stats: 'session-stats',
    get: 'session-get',
    set: 'session-set',
    setTypes: {
      'start-added-torrents': true,
      'alt-speed-down': true,
      'alt-speed-enabled': true,
      'alt-speed-time-begin': true,
      'alt-speed-time-enabled': true,
      'alt-speed-time-end': true,
      'alt-speed-time-day': true,
      'alt-speed-up': true,
      'blocklist-enabled': true,
      'dht-enabled': true,
      'encryption': true,
      'download-dir': true,
      'peer-limit-global': true,
      'peer-limit-per-torrent': true,
      'pex-enabled': true,
      'peer-port': true,
      'peer-port-random-on-start': true,
      'port-forwarding-enabled': true,
      'seedRatioLimit': true,
      'seedRatioLimited': true,
      'speed-limit-down': true,
      'speed-limit-down-enabled': true,
      'speed-limit-up': true,
      'speed-limit-up-enabled': true
    }
  },
  other: {
    blockList: 'blocklist-update',
    port: 'port-test',
    freeSpace: 'free-space'
  }

}

export const torrentStatusMap = [
  'Stopped',          /* Torrent is stopped */
  'Queued',           /* Queued to check files */
  'Checking',         /* Checking files */
  'Queued for DL',    /* Queued to download */
  'Downloading',      /* Downloading */
  'Queue to seed',    /* Queued to seed */
  'Seeding'           /* Seeding */
]

export default methods
