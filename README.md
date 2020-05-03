# XCLiveViewer

https://finomnis.github.io/XCLiveViewer

Displays livetracking data from [xcontest.org](https://www.xcontest.org).

Optimized for Mobile and Desktop. Installable on Android via Chrome's _'Add to home screen'_.

## Clone and Build

#### Prerequisites:
- npm

Download the project:
```bash
git clone https://github.com/Finomnis/XCLiveViewer.git
cd XCLiveViewer
```

Install dependencies:
```bash
npm install
```

Set Google Maps API key (replace `key` with your key):
```bash
# Linux:
cat "REACT_APP_GAPI_KEY=key" >.env

# Windows:
echo REACT_APP_GAPI_KEY=key >.env
```

Start server:
```bash
npm start
```

This should create a web server and open the page in a browser.
In case it doesn't, the address is:
```
http://localhost:3000/XCLiveViewer
```
