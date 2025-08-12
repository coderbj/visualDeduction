// request/config.js
let TIME_OUT = 0

if(process.env.NODE_ENV === 'development') {
  TIME_OUT = 5000
} else if(process.env.NODE_ENV === 'production') {
  TIME_OUT = 5000
}

export {TIME_OUT}
