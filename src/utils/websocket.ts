import { Client, Packer, type Message } from 'due-client'
import { TokenValidate } from './const'

export let WebSocketClient: Client | null = null


export const connectWebSocket = (wsUrl: string, onOpen: () => void, onError: () => void) => {
  WebSocketClient = new Client({
    url: wsUrl,
    heartbeat: 10000,
    packer: new Packer({
      byteOrder: 'big',
      seqBytes: 4,
      routeBytes: 4,
      bufferBytes: 5000000, //5MB,需要跟服务器配置一样
    }),
  })

  WebSocketClient.onConnect(() => {
    onOpen()
    // c.request(1000, buffer, 2000)
    //   .then((message) => {
    //     console.log('响应消息111: ', new TextDecoder().decode(message.buffer))
    //   })
    //   .catch(() => {
    //     console.log('请求被拒绝111111111')
    //   })
  })

  WebSocketClient.onDisconnect((c) => {
    console.log('WebSocket 连接断开')
    onError()
    // 可选：重新连接
    c.connect()
  })

  WebSocketClient.onReceive((_c, message) => {
    // console.log(
    //   'reqId:' + message.seq,
    //   'route:' + message.route,
    //   '接收到消息: ' + new TextDecoder().decode(message.buffer),
    // )
    MsgMgr.HandleMessage(message)
  })

  WebSocketClient.onHeartbeat((_c, millisecond) => {
    if (millisecond) {
      // console.log('服务器心跳时间戳: ', millisecond)
    }
  })

  WebSocketClient.connect()
}

export const closeWebSocket = () => {
  if (WebSocketClient) {
    WebSocketClient.disconnect()
    WebSocketClient = null
  }
}


export const MsgMgr = {
  seqId: 0,
  handlerArr: new Array<{ route: number, func: (msg: object) => void }>(),

  //异步请求
  async Request(route: number, msg: object, timeout: number = 2000) {
    if (!WebSocketClient) {
      console.error('WebSocket 连接未建立，无法发送请求')
      return Promise.reject(new Error('WebSocket 连接未建立'))
    }


    const msgStr = JSON.stringify(msg)
    const msgBuffer = new TextEncoder().encode(msgStr)
    return WebSocketClient.request(route, msgBuffer, timeout)
      .then((message) => {
        const msgStr = new TextDecoder().decode(message.buffer)
        try {
          const msgObj = JSON.parse(msgStr)
          return msgObj
        } catch (e) {
          console.error('解码路由' + route + '消息失败:', e)
          return Promise.reject(new Error('解码消息失败'))
        }
      })
      .catch((error) => {
        console.error('请求被拒绝:', error)
        return Promise.reject(error)
      })
  },

  //同步发送,需要先监听
  Send(route: number, msg: object) {
    if (!WebSocketClient) {
      console.error('WebSocket 连接未建立，无法发送消息')
      return
    }

    this.seqId++
    const msgStr = JSON.stringify(msg)
    const msgBuffer = new TextEncoder().encode(msgStr)
    WebSocketClient.send({ seq: this.seqId, route, buffer: msgBuffer })
  },

  Register(route: number, handler: (msg: object) => void) {
    this.handlerArr.push({ route: route, func: handler })
  },

  Unregister(route: number, func: (msg: object) => void) {
    this.handlerArr = this.handlerArr.filter(evtCell => evtCell.route !== route || evtCell.func !== func)
  },

  HandleMessage(message: Message) {
    const msgStr = new TextDecoder().decode(message.buffer)
    let msgObj

    try {
      msgObj = JSON.parse(msgStr)
    } catch (e) {
      throw new Error(`处理路由 ${message.route} 的消息时发生错误 ${e}`)
    }

    for (const evtCell of this.handlerArr) {
      if (evtCell.route !== message.route) {
        continue
      }

      if (evtCell.func) {
        evtCell.func(msgObj)
      }
    }
  },

  StartConnect(wsUrl: string, errorCallback?: () => void) {
    if (WebSocketClient && WebSocketClient.isConnecting() || WebSocketClient && WebSocketClient.isConnected()) {
      console.warn('WebSocket 已经连接或正在连接')
      return
    }

    // WebSocket 连接成功后，发送登录请求
    connectWebSocket(wsUrl, () => {
      console.log('WebSocket 连接成功')
      const tokenStr = localStorage.getItem('token')
      if (tokenStr) {
        MsgMgr.Send(TokenValidate, { token: tokenStr })
      }
    }, () => {
      console.error('WebSocket 连接失败')
      if (errorCallback) {
        errorCallback()
      }
    })
  },
}
