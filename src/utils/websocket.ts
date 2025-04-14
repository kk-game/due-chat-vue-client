import { Client, Packer } from 'due-client'

let client: Client | null = null

export const connectWebSocket = (wsUrl: string, onOpen: () => void, onError: () => void) => {
  client = new Client({
    url: wsUrl,
    heartbeat: 10000,
    packer: new Packer({
      byteOrder: 'big',
      seqBytes: 4,
      routeBytes: 4,
      bufferBytes: 5000,
    }),
  })

  client.onConnect((c) => {
    console.log('WebSocket 连接成功')
    onOpen()

    // 示例：发送同步请求
    const tokenStr = localStorage.getItem('token')
    const reqEncode = new TextEncoder().encode(JSON.stringify({ token: tokenStr }))

    c.send({ route: 1000, buffer: reqEncode })

    // c.request(1000, buffer, 2000)
    //   .then((message) => {
    //     console.log('响应消息111: ', new TextDecoder().decode(message.buffer))
    //   })
    //   .catch(() => {
    //     console.log('请求被拒绝111111111')
    //   })
  })

  client.onDisconnect((c) => {
    console.log('WebSocket 连接断开')
    onError()
    // 可选：重新连接
    c.connect()
  })

  client.onReceive((c, message) => {
    console.log(
      'reqId:' + message.seq,
      'route:' + message.route,
      '接收到消息: ' + new TextDecoder().decode(message.buffer),
    )
  })

  client.onHeartbeat((c, millisecond) => {
    if (millisecond) {
      console.log('服务器心跳时间戳: ', millisecond)
    }
  })

  client.connect()
}

export const closeWebSocket = () => {
  if (client) {
    client.disconnect()
    client = null
  }
}
