import { Base64 } from 'js-base64'
export function baseEncode(val){
  // base64加密
  let encodeVal = Base64.encode(val)
  return encodeVal
}
