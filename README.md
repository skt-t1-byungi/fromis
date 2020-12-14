# fromis
A simple promise implementation (~300Byte)

![fromis9](logo.png)

## Install
```
npm i fromis
```

### UMD
```html
<script src="http://unpkg.com/fromis">
```
## Example
```js
import fromis from 'fromis'

const promise = fromis((resolve, reject) => { /* ... */ })
    .then(/* ... */)
    .catch(/* ... */)
```

## License
MIT
