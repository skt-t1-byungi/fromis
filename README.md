# @byungi/promis
A simple promise implementation (~300Byte)

## Install
```
npm i @byungi/promis
```

### UMD
```html
<script src="http://unpkg.com/@byungi/promis">
```
## Example
```js
import promis from '@byungi/promis'

const promise = promis((resolve, reject) => { /* ... */ })
    .then(/* ... */)
    .catch(/* ... */)
```

## License
MIT
