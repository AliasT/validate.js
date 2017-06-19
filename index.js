/*
 * author: chai_xb@163.com
 * date: 2017-06-19 15:35
 */
import { Toast } from 'mint-ui'
import "mint-ui/lib/toast/style.css"

export const rules = {
  _max(item) {
    if('max' in item) return +item.value < item.max
    return true
  },
  _min(item) {
    if('min' in item) return +item.value > item.min
    return true
  },
  _reg(item) {
    if(item.reverse) return !item.reg.test(item.value)
    else return item.reg.test(item.value)
  }
}

/**
 * {
 *   desc: '用户名'
 *   name: 'name',
 *   type: 'name',
 *   value: '3333',
 *   required？: true,
 *   reverse: false
 *   message？: '请输入手机号'
 * }
 */
export default class Validator {
  status = true

  sets = []
  constructor(sets, success, error) {
    this.success = success
    this.error = error
    this.sets = Object.keys(sets).map(key => {
      let item = sets[key]
      if(!item.message) item.message = findMessage(key)
      if(!item.reg) item.reg = findReg(key)
      return item
    })
    this.build()
    this.after()
  }

  build() {
    const funcKeys = Object.keys(rules)
    for(let i = 0, n = this.sets.length; i < n; i++) {
      let item = this.sets[i]
      for(let j = 0, m = funcKeys.length; j < m; j ++) {
        let func = rules[funcKeys[j]]
        this.status = func(item)
        if(!this.status) {
          this.message = item.message
          return
        }
      }
    }
  }

  after() {
    if(!this.status) {
      if(this.error) this.error()
      else Toast(this.message)
    } else {
      this.success && this.success()
    }
  }
}



export function findReg(key) {
  const RegMap = {
    phone: /^1[3|4|5|7|8][0-9]{9}$/,
    blank: /^\s$/,
    money: /^[1-9]\d*$|^\d+\.\d+$/,
    code: /\d{6}/
  }
  return RegMap[key] || RegMap.blank
}

export function findMessage(type) {
  const results = {
    phone: '请输入有效的手机号',
    name: '请输入有效的用户名',
    money: '请输入有效的金额',
    code: '验证码无效'
  }
  if(results[type]) return results[type]
  else return '输入无效'
}
