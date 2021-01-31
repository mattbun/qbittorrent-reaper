# Configuration

Configuration options are passed via environment variables. Available options are listed below:

| Name | Default | Description |
|---|---|---|
| QBITTORRENT_HOST | `localhost` | The hostname or IP address of the qbittorrent server  |
| QBITTORRENT_PORT | `8080` | The port to use when communicating with the qbittorrent server |
| QBITTORRENT_PROTOCOL | `http` | The protocol to use when communicating with the qbittorrent server (`http` or `https`) |
| QBITTORRENT_USERNAME | | The username to use when authenticating with qbittorrent |
| QBITTORRENT_PASSWORD | | The password to use when authenticating with qbittorrent |
| MAX_TORRENT_AGE | | Delete torrents older than this. See [here](https://www.npmjs.com/package/parse-duration) for possible values |
| DELETE_FILES | `false` | Delete downloaded files as well |
| DRY_RUN | `false` | Show which torrents would be removed but don't actually remove them |
