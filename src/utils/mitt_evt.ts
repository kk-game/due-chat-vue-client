import mitt from 'mitt';

type Events = {
  [key: string]: object; // 可根据需要自定义事件类型
};

const emitter = mitt<Events>();

export default emitter;
