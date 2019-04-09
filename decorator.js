/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// =====================================
//  以Decorator形式，提供常规页面描述函数  
//  Decorator分为两种：  
//   页面级别：`page`, `apis`  
//   字段级别: `fieldAlias`, `tableColumn`, `queryCondition`, `fieldEnums`  
// =====================================

/**
 * 使用`page`的class实例，会拥有以下方法：  
 *  emit: 发送一个事件  
 *  listen: 监听一个事件  
 *  getQueryConditions: 获取所有查询条件（通过@queryCondition注册的字段）  
 *  getTableColumns: 获取所有表格列（使用@tableColumn注册的字段）  
 *  getFieldEnums: 获取某个字段的枚举值  
 * 
 * @param {Class} target 
 * 
 */
export function page(target) {
  target.prototype.getQueryConditions = getQueryConditions
  target.prototype.getTableColumns = getTableColumns
  target.prototype.getFieldEnums = getFieldEnums
  target.prototype.getFieldAlias = function getFieldAlias(field) {
    return this.__field_alias__[field] || field
  }

  // 通信机制
  const evtListeners = {}
  target.prototype.emit = function emit(evtName, params) {
    const ls = evtListeners[evtName]
    if (!ls) return

    ls.forEach(fn => fn.call(this, params))
  }
  target.prototype.listen = function listen(evtName, handler) {
    const ls = evtListeners[evtName] || new Set()
    ls.add(handler)
    evtListeners[evtName] = ls

    return () => ls.delete(handler)
  }

  // listen通过@listener注册的事件
  ;
  (target.prototype.__init_listeners__ || [])
  .forEach(({
    evtName,
    handler
  }) => {
    target.prototype.listen(evtName, handler)
  })
  delete target.prototype.__init_listeners__
}

/**
 * 为字段添加别名，用于显示查询条件、table的title
 * @param {String} aliasName 字段别名
 * @return {Function} 字段Decorator
 */
export function fieldAlias(aliasName) {
  return (target, name, descriptor) => {
    if (!target.__field_alias__) target.__field_alias__ = {}
    target.__field_alias__[name] = aliasName

    return descriptor
  }
}

/**
 * 注册字段为查询条件
 * @param {Number} index 查询条件顺序 
 * @param {Function | ReactElement} renderFactory 自定义查询条件的节点
 * @param {Object} conditionOpts 查询条件配置，将作为renderFactory的参数
 * @return {Function} 字段Decorator
 */
export function queryCondition(index = 999, render, conditionOpts) {
  const idx = Number(index)
  if (Number.isNaN(idx)) throw new Error(`'index' must be a number`)

  return (target, name, descriptor) => {
    if (!target.__query_conditions__) target.__query_conditions__ = {}
    target.__query_conditions__[name] = {
      index: idx,
      render,
      conditionOpts,
    }
    return descriptor
  }
}

/**
 * 注册字段为表格列
 * @param {Number} index 表格title顺序
 * @param {Function | ReactElement} renderFactory 自定义表格渲染函数
 * @param {Object} columnOpts 表格列配置，将作为renderFactory的参数
 * @return {Function} 字段Decorator
 */
export function tableColumn(index = 999, renderFactory, columnOpts = {}) {
  const idx = Number(index)
  if (Number.isNaN(idx)) throw new Error(`'index' must be a number`)

  return (target, name, descriptor) => {
    if (!target.__table_columns__) target.__table_columns__ = {}
    target.__table_columns__[name] = {
      index: idx,
      columnOpts,
      renderFactory,
    }
    return descriptor
  }
}

/**
 * 为指定的字段（查询条件）自定义render函数
 * @param {String} field 字段名称
 */
export function conditionRender(field) {
  return (target, name, descriptor) => {
    if (!target.__condition_columns_render__) 
      target.__condition_columns_render__ = {}
    
    target.__condition_columns_render__[field] = name
    return descriptor
  }
}
/**
 * 为指定的字段（列）自定义render函数
 * @param {String} field 字段名称
 */
export function columnRender(field) {
  return (target, name, descriptor) => {
    if (!target.__table_columns_render__) target.__table_columns_render__ = {}
    target.__table_columns_render__[field] = name
    return descriptor
  }
}

/**
 * 定义字段为枚举类型，可将列表值key转换为enum的value显示，生成特定的查询条件
 * @param {Array<[key, value]>} enums 字段定位的枚举值
 * @return {Function} 字段Decorator
 */
export function fieldEnums(enums) {
  return (target, name, descriptor) => {
    if (!target.__enum_fields__) target.__enum_fields__ = {}
    target.__enum_fields__[name] = enums
    return descriptor
  }
}

/**
 * 在describer中监听事件
 * @param {String} evtName 监听的事件名
 */
export function listener(evtName) {
  return (target, name, desc) => {
    // listener比page先执行，此时target.listen不存在
    target.__init_listeners__ = target.__init_listeners__ || []
    target.__init_listeners__.push({
      evtName,
      handler: desc.value,
    })
    return desc
  }
}

/**
 * 获取所有查询条件（通过@queryCondition注册的字段）
 * @return {Array<Object>} 每个元素包含field、fieldAlias、enums、conditionOpts、render?
 */
function getQueryConditions() {
  const conditionRenders = this.__condition_columns_render__ || {}
  return Object.entries(this.__query_conditions__ || {})
    .sort(([, a], [, b]) => a.index - b.index)
    .map(([field, {
      render,
      conditionOpts
    }]) => {
      const params = {
        field,
        fieldAlias: this.getFieldAlias(field),
        enums: this.getFieldEnums(field),
        conditionOpts,
      }
      const rOrEl = conditionRenders[field] || render
      return {
        ...params,
        render: typeof rOrEl === 'function'
          ? rOrEl(params) 
          : rOrEl // 非函数 期望为Element
      }
    })
}

/**
 * 获取所有表格列（使用@tableColumn注册的字段）
 * @return {Array<Object>} 每个元素包含：field、fieldAlias、columnOpts、enums、render? 
 */
function getTableColumns() {
  const colRenders = this.__table_columns_render__

  return Object.entries(this.__table_columns__ || {})
    .sort(([, a], [, b]) => a.index - b.index)
    .map(([field, {
      columnOpts,
      renderFactory
    }]) => {
      const factoryParams = {
        field,
        columnOpts: Object.assign({
          dataIndex: field
        }, columnOpts),
        fieldAlias: this.getFieldAlias(field),
        enums: this.getFieldEnums(field),
      }
      let render
      if (colRenders && colRenders[field]) {
        render = (...rArgs) => this[colRenders[field]](rArgs, factoryParams)
      } else if (renderFactory) {
        render = (...rArgs) => renderFactory(rArgs, factoryParams)
      }
      return {
        ...factoryParams,
        render,
      }
    })
}

/**
 * 获取某个字段的枚举值
 * @param {String} field 字段名
 * @return {Array}
 */
function getFieldEnums(field) {
  return this.__enum_fields__[field]
}

// -----------------Form-----------------------
export function inputComponent(component, options) {
  return (target, name, descriptor) => {
    if (!target.__input_component__) target.__input_component__ = {}
    target.__input_component__[name] = {
      component,
      options,
    }
    return descriptor
  }
}