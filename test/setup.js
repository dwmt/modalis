require('jsdom-global')(undefined, {pretendToBeVisual: true, url: 'http://localhost'})

window.Date = Date
