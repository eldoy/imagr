# Imagr

Analyze and convert images.

Made to be used for finding and converting sub-optimal images into optimal images for the web.

**Features:**

* Convert bmp, gif, jpg and png images to webp
* Create resized versions of original image

### Install

```
npm i -g imagr
```

### Usage

#### From the command line

Install an config file in `imagr.yml` or `app/config/imagr.yml`:
```yml
files:
  - name: some_file_name
    src: tests/files/eldoy-logo.jpg
    to: app/assets/img/eldoy-logo.webp
    versions:
      - name: large
        size: 600x1200
      - name: medium
        size: 400x800
      - name: thumb
        size: 200x300
```

Then run:
```
imagr convert
```

#### Programmatically

You can use `imagr` from your application.

First install with:
```
npm i imagr
```

Then use it:
```js
// Require it
const imagr = require('imagr')

// Convert images
await imagr.convert()
```

ISC Licensed. Enjoy!
